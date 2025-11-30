import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Waitlist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("waitlist")
        .insert([{ email }]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already registered",
            description: "This email is already on the waitlist",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
        toast({
          title: "Success!",
          description: "You've been added to the waitlist",
        });
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-4xl md:text-5xl font-bold">
                Join the Waitlist
              </CardTitle>
              <CardDescription className="text-lg">
                Be the first to know when we launch new features and exclusive content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="text-lg h-12"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Joining..." : "Join Waitlist"}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4 py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">You're on the list!</h3>
                  <p className="text-muted-foreground">
                    We'll notify you as soon as we launch
                  </p>
                  <Button onClick={() => navigate("/")} variant="outline">
                    Back to Home
                  </Button>
                </div>
              )}

              <div className="pt-6 space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  What you'll get:
                </p>
                <div className="space-y-2">
                  {[
                    "Early access to new features",
                    "Exclusive discounts and offers",
                    "Priority support",
                    "Updates on launches and events"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
