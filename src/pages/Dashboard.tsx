import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Layers, Wrench, Map, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Generate Idea",
      description: "Start with an AI-powered idea for your next project",
      icon: Lightbulb,
      action: () => navigate("/ideas"),
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Plan Features",
      description: "Define core features and user journeys",
      icon: Layers,
      action: () => navigate("/features"),
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Choose Tools",
      description: "Get tech stack recommendations",
      icon: Wrench,
      action: () => navigate("/tools"),
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Build Plan",
      description: "Visualize your development roadmap",
      icon: Map,
      action: () => navigate("/build-plan"),
      color: "from-orange-500 to-red-500"
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to CodeVibez</h1>
          <p className="text-muted-foreground text-lg">
            Your AI-powered companion for building amazing software
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="group cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={action.action}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                  Start <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Follow these steps to bring your idea to life</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Choose a niche or enter your own idea",
                "Generate and refine feature sets",
                "Select the right tools and tech stack",
                "Visualize your build plan",
                "Get AI assistance while coding"
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-foreground">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;