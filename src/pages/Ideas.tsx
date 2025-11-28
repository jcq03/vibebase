import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShoppingCart, Home as HomeIcon, Dumbbell, Wrench, Users, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!selectedNiche && !customPrompt) {
      toast({
        title: "Selection Required",
        description: "Please select a niche or enter a custom prompt",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const ideas = [
        {
          concept: `AI-Powered ${selectedNiche || "Business"} Platform`,
          audience: "Small to medium businesses",
          problem: "Manual processes and inefficient workflows",
          angle: "Automated solution with intelligent recommendations"
        },
        {
          concept: `${selectedNiche || "Industry"} Marketplace`,
          audience: "Professionals and service providers",
          problem: "Difficulty connecting with clients",
          angle: "Smart matching algorithm with built-in communication"
        },
        {
          concept: `${selectedNiche || "Sector"} Analytics Dashboard`,
          audience: "Business owners and managers",
          problem: "Lack of data-driven insights",
          angle: "Real-time analytics with predictive modeling"
        },
      ];
      
      setGeneratedIdeas(ideas);
      setIsGenerating(false);
      toast({
        title: "Ideas Generated!",
        description: "3 unique concepts ready for you"
      });
    }, 2000);
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
                  <Label htmlFor="prompt">Custom Prompt (Optional)</Label>
                  <Input
                    id="prompt"
                    placeholder="Describe your idea..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
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
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">Target Audience</p>
                        <p className="text-foreground">{idea.audience}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">Problem Solved</p>
                        <p className="text-foreground">{idea.problem}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">Unique Angle</p>
                        <p className="text-foreground">{idea.angle}</p>
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