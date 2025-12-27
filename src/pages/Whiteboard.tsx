import { useState, useEffect } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, ArrowLeft, Plus } from "lucide-react";

const Whiteboard = () => {
  const navigate = useNavigate();

  const [dragging, setDragging] = useState<string | null>(null);
  const [resizing, setResizing] = useState<string | null>(null);
  const [positions, setPositions] = useState({
    ideaFeatures: { x: 80, y: 140 },
    phases: { x: 380, y: 140 },
    appType: { x: 680, y: 140 },
    tools: { x: 980, y: 140 },
  });
  const [sizes, setSizes] = useState({
    ideaFeatures: { width: 260, height: 420 },
    phases: { width: 260, height: 420 },
    appType: { width: 260, height: 420 },
    tools: { width: 260, height: 420 },
  });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(0.9);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Load and persist layout locally
  useEffect(() => {
    const savedPositions = localStorage.getItem("whiteboard-positions");
    const savedSizes = localStorage.getItem("whiteboard-sizes");
    const savedZoom = localStorage.getItem("whiteboard-zoom");
    const savedPan = localStorage.getItem("whiteboard-pan");

    if (savedPositions) {
      try {
        setPositions(JSON.parse(savedPositions));
      } catch {
        // ignore parse errors and keep defaults
      }
    }
    if (savedSizes) {
      try {
        setSizes(JSON.parse(savedSizes));
      } catch {
        // ignore parse errors
      }
    }
    if (savedZoom) {
      const value = Number(savedZoom);
      if (!Number.isNaN(value)) setZoom(value);
    }
    if (savedPan) {
      try {
        setPanOffset(JSON.parse(savedPan));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("whiteboard-positions", JSON.stringify(positions));
    localStorage.setItem("whiteboard-sizes", JSON.stringify(sizes));
    localStorage.setItem("whiteboard-zoom", String(zoom));
    localStorage.setItem("whiteboard-pan", JSON.stringify(panOffset));
  }, [positions, sizes, zoom, panOffset]);

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
          width: Math.max(220, resizeStart.width + deltaX),
          height: Math.max(260, resizeStart.height + deltaY),
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
    const newZoom = Math.min(Math.max(0.4, zoom + delta), 2.2);
    setZoom(newZoom);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2.2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.4));
  };

  const handleResetZoom = () => {
    setZoom(0.9);
    setPanOffset({ x: 0, y: 0 });
  };

  const zoomLabel = `${Math.round(zoom * 100)}%`;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black via-zinc-950 to-black flex overflow-hidden">
      {/* Back Button */}
      <Button
        size="icon"
        variant="outline"
        className="fixed top-4 left-4 z-50 bg-zinc-900/90 border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-full shadow-md"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      {/* Main Canvas Area */}
      <div
        className="flex-1 relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onMouseDown={handleCanvasMouseDown}
        style={{
          cursor: isPanning ? "grabbing" : "grab",
          backgroundImage:
            "radial-gradient(circle, rgba(255, 255, 255, 0.18) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
          <Button
            size="icon"
            variant="outline"
            className="bg-zinc-900/90 border-zinc-700 text-zinc-50/90 hover:bg-zinc-800 rounded-full shadow-md"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="bg-zinc-900/90 border-zinc-700 text-zinc-50/90 hover:bg-zinc-800 rounded-full shadow-md"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-zinc-900/90 border-zinc-700 text-zinc-200 hover:bg-zinc-800 text-[10px] tracking-wide rounded-full px-3"
            onClick={handleResetZoom}
          >
            {zoomLabel}
          </Button>
        </div>

        {/* Cards Layer */}
        <div
          className="absolute inset-0 p-16 transition-transform duration-200 origin-center"
          style={{
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          {/* Idea & Features */}
          <div
            className="absolute cursor-move"
            style={{
              zIndex: dragging === "ideaFeatures" || resizing === "ideaFeatures" ? 20 : 10,
              left: `${positions.ideaFeatures.x}px`,
              top: `${positions.ideaFeatures.y}px`,
              width: `${sizes.ideaFeatures.width}px`,
              height: `${sizes.ideaFeatures.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, "ideaFeatures")}
          >
            <Card
              className="w-full h-full bg-zinc-950/90 backdrop-blur-xl border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.35)] select-none relative flex flex-col"
              style={{
                fontSize: `${Math.max(0.6, sizes.ideaFeatures.width / 256)}rem`,
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle
                    className="text-lg text-cyan-300"
                    style={{
                      textShadow:
                        "0 0 8px rgba(34, 211, 238, 0.8), 0 0 18px rgba(34, 211, 238, 0.6)",
                      fontSize: "1.1em",
                    }}
                  >
                    Idea & Features
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900/70 rounded-full"
                    style={{ padding: "0.25em" }}
                  >
                    <Plus style={{ width: "1em", height: "1em" }} />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                  Core concept and functionality
                </p>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 overflow-auto pr-1">
                <div className="space-y-1.5">
                  <div
                    className="text-sm font-medium text-zinc-100"
                    style={{ fontSize: "0.875em" }}
                  >
                    Note Creation
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                    Quick and easy note creation with rich text support
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div
                    className="text-sm font-medium text-zinc-100"
                    style={{ fontSize: "0.875em" }}
                  >
                    Organization
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                    Category-based organization for better management
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div
                    className="text-sm font-medium text-zinc-100"
                    style={{ fontSize: "0.875em" }}
                  >
                    Search & Filter
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                    Find notes quickly with search and filtering options
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 border-zinc-800/80 text-zinc-100 hover:bg-zinc-900"
                  style={{ fontSize: "0.82em" }}
                >
                  + Add Feature
                </Button>
              </CardContent>
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-cyan-500/80 hover:bg-cyan-400 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, "ideaFeatures")}
                style={{ borderRadius: "0 0 10px 0" }}
              />
            </Card>
          </div>

          {/* Phase Building */}
          <div
            className="absolute cursor-move"
            style={{
              zIndex: dragging === "phases" || resizing === "phases" ? 20 : 10,
              left: `${positions.phases.x}px`,
              top: `${positions.phases.y}px`,
              width: `${sizes.phases.width}px`,
              height: `${sizes.phases.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, "phases")}
          >
            <Card
              className="w-full h-full bg-zinc-950/90 backdrop-blur-xl border-amber-400/40 shadow-[0_0_40px_rgba(251,191,36,0.35)] select-none relative flex flex-col"
              style={{
                fontSize: `${Math.max(0.6, sizes.phases.width / 256)}rem`,
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle
                    className="text-lg text-amber-300"
                    style={{
                      textShadow:
                        "0 0 8px rgba(251, 191, 36, 0.8), 0 0 18px rgba(251, 191, 36, 0.6)",
                      fontSize: "1.1em",
                    }}
                  >
                    Phase Building
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900/70 rounded-full"
                    style={{ padding: "0.25em" }}
                  >
                    <Plus style={{ width: "1em", height: "1em" }} />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                  Development roadmap and milestones
                </p>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 overflow-auto pr-1">
                <div className="space-y-1.5">
                  <div
                    className="text-sm font-medium text-zinc-100"
                    style={{ fontSize: "0.875em" }}
                  >
                    Phase 1: Setup
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                    Initialize project, set up database and authentication
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div
                    className="text-sm font-medium text-zinc-100"
                    style={{ fontSize: "0.875em" }}
                  >
                    Phase 2: Core Features
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                    Build note creation, editing, and basic organization
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div
                    className="text-sm font-medium text-zinc-100"
                    style={{ fontSize: "0.875em" }}
                  >
                    Phase 3: Polish
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                    Add search, filters, and improve user experience
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div
                    className="text-sm font-medium text-zinc-100"
                    style={{ fontSize: "0.875em" }}
                  >
                    Phase 4: Launch
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                    Testing, bug fixes, and deployment to production
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 border-zinc-800/80 text-zinc-100 hover:bg-zinc-900"
                  style={{ fontSize: "0.82em" }}
                >
                  + Add Phase
                </Button>
              </CardContent>
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-amber-400/80 hover:bg-amber-300 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, "phases")}
                style={{ borderRadius: "0 0 10px 0" }}
              />
            </Card>
          </div>

          {/* Type of Application */}
          <div
            className="absolute cursor-move"
            style={{
              zIndex: dragging === "appType" || resizing === "appType" ? 20 : 10,
              left: `${positions.appType.x}px`,
              top: `${positions.appType.y}px`,
              width: `${sizes.appType.width}px`,
              height: `${sizes.appType.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, "appType")}
          >
            <Card
              className="w-full h-full bg-zinc-950/90 backdrop-blur-xl border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.35)] select-none relative flex flex-col"
              style={{
                fontSize: `${Math.max(0.6, sizes.appType.width / 256)}rem`,
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle
                    className="text-lg text-purple-300"
                    style={{
                      textShadow:
                        "0 0 8px rgba(192, 132, 252, 0.8), 0 0 18px rgba(192, 132, 252, 0.6)",
                      fontSize: "1.1em",
                    }}
                  >
                    Type of Application
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900/70 rounded-full"
                    style={{ padding: "0.25em" }}
                  >
                    <Plus style={{ width: "1em", height: "1em" }} />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                  Application category and scope
                </p>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 overflow-auto pr-1">
                <div className="space-y-1.5">
                  <div
                    className="text-sm font-medium text-zinc-100"
                    style={{ fontSize: "0.875em" }}
                  >
                    Web Application
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                    Browser-based app accessible on any device
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div
                    className="text-sm font-medium text-zinc-100"
                    style={{ fontSize: "0.875em" }}
                  >
                    Productivity Tool
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                    Designed to help users organize and manage information
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div
                    className="text-sm font-medium text-zinc-100"
                    style={{ fontSize: "0.875em" }}
                  >
                    Single User
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                    Personal note-taking without collaboration features
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 border-zinc-800/80 text-zinc-100 hover:bg-zinc-900"
                  style={{ fontSize: "0.82em" }}
                >
                  + Add Detail
                </Button>
              </CardContent>
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-purple-500/80 hover:bg-purple-400 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, "appType")}
                style={{ borderRadius: "0 0 10px 0" }}
              />
            </Card>
          </div>

          {/* Tools to Use to Build */}
          <div
            className="absolute cursor-move"
            style={{
              zIndex: dragging === "tools" || resizing === "tools" ? 20 : 10,
              left: `${positions.tools.x}px`,
              top: `${positions.tools.y}px`,
              width: `${sizes.tools.width}px`,
              height: `${sizes.tools.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, "tools")}
          >
            <Card
              className="w-full h-full bg-zinc-950/90 backdrop-blur-xl border-emerald-400/40 shadow-[0_0_40px_rgba(16,185,129,0.35)] select-none relative flex flex-col"
              style={{
                fontSize: `${Math.max(0.6, sizes.tools.width / 256)}rem`,
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle
                    className="text-lg text-emerald-300"
                    style={{
                      textShadow:
                        "0 0 8px rgba(52, 211, 153, 0.8), 0 0 18px rgba(52, 211, 153, 0.6)",
                      fontSize: "1.1em",
                    }}
                  >
                    Tools to Use to Build
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900/70 rounded-full"
                    style={{ padding: "0.25em" }}
                  >
                    <Plus style={{ width: "1em", height: "1em" }} />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                  Development stack and tools
                </p>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 overflow-auto pr-1">
                <div className="space-y-1.5">
                  <div
                    className="text-sm font-medium text-zinc-100"
                    style={{ fontSize: "0.875em" }}
                  >
                    React + TypeScript
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                    Modern frontend framework with type safety
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div
                    className="text-sm font-medium text-zinc-100"
                    style={{ fontSize: "0.875em" }}
                  >
                    Supabase
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                    Database and authentication backend
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div
                    className="text-sm font-medium text-zinc-100"
                    style={{ fontSize: "0.875em" }}
                  >
                    Tailwind CSS
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                    Utility-first styling framework
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div
                    className="text-sm font-medium text-zinc-100"
                    style={{ fontSize: "0.875em" }}
                  >
                    Vite
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontSize: "0.75em" }}>
                    Fast build tool and development server
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 border-zinc-800/80 text-zinc-100 hover:bg-zinc-900"
                  style={{ fontSize: "0.82em" }}
                >
                  + Add Tool
                </Button>
              </CardContent>
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-emerald-400/80 hover:bg-emerald-300 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, "tools")}
                style={{ borderRadius: "0 0 10px 0" }}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;



