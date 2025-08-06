import { Link, useLocation } from "react-router-dom";
import { Shield, Search, AlertTriangle, Bell, FileText, MessageCircle, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
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

const AppSidebar = () => {
  const location = useLocation();
  const { user, userRole, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const { open: isOpen } = useSidebar();

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
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          {isOpen && (
            <span className="font-bold text-lg text-foreground">
              DigitalSafety Hub
            </span>
          )}
        </Link>
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
                          <Link to={item.href} className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            {isOpen && <span>{item.name}</span>}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {isOpen && (
              <SidebarGroup>
                <SidebarGroupLabel>Alerts</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-2">
                    <AlertsDropdown />
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
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
        <SidebarFooter className="p-4">
          <Separator className="mb-4" />
          
          <Link
            to="/profile"
            className={`flex items-center space-x-2 p-2 rounded-md text-sm transition-colors mb-2 ${
              isActive('/profile')
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <UserCircle className="h-4 w-4" />
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-sm">{user.email?.split('@')[0]}</span>
                {userRole && (
                  <span className={`text-xs ${isAdmin ? 'text-primary' : 'text-muted-foreground'}`}>
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
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4" />
            {isOpen && <span className="ml-2">Sign Out</span>}
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default AppSidebar;