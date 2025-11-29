import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Send, Sparkles, Github, ZoomIn, ZoomOut } from "lucide-react";

const ProjectView = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! How can I help you organise the project workflow today?",
    },
  ]);
  const [input, setInput] = useState("");
  
  // Draggable state for each card
  const [dragging, setDragging] = useState<string | null>(null);
  const [positions, setPositions] = useState({
    center: { x: 0, y: 0 },
    tech: { x: 950, y: 16 },
    features: { x: 950, y: 450 },
    competitors: { x: 16, y: 16 },
  });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  
  // Line drawing state
  const [drawingLine, setDrawingLine] = useState<{ from: string; x: number; y: number } | null>(null);
  const [lines, setLines] = useState<Array<{ from: string; to: string }>>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
    setMousePos({ x: e.clientX, y: e.clientY });
    
    if (dragging) {
      setPositions((prev) => ({
        ...prev,
        [dragging]: {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        },
      }));
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
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

  const handleCardClick = (e: React.MouseEvent, cardId: string) => {
    // Only handle line drawing on shift+click
    if (!e.shiftKey) return;
    
    e.stopPropagation();
    
    if (!drawingLine) {
      // Start drawing a line
      const rect = e.currentTarget.getBoundingClientRect();
      setDrawingLine({
        from: cardId,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else if (drawingLine.from !== cardId) {
      // Complete the line
      setLines([...lines, { from: drawingLine.from, to: cardId }]);
      setDrawingLine(null);
    }
  };

  const getCardCenter = (cardId: string) => {
    const pos = positions[cardId as keyof typeof positions];
    const cardWidth = cardId === 'center' ? 288 : 256; // w-72 = 288px, w-64 = 256px
    const cardHeight = 200; // approximate
    
    if (cardId === 'center') {
      return {
        x: viewportSize.width / 2 + pos.x,
        y: viewportSize.height / 2 + pos.y,
        width: cardWidth,
        height: cardHeight,
      };
    }
    
    return {
      x: pos.x + cardWidth / 2,
      y: pos.y + cardHeight / 2,
      width: cardWidth,
      height: cardHeight,
    };
  };

  const getEdgePoint = (from: { x: number; y: number; width: number; height: number }, to: { x: number; y: number; width: number; height: number }) => {
    // Calculate angle from 'from' center to 'to' center
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);
    
    // Calculate edge points
    const getPointOnEdge = (center: { x: number; y: number; width: number; height: number }, angle: number) => {
      const w = center.width / 2;
      const h = center.height / 2;
      
      // Determine which edge the line intersects
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      // Check intersection with each edge
      const tanAngle = Math.tan(angle);
      
      if (Math.abs(cos) > Math.abs(sin)) {
        // Intersects left or right edge
        const x = cos > 0 ? w : -w;
        const y = x * tanAngle;
        if (Math.abs(y) <= h) {
          return { x: center.x + x, y: center.y + y };
        }
      }
      
      // Intersects top or bottom edge
      const y = sin > 0 ? h : -h;
      const x = y / tanAngle;
      return { x: center.x + x, y: center.y + y };
    };
    
    return {
      from: getPointOnEdge(from, angle),
      to: getPointOnEdge(to, angle + Math.PI), // opposite direction
    };
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }]);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Main Canvas Area */}
      <div 
        className="flex-1 relative overflow-hidden bg-black"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
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
        {/* Manually Drawn Lines */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-200 origin-center" 
          style={{ 
            zIndex: 5,
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          {/* Render saved lines */}
          {lines.map((line, idx) => {
            const from = getCardCenter(line.from);
            const to = getCardCenter(line.to);
            const edgePoints = getEdgePoint(from, to);
            return (
              <line
                key={idx}
                x1={edgePoints.from.x}
                y1={edgePoints.from.y}
                x2={edgePoints.to.x}
                y2={edgePoints.to.y}
                stroke="white"
                strokeWidth="2"
                strokeDasharray="8,8"
                opacity="0.6"
              />
            );
          })}
          
          {/* Line being drawn */}
          {drawingLine && (
            <line
              x1={drawingLine.x}
              y1={drawingLine.y}
              x2={mousePos.x}
              y2={mousePos.y}
              stroke="white"
              strokeWidth="2"
              strokeDasharray="8,8"
              opacity="0.4"
            />
          )}
        </svg>
        
        {/* Drawing instruction */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 border border-zinc-700 px-4 py-2 rounded-lg">
          <p className="text-sm text-zinc-300">Hold Shift + Click cards to draw lines</p>
        </div>

        <div 
          className="absolute inset-0 p-8 transition-transform duration-200 origin-center"
          style={{ 
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          {/* Central Project Card */}
          <div 
            className="absolute top-1/2 left-1/2 cursor-move"
            style={{ 
              zIndex: dragging === 'center' ? 20 : 10,
              transform: `translate(calc(-50% + ${positions.center.x}px), calc(-50% + ${positions.center.y}px))`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'center')}
            onClick={(e) => handleCardClick(e, 'center')}
          >
            <Card className="w-72 bg-zinc-900/90 backdrop-blur border-zinc-800 shadow-2xl select-none">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Core Idea</Badge>
                  <Github className="h-5 w-5 text-zinc-500" />
                </div>
                <CardTitle className="text-2xl text-zinc-100">Simple Note Taker</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400 mb-4">
                  An innovative project. We are building a simple note taker app
                  with rich text features only a simple UI.
                </p>
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" size="sm" className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Show the CodeString Dashboard
                  </Button>
                </div>
                <Input placeholder="https://github.com/user/repo..." className="mb-2 bg-zinc-800 border-zinc-700 text-zinc-200" />
              </CardContent>
            </Card>
          </div>

          {/* Technology Stack - Top Right */}
          <div 
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'tech' ? 20 : 10,
              left: `${positions.tech.x}px`,
              top: `${positions.tech.y}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'tech')}
            onClick={(e) => handleCardClick(e, 'tech')}
          >
            <Card className="w-64 bg-zinc-900/90 backdrop-blur border-zinc-800 shadow-xl select-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-zinc-100">Technology Stack</CardTitle>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Next.js 14</div>
                  <p className="text-xs text-zinc-500">
                    App Router & Server Actions for streamlined development
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Drizzle ORM</div>
                  <p className="text-xs text-zinc-500">
                    Database management with type-safe queries
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Clerk.dev</div>
                  <p className="text-xs text-zinc-500">
                    User authentication and session management
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">ShadCN UI</div>
                  <p className="text-xs text-zinc-500">
                    UI components for rapid design
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Tailwind CSS</div>
                  <p className="text-xs text-zinc-500">
                    Styling with utility-first CSS for clean design
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  + Add Card
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features - Bottom Right */}
          <div 
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'features' ? 20 : 10,
              left: `${positions.features.x}px`,
              top: `${positions.features.y}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'features')}
            onClick={(e) => handleCardClick(e, 'features')}
          >
            <Card className="w-64 bg-zinc-900/90 backdrop-blur border-zinc-800 shadow-xl select-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-zinc-100">Features</CardTitle>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500">Core features and functionality</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Notes Dashboard</div>
                  <p className="text-xs text-zinc-500">
                    View, search, and manage all your notes in a centralized dashboard
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Note Editor</div>
                  <p className="text-xs text-zinc-500">
                    Create and edit notes with a rich text editor
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Categories & Organisation</div>
                  <p className="text-xs text-zinc-500">
                    Attach notes to categories for better organization
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Database & Storage</div>
                  <p className="text-xs text-zinc-500">
                    Store notes securely using a proper database
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  + Add Card
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Competitors - Top Left */}
          <div 
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'competitors' ? 20 : 10,
              left: `${positions.competitors.x}px`,
              top: `${positions.competitors.y}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'competitors')}
            onClick={(e) => handleCardClick(e, 'competitors')}
          >
            <Card className="w-64 bg-zinc-900/90 backdrop-blur border-zinc-800 shadow-xl select-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-zinc-100">Competitors</CardTitle>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500">Market research and alternatives</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Evernote</div>
                  <p className="text-xs text-zinc-500">
                    A full-featured note-taking app with web clipper, templates, and cloud sync
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Microsoft OneNote</div>
                  <p className="text-xs text-zinc-500">
                    A digital notebook with free editing, drawing, note organization
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Google Keep</div>
                  <p className="text-xs text-zinc-500">
                    Simple note-taking integrated with Google services
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-200">Notion</div>
                  <p className="text-xs text-zinc-500">
                    All-in-one workspace for notes, docs, and collaboration
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  + Add Card
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      <div className="w-96 border-l border-zinc-800 bg-zinc-900 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
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
    </div>
  );
};

export default ProjectView;
