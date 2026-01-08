import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Globe, Briefcase } from "lucide-react";
import { getAllTechStacks, TechStack } from "@/data/techStack";

const Tools = () => {
  const techStacks = getAllTechStacks();

  const getIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return Smartphone;
      case "saas":
        return Briefcase;
      default:
        return Globe;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "mobile":
        return "from-blue-500 to-cyan-500";
      case "saas":
        return "from-purple-500 to-pink-500";
      default:
        return "from-green-500 to-emerald-500";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "build & code":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "build":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "backend":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "paywall":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "hosting":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case "domain":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
    }
  };

  const StackSection = ({ stack }: { stack: TechStack }) => {
    const Icon = getIcon(stack.type);
    const color = getColor(stack.type);

    return (
      <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
              <CardTitle className="text-2xl text-zinc-100">{stack.title}</CardTitle>
              <CardDescription className="mt-1 text-zinc-400">{stack.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
          <div className="space-y-3">
            {stack.tools.map((tool, index) => (
            <div
              key={index}
                className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-lg hover:border-zinc-600 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-zinc-100">{tool.name}</h3>
                  <Badge className={`text-xs ${getCategoryColor(tool.category)}`}>
                    {tool.category}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-400">{tool.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-zinc-100">Recommended Tech Stack</h1>
          <p className="text-zinc-400 text-lg">
            Curated AI tools and services for different app types
          </p>
        </div>

        <div className="space-y-6">
          {techStacks.map((stack) => (
            <StackSection key={stack.type} stack={stack} />
          ))}
        </div>

        <div className="mt-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <h2 className="text-xl font-semibold text-zinc-100 mb-3">💡 Pro Tip</h2>
          <p className="text-zinc-400">
            When you create a new project, the whiteboard will automatically recommend the best tools 
            based on your chosen application type. This helps you get started faster with the right stack!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tools;
