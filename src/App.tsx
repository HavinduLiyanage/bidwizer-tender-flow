import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Plans from "./pages/Plans";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MultiStepRegister from "./pages/MultiStepRegister";
import PublisherAuth from "./pages/PublisherAuth";
import PublisherDashboard from "./pages/PublisherDashboard";
import Dashboard from "./pages/Dashboard";  
import TenderDetail from "./pages/TenderDetail";
import AITools from "./pages/AITools";
import Library from "./pages/Library";
import NotFound from "./pages/NotFound";
import BidderDashboard from "./pages/Dashboard";
import TenderStats from "./pages/TenderStats";
import ConfirmEmail from "./pages/ConfirmEmail";
import { useEffect } from "react";
import JoinTeam from "./pages/JoinTeam";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/library" element={<Library />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/multi-step-register" element={<MultiStepRegister />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/publisher-auth" element={<PublisherAuth />} />
          <Route path="/publisher-dashboard" element={<PublisherDashboard />} />
          <Route path="/tender-stats" element={<TenderStats />} />
          <Route path="/dashboard" element={<BidderDashboard />} />
          <Route path="/tender/:id" element={<TenderDetail />} />
          <Route path="/ai-tools/:tenderId" element={<AITools />} />
          <Route path="/join-team" element={<JoinTeam />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
