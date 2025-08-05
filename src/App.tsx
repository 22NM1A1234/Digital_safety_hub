import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlertProvider } from "./contexts/AlertContext";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import LinkChecker from "./pages/LinkChecker";
import ReportIncident from "./pages/ReportIncident";

import CrimeAlerts from "./pages/CrimeAlerts";
import AdminDashboard from "./pages/AdminDashboard";
import Resources from "./pages/Resources";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <UserProfileProvider>
          <AlertProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Navigation />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/link-checker" element={<LinkChecker />} />
                <Route path="/report" element={<ReportIncident />} />
                
                <Route path="/crime-alerts" element={<CrimeAlerts />} />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/resources" element={<Resources />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AlertProvider>
        </UserProfileProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
