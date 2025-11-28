import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Database, Cpu, Cloud, Palette, Zap } from "lucide-react";

const Tools = () => {
  const aiTools = [
    { name: "Lovable", description: "Full-stack AI development", icon: Zap, tag: "Recommended" },
    { name: "Cursor", description: "AI-powered IDE", icon: Code, tag: "Popular" },
    { name: "Replit AI", description: "Collaborative coding", icon: Cpu, tag: "Cloud-based" },
  ];

  const frontendTools = [
    { name: "React", description: "UI library", icon: Code },
    { name: "Next.js", description: "React framework", icon: Code },
    { name: "Tailwind CSS", description: "Utility-first CSS", icon: Palette },
  ];

  const backendTools = [
    { name: "Node.js", description: "JavaScript runtime", icon: Cpu },
    { name: "Supabase", description: "Backend as a service", icon: Cloud },
    { name: "Express", description: "Web framework", icon: Code },
  ];

  const databaseTools = [
    { name: "PostgreSQL", description: "Relational database", icon: Database },
    { name: "MongoDB", description: "NoSQL database", icon: Database },
    { name: "Redis", description: "In-memory cache", icon: Database },
  ];

  const ToolSection = ({ title, tools, description }: any) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool: any, index: number) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <tool.icon className="h-5 w-5 text-primary" />
                </div>
                {tool.tag && (
                  <Badge variant="secondary" className="text-xs">
                    {tool.tag}
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold mb-1">{tool.name}</h3>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
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
          <h1 className="text-4xl font-bold mb-2">Tech Stack</h1>
          <p className="text-muted-foreground text-lg">
            AI-recommended tools for your project
          </p>
        </div>

        <div className="space-y-6">
          <ToolSection 
            title="AI Development Tools"
            description="Accelerate development with AI assistance"
            tools={aiTools}
          />
          
          <ToolSection 
            title="Frontend Technologies"
            description="Build beautiful user interfaces"
            tools={frontendTools}
          />
          
          <ToolSection 
            title="Backend Technologies"
            description="Power your application logic"
            tools={backendTools}
          />
          
          <ToolSection 
            title="Database Options"
            description="Store and manage your data"
            tools={databaseTools}
          />
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recommended Stack</CardTitle>
            <CardDescription>Based on your project requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Lovable</Badge>
              <Badge variant="default">React</Badge>
              <Badge variant="default">Tailwind CSS</Badge>
              <Badge variant="default">Supabase</Badge>
              <Badge variant="default">PostgreSQL</Badge>
            </div>
            <Button className="mt-4">Apply This Stack</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tools;