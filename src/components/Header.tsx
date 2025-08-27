import { Shield } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import AlertsDropdown from "./AlertsDropdown";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 h-14 sm:h-16">
      <div className="flex items-center justify-between h-full px-3 sm:px-4 max-w-full">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <SidebarTrigger className="shrink-0" />
          <Link to="/" className="flex items-center space-x-2 min-w-0">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
            <span className="font-bold text-lg sm:text-xl text-foreground hidden sm:block truncate">
              DigitalSafety Hub
            </span>
            <span className="font-bold text-sm text-foreground sm:hidden truncate">
              DS Hub
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          {user && <AlertsDropdown />}
          {!user && (
            <Link to="/auth">
              <Button size="sm" className="text-xs sm:text-sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;