import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Send, Sparkles, Github, ZoomIn, ZoomOut, X, PanelRightOpen, ArrowLeft } from "lucide-react";

const ProjectView = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! How can I help you organise the project workflow today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Draggable state for each card
  const [dragging, setDragging] = useState<string | null>(null);
  const [positions, setPositions] = useState({
    ideaFeatures: { x: 16, y: 100 },
    appType: { x: 300, y: 100 },
    tools: { x: 584, y: 100 },
    phases: { x: 868, y: 100 },
  });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Track viewport size
  useEffect(() => {
    const updateSize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent, card: string) => {
    setDragging(card);
    setDragStart({
      x: e.clientX - positions[card as keyof typeof positions].x,
      y: e.clientY - positions[card as keyof typeof positions].y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setPositions((prev) => ({
        ...prev,
        [dragging]: {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        },
      }));
    } else if (isPanning) {
      setPanOffset({
        x: panStart.x + (e.clientX - dragStart.x) / zoom,
        y: panStart.y + (e.clientY - dragStart.y) / zoom,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setIsPanning(false);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsPanning(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setPanStart(panOffset);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(Math.max(0.3, zoom + delta), 2);
    setZoom(newZoom);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.3));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }]);
      setInput("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex overflow-hidden">
      {/* Back Button */}
      <Button
        size="icon"
        variant="outline"
        className="fixed top-4 left-4 z-50 bg-zinc-900/90 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        onClick={() => navigate('/projects')}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      {/* Main Canvas Area */}
      <div 
        className="flex-1 relative overflow-hidden bg-black"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onMouseDown={handleCanvasMouseDown}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
          <Button
            size="icon"
            variant="outline"
            className="bg-zinc-900/90 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="bg-zinc-900/90 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-zinc-900/90 border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs"
            onClick={handleResetZoom}
          >
            {Math.round(zoom * 100)}%
          </Button>
        </div>
        <div 
          className="absolute inset-0 p-8 transition-transform duration-200 origin-center"
          style={{ 
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          {/* Idea & Features - Top Left */}
          <div 
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'ideaFeatures' ? 20 : 10,
              left: `${positions.ideaFeatures.x}px`,
              top: `${positions.ideaFeatures.y}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'ideaFeatures')}
          >
            <Card className="w-64 bg-zinc-900/90 backdrop-blur border-zinc-800 shadow-xl select-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-cyan-400" style={{ textShadow: '0 2px 4px rgba(34, 211, 238, 0.3)' }}>Idea & Features</CardTitle>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500">Core concept and functionality</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Note Creation</div>
                  <p className="text-xs text-zinc-500">
                    Quick and easy note creation with rich text support
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Organization</div>
                  <p className="text-xs text-zinc-500">
                    Category-based organization for better management
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Search & Filter</div>
                  <p className="text-xs text-zinc-500">
                    Find notes quickly with search and filtering options
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  + Add Feature
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Type of Application - Top Right */}
          <div 
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'appType' ? 20 : 10,
              left: `${positions.appType.x}px`,
              top: `${positions.appType.y}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'appType')}
          >
            <Card className="w-64 bg-zinc-900/90 backdrop-blur border-zinc-800 shadow-xl select-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-purple-400" style={{ textShadow: '0 2px 4px rgba(192, 132, 252, 0.3)' }}>Type of Application</CardTitle>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500">Application category and scope</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Web Application</div>
                  <p className="text-xs text-zinc-500">
                    Browser-based app accessible on any device
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Productivity Tool</div>
                  <p className="text-xs text-zinc-500">
                    Designed to help users organize and manage information
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Single User</div>
                  <p className="text-xs text-zinc-500">
                    Personal note-taking without collaboration features
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  + Add Detail
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tools to Use to Build - Bottom Right */}
          <div 
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'tools' ? 20 : 10,
              left: `${positions.tools.x}px`,
              top: `${positions.tools.y}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'tools')}
          >
            <Card className="w-64 bg-zinc-900/90 backdrop-blur border-zinc-800 shadow-xl select-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-emerald-400" style={{ textShadow: '0 2px 4px rgba(52, 211, 153, 0.3)' }}>Tools to Use to Build</CardTitle>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500">Development stack and tools</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">React + TypeScript</div>
                  <p className="text-xs text-zinc-500">
                    Modern frontend framework with type safety
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Supabase</div>
                  <p className="text-xs text-zinc-500">
                    Database and authentication backend
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Tailwind CSS</div>
                  <p className="text-xs text-zinc-500">
                    Utility-first styling framework
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Vite</div>
                  <p className="text-xs text-zinc-500">
                    Fast build tool and development server
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  + Add Tool
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Phase Building - Bottom Left */}
          <div 
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'phases' ? 20 : 10,
              left: `${positions.phases.x}px`,
              top: `${positions.phases.y}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'phases')}
          >
            <Card className="w-64 bg-zinc-900/90 backdrop-blur border-zinc-800 shadow-xl select-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-amber-400" style={{ textShadow: '0 2px 4px rgba(251, 191, 36, 0.3)' }}>Phase Building</CardTitle>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500">Development roadmap and milestones</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Phase 1: Setup</div>
                  <p className="text-xs text-zinc-500">
                    Initialize project, set up database and authentication
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Phase 2: Core Features</div>
                  <p className="text-xs text-zinc-500">
                    Build note creation, editing, and basic organization
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Phase 3: Polish</div>
                  <p className="text-xs text-zinc-500">
                    Add search, filters, and improve user experience
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Phase 4: Launch</div>
                  <p className="text-xs text-zinc-500">
                    Testing, bug fixes, and deployment to production
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  + Add Phase
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reopen Sidebar Button */}
      {!sidebarOpen && (
        <Button
          size="icon"
          variant="outline"
          className="fixed top-4 right-4 z-50 bg-zinc-900/90 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          onClick={() => setSidebarOpen(true)}
        >
          <PanelRightOpen className="h-4 w-4" />
        </Button>
      )}

      {/* AI Assistant Sidebar */}
      {sidebarOpen && (
        <div className="w-80 border-l border-zinc-800 bg-zinc-900 flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-zinc-400">Simple Note Taker</h3>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-zinc-100">AI Assistant</h2>
            </div>
            <p className="text-xs text-zinc-500">
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
                      : "bg-zinc-800 text-zinc-200"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-zinc-800">
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
              className="resize-none bg-zinc-800 border-zinc-700 text-zinc-200"
            />
            <Button onClick={handleSend} size="icon" className="shrink-0 h-auto">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default ProjectView;
