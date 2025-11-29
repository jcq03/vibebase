import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Send, Sparkles, Github } from "lucide-react";

const ProjectView = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! How can I help you organise the project workflow today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }]);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 p-8">
          {/* Central Project Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Card className="w-96 bg-card/95 backdrop-blur border-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Core Idea</Badge>
                  <Github className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl">Simple Note Taker</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  An innovative project. We are building a simple note taker app
                  with rich text features only a simple UI.
                </p>
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Show the CodeString Dashboard
                  </Button>
                </div>
                <Input placeholder="https://github.com/user/repo..." className="mb-2" />
              </CardContent>
            </Card>
          </div>

          {/* Technology Stack - Top Right */}
          <div className="absolute top-8 right-8 w-80">
            <Card className="bg-card/95 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Technology Stack</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Next.js 14</div>
                  <p className="text-xs text-muted-foreground">
                    App Router & Server Actions for streamlined development
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Drizzle ORM</div>
                  <p className="text-xs text-muted-foreground">
                    Database management with type-safe queries
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Clerk.dev</div>
                  <p className="text-xs text-muted-foreground">
                    User authentication and session management
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">ShadCN UI</div>
                  <p className="text-xs text-muted-foreground">
                    UI components for rapid design
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Tailwind CSS</div>
                  <p className="text-xs text-muted-foreground">
                    Styling with utility-first CSS for clean design
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  + Add Card
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features - Right Side */}
          <div className="absolute bottom-8 right-8 w-80">
            <Card className="bg-card/95 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Features</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Core features and functionality</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Notes Dashboard</div>
                  <p className="text-xs text-muted-foreground">
                    View, search, and manage all your notes in a centralized dashboard
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Note Editor</div>
                  <p className="text-xs text-muted-foreground">
                    Create and edit notes with a rich text editor
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Categories & Organisation</div>
                  <p className="text-xs text-muted-foreground">
                    Attach notes to categories for better organization
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Database & Storage</div>
                  <p className="text-xs text-muted-foreground">
                    Store notes securely using a proper database
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  + Add Card
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Competitors - Left Side */}
          <div className="absolute top-8 left-8 w-80">
            <Card className="bg-card/95 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Competitors</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Market research and alternatives</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Evernote</div>
                  <p className="text-xs text-muted-foreground">
                    A full-featured note-taking app with web clipper, templates, and cloud sync
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Microsoft OneNote</div>
                  <p className="text-xs text-muted-foreground">
                    A digital notebook with free editing, drawing, note organization
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Google Keep</div>
                  <p className="text-xs text-muted-foreground">
                    Simple note-taking integrated with Google services
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Notion</div>
                  <p className="text-xs text-muted-foreground">
                    All-in-one workspace for notes, docs, and collaboration
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  + Add Card
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Connecting Lines SVG Overlay */}
          <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* Lines connecting cards to center */}
            <path
              d="M 50% 50% Q 75% 25%, 85% 15%"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
            <path
              d="M 50% 50% Q 75% 75%, 85% 85%"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
            <path
              d="M 50% 50% Q 25% 25%, 15% 15%"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
          </svg>
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      <div className="w-96 border-l bg-card flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">AI Assistant</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Get help organizing your project
          </p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[85%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={2}
              className="resize-none"
            />
            <Button onClick={handleSend} size="icon" className="shrink-0 h-auto">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
