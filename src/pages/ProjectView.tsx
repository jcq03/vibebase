import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Send, Sparkles, Github, ZoomIn, ZoomOut, X, PanelRightOpen, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ProjectView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! How can I help you organise the project workflow today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projectName, setProjectName] = useState("Simple Note Taker");
  
  // Draggable state for each card
  const [dragging, setDragging] = useState<string | null>(null);
  const [resizing, setResizing] = useState<string | null>(null);
  const [positions, setPositions] = useState({
    ideaFeatures: { x: 16, y: 100 },
    appType: { x: 300, y: 100 },
    tools: { x: 584, y: 100 },
    phases: { x: 868, y: 100 },
  });
  const [sizes, setSizes] = useState({
    ideaFeatures: { width: 256, height: 400 },
    appType: { width: 256, height: 400 },
    tools: { width: 256, height: 400 },
    phases: { width: 256, height: 400 },
  });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Load project data from localStorage or database
  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      
      // Try to load from localStorage first
      const savedPositions = localStorage.getItem(`project-${id}-positions`);
      const savedSizes = localStorage.getItem(`project-${id}-sizes`);
      if (savedPositions) {
        try {
          setPositions(JSON.parse(savedPositions));
        } catch (e) {
          console.error('Error parsing saved positions:', e);
        }
      }
      if (savedSizes) {
        try {
          setSizes(JSON.parse(savedSizes));
        } catch (e) {
          console.error('Error parsing saved sizes:', e);
        }
      }

      // Check if ID is a valid UUID (36 characters with dashes)
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (!isValidUuid) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error loading project:', error);
        return;
      }

      if (project) {
        setProjectName(project.name);
        const cardData = project.card_positions as any;
        if (cardData.positions) {
          setPositions(cardData.positions);
        } else {
          setPositions(cardData as typeof positions);
        }
        if (cardData.sizes) {
          setSizes(cardData.sizes);
        }
      }
    };

    loadProject();
  }, [id]);

  // Save positions and sizes to localStorage and database with debouncing
  useEffect(() => {
    if (!id) return;

    const saveData = async () => {
      // Always save to localStorage
      localStorage.setItem(`project-${id}-positions`, JSON.stringify(positions));
      localStorage.setItem(`project-${id}-sizes`, JSON.stringify(sizes));

      // Check if ID is a valid UUID before trying to save to database
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (!isValidUuid) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('projects')
        .update({ card_positions: { positions, sizes } })
        .eq('id', id);

      if (error) {
        console.error('Error saving data:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [positions, sizes, id]);

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

  const handleResizeMouseDown = (e: React.MouseEvent, card: string) => {
    e.stopPropagation();
    setResizing(card);
    setDragStart({ x: e.clientX, y: e.clientY });
    setResizeStart({
      width: sizes[card as keyof typeof sizes].width,
      height: sizes[card as keyof typeof sizes].height,
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
    } else if (resizing) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setSizes((prev) => ({
        ...prev,
        [resizing]: {
          width: Math.max(200, resizeStart.width + deltaX),
          height: Math.max(200, resizeStart.height + deltaY),
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
    setResizing(null);
    setIsPanning(false);
    // Ensure the latest position and size are saved immediately
    const savedId = id;
    if (savedId) {
      localStorage.setItem(`project-${savedId}-positions`, JSON.stringify(positions));
      localStorage.setItem(`project-${savedId}-sizes`, JSON.stringify(sizes));
    }
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
        style={{ 
          cursor: isPanning ? 'grabbing' : 'grab',
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
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
              zIndex: dragging === 'ideaFeatures' || resizing === 'ideaFeatures' ? 20 : 10,
              left: `${positions.ideaFeatures.x}px`,
              top: `${positions.ideaFeatures.y}px`,
              width: `${sizes.ideaFeatures.width}px`,
              height: `${sizes.ideaFeatures.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'ideaFeatures')}
          >
            <Card className="w-full h-full bg-zinc-900/90 backdrop-blur border-zinc-800 shadow-xl select-none relative flex flex-col" style={{ fontSize: `${Math.max(0.6, sizes.ideaFeatures.width / 256)}rem` }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-cyan-400" style={{ textShadow: '0 0 8px rgba(34, 211, 238, 0.8), 0 0 16px rgba(34, 211, 238, 0.6), 0 0 24px rgba(34, 211, 238, 0.4)', fontSize: '1.125em' }}>Idea & Features</CardTitle>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800" style={{ padding: '0.25em' }}>
                    <Plus style={{ width: '1em', height: '1em' }} />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>Core concept and functionality</p>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 overflow-auto">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200" style={{ fontSize: '0.875em' }}>Note Creation</div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>
                    Quick and easy note creation with rich text support
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200" style={{ fontSize: '0.875em' }}>Organization</div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>
                    Category-based organization for better management
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200" style={{ fontSize: '0.875em' }}>Search & Filter</div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>
                    Find notes quickly with search and filtering options
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800" style={{ fontSize: '0.875em' }}>
                  + Add Feature
                </Button>
              </CardContent>
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-zinc-700 hover:bg-zinc-600 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'ideaFeatures')}
                style={{ borderRadius: '0 0 8px 0' }}
              />
            </Card>
          </div>

          {/* Type of Application - Top Right */}
          <div 
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'appType' || resizing === 'appType' ? 20 : 10,
              left: `${positions.appType.x}px`,
              top: `${positions.appType.y}px`,
              width: `${sizes.appType.width}px`,
              height: `${sizes.appType.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'appType')}
          >
            <Card className="w-full h-full bg-zinc-900/90 backdrop-blur border-zinc-800 shadow-xl select-none relative flex flex-col" style={{ fontSize: `${Math.max(0.6, sizes.appType.width / 256)}rem` }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-purple-400" style={{ textShadow: '0 0 8px rgba(192, 132, 252, 0.8), 0 0 16px rgba(192, 132, 252, 0.6), 0 0 24px rgba(192, 132, 252, 0.4)', fontSize: '1.125em' }}>Type of Application</CardTitle>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800" style={{ padding: '0.25em' }}>
                    <Plus style={{ width: '1em', height: '1em' }} />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>Application category and scope</p>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 overflow-auto">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200" style={{ fontSize: '0.875em' }}>Web Application</div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>
                    Browser-based app accessible on any device
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200" style={{ fontSize: '0.875em' }}>Productivity Tool</div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>
                    Designed to help users organize and manage information
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200" style={{ fontSize: '0.875em' }}>Single User</div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>
                    Personal note-taking without collaboration features
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800" style={{ fontSize: '0.875em' }}>
                  + Add Detail
                </Button>
              </CardContent>
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-zinc-700 hover:bg-zinc-600 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'appType')}
                style={{ borderRadius: '0 0 8px 0' }}
              />
            </Card>
          </div>

          {/* Tools to Use to Build - Bottom Right */}
          <div 
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'tools' || resizing === 'tools' ? 20 : 10,
              left: `${positions.tools.x}px`,
              top: `${positions.tools.y}px`,
              width: `${sizes.tools.width}px`,
              height: `${sizes.tools.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'tools')}
          >
            <Card className="w-full h-full bg-zinc-900/90 backdrop-blur border-zinc-800 shadow-xl select-none relative flex flex-col" style={{ fontSize: `${Math.max(0.6, sizes.tools.width / 256)}rem` }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-emerald-400" style={{ textShadow: '0 0 8px rgba(52, 211, 153, 0.8), 0 0 16px rgba(52, 211, 153, 0.6), 0 0 24px rgba(52, 211, 153, 0.4)', fontSize: '1.125em' }}>Tools to Use to Build</CardTitle>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800" style={{ padding: '0.25em' }}>
                    <Plus style={{ width: '1em', height: '1em' }} />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>Development stack and tools</p>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 overflow-auto">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200" style={{ fontSize: '0.875em' }}>React + TypeScript</div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>
                    Modern frontend framework with type safety
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200" style={{ fontSize: '0.875em' }}>Supabase</div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>
                    Database and authentication backend
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200" style={{ fontSize: '0.875em' }}>Tailwind CSS</div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>
                    Utility-first styling framework
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200" style={{ fontSize: '0.875em' }}>Vite</div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>
                    Fast build tool and development server
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800" style={{ fontSize: '0.875em' }}>
                  + Add Tool
                </Button>
              </CardContent>
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-zinc-700 hover:bg-zinc-600 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'tools')}
                style={{ borderRadius: '0 0 8px 0' }}
              />
            </Card>
          </div>

          {/* Phase Building - Bottom Left */}
          <div 
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'phases' || resizing === 'phases' ? 20 : 10,
              left: `${positions.phases.x}px`,
              top: `${positions.phases.y}px`,
              width: `${sizes.phases.width}px`,
              height: `${sizes.phases.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'phases')}
          >
            <Card className="w-full h-full bg-zinc-900/90 backdrop-blur border-zinc-800 shadow-xl select-none relative flex flex-col" style={{ fontSize: `${Math.max(0.6, sizes.phases.width / 256)}rem` }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-amber-400" style={{ textShadow: '0 0 8px rgba(251, 191, 36, 0.8), 0 0 16px rgba(251, 191, 36, 0.6), 0 0 24px rgba(251, 191, 36, 0.4)', fontSize: '1.125em' }}>Phase Building</CardTitle>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800" style={{ padding: '0.25em' }}>
                    <Plus style={{ width: '1em', height: '1em' }} />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>Development roadmap and milestones</p>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 overflow-auto">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200" style={{ fontSize: '0.875em' }}>Phase 1: Setup</div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>
                    Initialize project, set up database and authentication
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200" style={{ fontSize: '0.875em' }}>Phase 2: Core Features</div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>
                    Build note creation, editing, and basic organization
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200" style={{ fontSize: '0.875em' }}>Phase 3: Polish</div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>
                    Add search, filters, and improve user experience
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200" style={{ fontSize: '0.875em' }}>Phase 4: Launch</div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: '0.75em' }}>
                    Testing, bug fixes, and deployment to production
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800" style={{ fontSize: '0.875em' }}>
                  + Add Phase
                </Button>
              </CardContent>
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-zinc-700 hover:bg-zinc-600 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'phases')}
                style={{ borderRadius: '0 0 8px 0' }}
              />
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
              <h3 className="text-sm font-medium text-zinc-400">{projectName}</h3>
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
