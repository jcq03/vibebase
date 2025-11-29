import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectView from "./pages/ProjectView";
import Ideas from "./pages/Ideas";
import Features from "./pages/Features";
import Tools from "./pages/Tools";
import BuildPlan from "./pages/BuildPlan";
import BuildAssistant from "./pages/BuildAssistant";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/*" element={
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <header className="h-16 border-b flex items-center px-6 bg-card">
                    <SidebarTrigger />
                  </header>
                  <main className="flex-1">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/projects/:id" element={<ProjectView />} />
                      <Route path="/ideas" element={<Ideas />} />
                      <Route path="/features" element={<Features />} />
                      <Route path="/tools" element={<Tools />} />
                      <Route path="/build-plan" element={<BuildPlan />} />
                      <Route path="/build-assistant" element={<BuildAssistant />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </SidebarProvider>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;