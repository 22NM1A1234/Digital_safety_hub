import { Shield } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import AlertsDropdown from "./AlertsDropdown";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 h-16">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl text-foreground hidden sm:block">
              DigitalSafety Hub
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user && <AlertsDropdown />}
          {!user && (
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;