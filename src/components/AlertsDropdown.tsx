import { useState } from 'react';
import { Bell, AlertTriangle, Info, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAlerts } from '@/contexts/AlertContext';

const AlertsDropdown = () => {
  const { alerts, unreadCount, markAsRead, markAllAsRead, deleteAlert } = useAlerts();

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === 'critical' || severity === 'high') {
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
    switch (type) {
      case 'crime':
        return <Shield className="h-4 w-4 text-warning" />;
      case 'safety':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="font-semibold">Alerts</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-auto p-1"
            >
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        {alerts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No alerts</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            {alerts.map((alert) => (
              <DropdownMenuItem
                key={alert.id}
                className={`flex items-start gap-3 p-3 cursor-pointer ${!alert.read ? 'bg-accent/50' : ''}`}
                onClick={() => !alert.read && markAsRead(alert.id)}
              >
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type, alert.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm leading-tight">{alert.title}</p>
                        <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {alert.message}
                      </p>
                      {alert.location && (
                        <p className="text-xs text-muted-foreground mt-1">
                          📍 {alert.location}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(alert.timestamp)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAlert(alert.id);
                      }}
                      className="h-auto p-1 hover:bg-destructive/10"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  {!alert.read && (
                    <div className="w-2 h-2 bg-primary rounded-full absolute left-1 top-1"></div>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AlertsDropdown;