import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, Download, Play } from "lucide-react";

const BuildPlan = () => {
  const [zoom, setZoom] = useState(100);

  const steps = [
    { id: 1, title: "UI Design", status: "completed", x: 100, y: 100 },
    { id: 2, title: "Database Setup", status: "completed", x: 300, y: 100 },
    { id: 3, title: "Authentication", status: "in-progress", x: 200, y: 200 },
    { id: 4, title: "API Endpoints", status: "pending", x: 400, y: 200 },
    { id: 5, title: "Integrations", status: "pending", x: 300, y: 300 },
    { id: 6, title: "Testing", status: "pending", x: 500, y: 300 },
  ];

  const connections = [
    { from: 1, to: 3 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Build Plan</h1>
            <p className="text-muted-foreground text-lg">
              Visual roadmap of your development journey
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground w-16 text-center">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="min-h-[600px]">
              <CardContent className="p-6">
                <div 
                  className="relative bg-accent/20 rounded-lg overflow-auto"
                  style={{ 
                    height: "600px",
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top left"
                  }}
                >
                  <svg className="absolute inset-0 w-full h-full">
                    {connections.map((conn, index) => {
                      const fromStep = steps.find(s => s.id === conn.from);
                      const toStep = steps.find(s => s.id === conn.to);
                      if (!fromStep || !toStep) return null;
                      
                      return (
                        <line
                          key={index}
                          x1={fromStep.x + 60}
                          y1={fromStep.y + 40}
                          x2={toStep.x + 60}
                          y2={toStep.y + 40}
                          stroke="hsl(var(--border))"
                          strokeWidth="2"
                          strokeDasharray="4"
                        />
                      );
                    })}
                  </svg>
                  
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className="absolute cursor-move"
                      style={{ 
                        left: `${step.x}px`, 
                        top: `${step.y}px`,
                        width: "120px"
                      }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(step.status)} mb-2`} />
                          <p className="text-sm font-medium">{step.title}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {step.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Completed</span>
                      <span className="text-sm font-semibold">33%</span>
                    </div>
                    <div className="h-2 bg-accent rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "33%" }} />
                    </div>
                  </div>
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm">Completed: 2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm">In Progress: 1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-muted" />
                      <span className="text-sm">Pending: 3</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Step</CardTitle>
                <CardDescription>Authentication</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Implement user authentication with email and social login options
                </p>
                <Button className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Start Building
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildPlan;