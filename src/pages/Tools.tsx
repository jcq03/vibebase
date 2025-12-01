import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Globe, Briefcase } from "lucide-react";

const Tools = () => {
  const mobileStack = [
    { name: "React Native", category: "Framework" },
    { name: "Capacitor", category: "Native Bridge" },
    { name: "Expo", category: "Development Platform" },
    { name: "Firebase", category: "Backend" },
    { name: "React Navigation", category: "Routing" },
    { name: "AsyncStorage", category: "Local Storage" },
  ];

  const saasStack = [
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Framework" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "Supabase", category: "Backend" },
    { name: "Stripe", category: "Payments" },
    { name: "PostgreSQL", category: "Database" },
    { name: "Vercel", category: "Hosting" },
    { name: "Redis", category: "Caching" },
  ];

  const webAppStack = [
    { name: "React", category: "Frontend" },
    { name: "Vite", category: "Build Tool" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "shadcn/ui", category: "Components" },
    { name: "React Router", category: "Routing" },
    { name: "Zustand", category: "State Management" },
  ];

  const StackSection = ({ title, description, icon: Icon, stack, color }: any) => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {stack.map((tech: any, index: number) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:shadow-md transition-all hover:border-primary"
            >
              <h3 className="font-semibold text-sm mb-1">{tech.name}</h3>
              <p className="text-xs text-muted-foreground">{tech.category}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tech Stack Recommendations</h1>
          <p className="text-muted-foreground text-lg">
            Curated technology stacks for different app types
          </p>
        </div>

        <div className="space-y-6">
          <StackSection 
            title="Mobile App Tech Stack"
            description="Build cross-platform mobile applications"
            icon={Smartphone}
            color="from-blue-500 to-cyan-500"
            stack={mobileStack}
          />
          
          <StackSection 
            title="SaaS Tech Stack"
            description="Create scalable software-as-a-service platforms"
            icon={Briefcase}
            color="from-purple-500 to-pink-500"
            stack={saasStack}
          />
          
          <StackSection 
            title="Web App Tech Stack"
            description="Develop responsive web applications"
            icon={Globe}
            color="from-green-500 to-emerald-500"
            stack={webAppStack}
          />
        </div>
      </div>
    </div>
  );
};

export default Tools;