import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Wrench, GraduationCap, Video, BarChart3, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "01.",
      title: "Connect GitHub",
      description: "Code Vibez Tool Kit ingests your repo and any research to build a visual knowledge base ready for planning.",
      active: true
    },
    {
      number: "02.",
      title: "Customize Features",
      description: "Describe how each feature should work, including UI, routes, models, and file paths, in as much detail as you need.",
      active: false
    },
    {
      number: "03.",
      title: "Generate PRDs",
      description: "Create product requirement docs for new features and auto-document existing ones so you can debug and organize your system.",
      active: false
    },
    {
      number: "04.",
      title: "Track Progress",
      description: "Monitor your app building journey with visual milestones and stay motivated with progress tracking.",
      active: false
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "@sarahj_dev",
      text: "Code Vibez day one: docs organized, cursor-tuned, hyper-restored. This toolkit is incredible!",
      stars: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      text: "The task management and PRD features streamline my entire workflow. Love it!",
      stars: 5,
      avatar: "MC"
    },
    {
      name: "Emma Davis",
      text: "Game-changing for solo developers. It's like having a whole team at my fingertips!",
      stars: 5,
      avatar: "ED"
    },
    {
      name: "Alex Rivera",
      text: "Works perfectly with my workflow. My productivity has skyrocketed!",
      stars: 5,
      avatar: "AR"
    },
    {
      name: "Jessica Wong",
      text: "This is a great app so far. Looking forward to continuing to learn to build apps and then subsequently launch and sell them.",
      stars: 5,
      avatar: "JW"
    },
    {
      name: "David Park",
      text: "Code Vibez turned me from a beginner into a productive developer. Incredible value!",
      stars: 5,
      avatar: "DP"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Code Vibez Tool Kit</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign in
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Get started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block px-4 py-2 bg-muted rounded-full text-sm font-medium mb-4">
              Special Offer: Get Started Today
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Build Your First App in{" "}
              <span className="block mt-2">30 Days</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get started today, and receive all new features for free: AI-powered tools, step-by-step guidance, live build calls and more
            </p>
            <div className="text-sm text-muted-foreground">
              Value: <span className="line-through">£99</span> — get it for <span className="font-bold text-foreground">£29</span> for a full year
            </div>
            <Button 
              size="lg" 
              className="text-lg px-10 py-6 h-auto rounded-full"
              onClick={() => navigate("/auth")}
            >
              Start Building Now
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-12">
            How It Works
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                From idea to app in minutes
              </h2>
              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                Code Vibez analyzes your codebase, helps you plan new features with precision, and keeps your team aligned with automatically generated docs.
              </p>
              
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      step.active
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className={`text-2xl font-bold ${step.active ? "text-primary" : "text-muted-foreground"}`}>
                        {step.number}
                      </span>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-2 ${step.active ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative lg:sticky lg:top-24">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border-2 border-border flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-24 h-24 rounded-2xl bg-primary/20 backdrop-blur-sm mx-auto flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-primary" />
                  </div>
                  <p className="text-lg font-medium text-muted-foreground">
                    Visual workflow diagram
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by Builders
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers building their dream apps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center gap-3 pt-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      {testimonial.role && (
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to build your first app
            </p>
          </div>

          <Card className="max-w-lg mx-auto border-2 border-primary">
            <CardHeader className="text-center pb-8 space-y-2">
              <CardTitle className="text-3xl">Pro Builder</CardTitle>
              <div className="mt-4">
                <span className="text-6xl font-bold">£29</span>
                <span className="text-muted-foreground text-lg">/month</span>
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
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
              <Button className="w-full mt-8" size="lg" onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Code Vibez Tool Kit</h3>
              </div>
              <p className="text-muted-foreground">
                Build your first app in 30 days
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </Button>
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
