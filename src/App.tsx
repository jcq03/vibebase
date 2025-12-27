import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Waitlist from "./pages/Waitlist";
import Auth from "./pages/Auth";
import SignUp from "./pages/SignUp";
import Welcome from "./pages/Welcome";
import Paywall from "./pages/Paywall";
import PaymentSuccess from "./pages/PaymentSuccess";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectView from "./pages/ProjectView";
import Ideas from "./pages/Ideas";
import Features from "./pages/Features";
import Tools from "./pages/Tools";
import BuildPlan from "./pages/BuildPlan";
import BuildAssistant from "./pages/BuildAssistant";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import LiveCalls from "./pages/LiveCalls";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/paywall" element={<Paywall />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/projects/:id" element={
            <ProtectedRoute>
              <ProjectView />
            </ProtectedRoute>
          } />
          <Route path="/*" element={
            <ProtectedRoute>
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
                        <Route path="/ideas" element={<Ideas />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/tools" element={<Tools />} />
                        <Route path="/build-plan" element={<BuildPlan />} />
                        <Route path="/build-assistant" element={<BuildAssistant />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/live-calls" element={<LiveCalls />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;