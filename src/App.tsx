import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Plans from "./pages/Plans";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublisherAuth from "./pages/PublisherAuth";
import PublisherDashboard from "./pages/PublisherDashboard";
import Dashboard from "./pages/Dashboard";  
import TenderDetail from "./pages/TenderDetail";
import AITools from "./pages/AITools";
import NotFound from "./pages/NotFound";
import BidderDashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/publisher-auth" element={<PublisherAuth />} />
          <Route path="/publisher-dashboard" element={<PublisherDashboard />} />
          <Route path="/dashboard" element={<BidderDashboard />} />
          <Route path="/tender/:id" element={<TenderDetail />} />
          <Route path="/ai-tools/:tenderId" element={<AITools />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
