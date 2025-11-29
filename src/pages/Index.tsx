import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Wrench, GraduationCap, Video, BarChart3, Twitter, Linkedin, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Idea Generator",
      description: "Get unique, validated app ideas tailored to your skills and interests"
    },
    {
      icon: Wrench,
      title: "Full Tool Kit From Idea To Building",
      description: "Everything you need from concept to deployment in one place"
    },
    {
      icon: GraduationCap,
      title: "Step-by-Step Courses",
      description: "Learn by building with structured lessons and hands-on projects"
    },
    {
      icon: Video,
      title: "Live Build Calls",
      description: "Join weekly sessions where we build real apps together"
    },
    {
      icon: BarChart3,
      title: "Build Tracker",
      description: "Track your progress and stay motivated with visual milestones"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Build Your First App in{" "}
              <span className="text-primary">30 Days</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From idea to reality with AI-powered tools, step-by-step guidance, and a supportive community
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 h-auto"
              onClick={() => navigate("/projects")}
            >
              Start Building
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A complete toolkit designed to take you from beginner to builder
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to build your first app
            </p>
          </div>

          <Card className="max-w-lg mx-auto border-2 border-primary/50">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl mb-2">Pro Builder</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold">£29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "AI-Powered Idea Generator",
                "Full Tool Kit Access",
                "All Step-by-Step Courses",
                "Weekly Live Build Calls",
                "Build Tracker & Analytics",
                "Private Community Access",
                "Priority Support"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
              <Button className="w-full mt-8" size="lg" onClick={() => navigate("/projects")}>
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Code Vibez Tool Kit</h3>
              <p className="text-muted-foreground">
                Build your first app in 30 days
              </p>
            </div>
            
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Code Vibez Tool Kit. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
