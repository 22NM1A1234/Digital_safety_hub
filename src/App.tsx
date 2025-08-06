import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlertProvider } from "./contexts/AlertContext";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";
import Home from "./pages/Home";
import LinkChecker from "./pages/LinkChecker";
import ReportIncident from "./pages/ReportIncident";
import CrimeAlerts from "./pages/CrimeAlerts";
import Resources from "./pages/Resources";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
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
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <SidebarInset className="flex-1">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                      <SidebarTrigger className="-ml-1" />
                      <div className="ml-auto flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">
                          DigitalSafety Hub
                        </span>
                      </div>
                    </header>
                    <main className="flex-1 overflow-auto">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/profile" element={<Dashboard />} />
                        <Route path="/link-checker" element={<LinkChecker />} />
                        <Route path="/report" element={<ReportIncident />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/crime-alerts" element={<CrimeAlerts />} />
                        <Route path="/resources" element={<Resources />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </BrowserRouter>
          </AlertProvider>
        </UserProfileProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
