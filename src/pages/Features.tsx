import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sparkles, GripVertical, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Features = () => {
  const [coreFeatures, setCoreFeatures] = useState([
    { id: 1, name: "User Authentication", checked: true, priority: "high" },
    { id: 2, name: "Dashboard", checked: true, priority: "high" },
    { id: 3, name: "Data Management", checked: true, priority: "medium" },
    { id: 4, name: "Search & Filters", checked: false, priority: "medium" },
  ]);

  const [advancedFeatures, setAdvancedFeatures] = useState([
    { id: 5, name: "Real-time Notifications", checked: false, priority: "low" },
    { id: 6, name: "Analytics Dashboard", checked: false, priority: "medium" },
    { id: 7, name: "API Integration", checked: false, priority: "low" },
    { id: 8, name: "Mobile App", checked: false, priority: "low" },
  ]);

  const [monetization] = useState([
    "Subscription Model",
    "Freemium",
    "One-time Payment",
    "Usage-based Pricing"
  ]);

  const { toast } = useToast();

  const toggleFeature = (id: number, isCore: boolean) => {
    if (isCore) {
      setCoreFeatures(prev =>
        prev.map(f => f.id === id ? { ...f, checked: !f.checked } : f)
      );
    } else {
      setAdvancedFeatures(prev =>
        prev.map(f => f.id === id ? { ...f, checked: !f.checked } : f)
      );
    }
  };

  const generateMoreFeatures = () => {
    toast({
      title: "Generating Features",
      description: "AI is analyzing your idea..."
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Feature Generator</h1>
          <p className="text-muted-foreground text-lg">
            Define and organize your app's functionality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Core Features</CardTitle>
                    <CardDescription>Essential functionality for MVP</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={generateMoreFeatures}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate More
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coreFeatures.map((feature) => (
                    <div 
                      key={feature.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors cursor-move"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <Checkbox 
                        checked={feature.checked}
                        onCheckedChange={() => toggleFeature(feature.id, true)}
                      />
                      <span className="flex-1">{feature.name}</span>
                      <Badge variant={feature.priority === "high" ? "default" : "secondary"}>
                        {feature.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Features</CardTitle>
                <CardDescription>Optional enhancements for growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {advancedFeatures.map((feature) => (
                    <div 
                      key={feature.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors cursor-move"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <Checkbox 
                        checked={feature.checked}
                        onCheckedChange={() => toggleFeature(feature.id, false)}
                      />
                      <span className="flex-1">{feature.name}</span>
                      <Badge variant="outline">{feature.priority}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Monetization Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monetization.map((option, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                    >
                      <p className="font-medium">{option}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>User signs up</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Completes onboarding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Explores main features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Achieves first value</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-muted" />
                    <span>Becomes paying customer</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;