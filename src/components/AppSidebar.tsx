import { Link, useLocation } from "react-router-dom";
import { Shield, Search, AlertTriangle, Bell, FileText, MessageCircle, LogOut, UserCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import AlertsDropdown from "./AlertsDropdown";
import { useEffect } from "react";

const AppSidebar = () => {
  const location = useLocation();
  const { user, userRole, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const { open: isOpen, toggleSidebar, setOpen } = useSidebar();
  const isMobile = useIsMobile();

  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile && isOpen) {
      setOpen(false);
    }
  }, [location.pathname, isMobile, setOpen, isOpen]);

  const navigation = [
    { name: "Home", href: "/", icon: Shield },
    { name: "Link Checker", href: "/link-checker", icon: Search },
    { name: "Report Incident", href: "/report", icon: AlertTriangle },
    { name: "Crime Alerts", href: "/crime-alerts", icon: Bell },
    { name: "Resources", href: "/resources", icon: FileText },
    { name: "Help Chat", href: "/chat", icon: MessageCircle },
    { name: "Dashboard", href: "/dashboard", icon: Shield },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out successfully',
        description: 'You have been logged out of your account.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Sidebar className="border-r" variant={isMobile ? "floating" : "sidebar"}>
      <SidebarHeader className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 min-w-0">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
            {isOpen && (
              <span className="font-bold text-base sm:text-lg text-foreground truncate">
                DigitalSafety Hub
              </span>
            )}
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
            aria-label={isOpen ? "Minimize sidebar" : "Maximize sidebar"}
          >
            {isOpen ? (
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {user ? (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)}>
                          <Link 
                            to={item.href} 
                            className="flex items-center space-x-2 py-2 sm:py-3 min-h-[44px] touch-manipulation"
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            {isOpen && <span className="text-sm sm:text-base truncate">{item.name}</span>}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

          </>
        ) : (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="p-4">
                <Link to="/auth">
                  <Button className="w-full">Sign In</Button>
                </Link>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {user && (
        <SidebarFooter className="p-3 sm:p-4">
          <Separator className="mb-3 sm:mb-4" />
          
          <Link
            to="/profile"
            className={`flex items-center space-x-2 p-2 sm:p-3 rounded-md text-sm transition-colors mb-2 min-h-[44px] touch-manipulation ${
              isActive('/profile')
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <UserCircle className="h-4 w-4 shrink-0" />
            {isOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm truncate">{user.email?.split('@')[0]}</span>
                {userRole && (
                  <span className={`text-xs ${isAdmin ? 'text-primary' : 'text-muted-foreground'} truncate`}>
                    {userRole.toUpperCase()}
                  </span>
                )}
              </div>
            )}
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start min-h-[44px] touch-manipulation"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {isOpen && <span className="ml-2 text-xs sm:text-sm truncate">Sign Out</span>}
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default AppSidebar;