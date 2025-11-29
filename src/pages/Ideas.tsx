import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ShoppingCart, Home as HomeIcon, Dumbbell, Wrench, Users, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const niches = [
  { name: "E-commerce", icon: ShoppingCart, color: "from-blue-500 to-cyan-500" },
  { name: "Real Estate", icon: HomeIcon, color: "from-green-500 to-emerald-500" },
  { name: "Fitness", icon: Dumbbell, color: "from-red-500 to-orange-500" },
  { name: "Trades", icon: Wrench, color: "from-yellow-500 to-amber-500" },
  { name: "Creators", icon: Users, color: "from-purple-500 to-pink-500" },
  { name: "SaaS", icon: Briefcase, color: "from-indigo-500 to-blue-500" },
];

const Ideas = () => {
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!selectedNiche) {
      toast({
        title: "Selection Required",
        description: "Please select a niche",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-ideas', {
        body: { niche: selectedNiche, description }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }

      setGeneratedIdeas(data.ideas || []);
      toast({
        title: "Ideas Generated!",
        description: `${data.ideas?.length || 0} unique concepts ready for you`
      });
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast({
        title: "Error",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Idea Generator</h1>
          <p className="text-muted-foreground text-lg">
            Let AI help you discover your next big project
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Niche</CardTitle>
                <CardDescription>Select an industry or enter custom idea</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {niches.map((niche) => (
                    <Button
                      key={niche.name}
                      variant={selectedNiche === niche.name ? "default" : "outline"}
                      className="h-20 flex flex-col gap-2"
                      onClick={() => setSelectedNiche(niche.name)}
                    >
                      <niche.icon className="h-5 w-5" />
                      <span className="text-sm">{niche.name}</span>
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you're looking for..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate Ideas"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-4">
              {generatedIdeas.length === 0 ? (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Select a niche and generate ideas to see results
                    </p>
                  </CardContent>
                </Card>
              ) : (
                generatedIdeas.map((idea, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{idea.concept}</CardTitle>
                          <Badge variant="secondary">{selectedNiche}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {idea.description && (
                        <div>
                          <p className="text-foreground">{idea.description}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground mb-2">Key Features</p>
                        <ul className="space-y-1">
                          {idea.features?.map((feature: string, idx: number) => (
                            <li key={idx} className="text-foreground text-sm flex items-start">
                              <span className="mr-2">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button className="w-full mt-4">Select This Idea</Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ideas;