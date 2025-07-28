import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlertProvider } from "./contexts/AlertContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import LinkChecker from "./pages/LinkChecker";
import ReportIncident from "./pages/ReportIncident";
import Cases from "./pages/Cases";
import CrimeAlerts from "./pages/CrimeAlerts";
import AdminDashboard from "./pages/AdminDashboard";
import Resources from "./pages/Resources";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AlertProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/link-checker" element={<LinkChecker />} />
            <Route path="/report" element={<ReportIncident />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/crime-alerts" element={<CrimeAlerts />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
