import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Code, RefreshCw, FileCode, Smartphone, Server } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BuildAssistant = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI build assistant. How can I help you today?" }
  ]);
  const { toast } = useToast();

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, 
      { role: "user", content: message },
      { role: "assistant", content: "I'll help you with that. Here's what I suggest..." }
    ]);
    setMessage("");
  };

  const quickActions = [
    { label: "Generate Component", icon: Code },
    { label: "Create API", icon: Server },
    { label: "Fix Bug", icon: RefreshCw },
    { label: "Add Feature", icon: FileCode },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Build Assistant</h1>
          <p className="text-muted-foreground text-lg">
            Your AI coding companion
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Chat</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      <Code className="h-3 w-3 mr-1" />
                      Web App
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-auto space-y-4 mb-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything about your code..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button onClick={handleSend}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Code className="mr-2 h-4 w-4" />
                  Web App
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Mobile App
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Server className="mr-2 h-4 w-4" />
                  Backend
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast({ title: `${action.label} mode activated` })}
                  >
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="fixes">
                  <TabsList className="w-full">
                    <TabsTrigger value="fixes" className="flex-1">Fixes</TabsTrigger>
                    <TabsTrigger value="refactor" className="flex-1">Refactor</TabsTrigger>
                  </TabsList>
                  <TabsContent value="fixes" className="space-y-2 mt-4">
                    <div className="p-3 border rounded-lg text-sm hover:bg-accent cursor-pointer">
                      Fix TypeScript errors in auth.ts
                    </div>
                    <div className="p-3 border rounded-lg text-sm hover:bg-accent cursor-pointer">
                      Update deprecated API calls
                    </div>
                  </TabsContent>
                  <TabsContent value="refactor" className="space-y-2 mt-4">
                    <div className="p-3 border rounded-lg text-sm hover:bg-accent cursor-pointer">
                      Extract reusable components
                    </div>
                    <div className="p-3 border rounded-lg text-sm hover:bg-accent cursor-pointer">
                      Optimize database queries
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildAssistant;