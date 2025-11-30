import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Check } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

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

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("waitlist")
        .insert([{ email: email.trim().toLowerCase() }]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already on the list!",
            description: "This email is already registered. We'll keep you updated!",
          });
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
        toast({
          title: "You're on the list!",
          description: "We'll notify you when we launch.",
        });
      }
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Coming Soon</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Build Your First App in{" "}
              <span className="block mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                30 Days
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join the waitlist for Code Vibez Tool Kit - AI-powered tools, step-by-step guidance, and live support to help you build and launch your first app.
            </p>

            {isSuccess ? (
              <div className="max-w-md mx-auto p-8 rounded-2xl bg-primary/5 border border-primary/20">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">You're on the list!</h3>
                <p className="text-muted-foreground">
                  We'll send you an email when we launch. Get ready to start building!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-12 text-base"
                    disabled={isLoading}
                    required
                  />
                  <Button 
                    type="submit"
                    size="lg" 
                    className="h-12 px-8"
                    disabled={isLoading}
                  >
                    {isLoading ? "Joining..." : "Join Waitlist"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Be the first to know when we launch. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              What You'll Get
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-Powered Tools",
                  description: "Smart assistants to help you plan, build, and debug your app faster than ever.",
                },
                {
                  title: "Step-by-Step Courses",
                  description: "Learn to build real apps with guided tutorials designed for beginners.",
                },
                {
                  title: "Live Support",
                  description: "Join weekly build calls and get help from experienced developers.",
                },
              ].map((feature, index) => (
                <div key={index} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Code Vibez Tool Kit</span>
            </div>
            <p className="text-muted-foreground text-center">
              Build your first app in 30 days
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Code Vibez Tool Kit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
