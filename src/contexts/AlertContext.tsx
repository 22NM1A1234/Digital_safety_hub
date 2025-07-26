import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  type: 'crime' | 'safety' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  location?: string;
  timestamp: string;
  read: boolean;
}

interface AlertContextType {
  alerts: Alert[];
  unreadCount: number;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteAlert: (id: string) => void;
  clearAll: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { toast } = useToast();

  // Mock alerts for demonstration
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'crime',
        severity: 'high',
        title: 'Cyber Fraud Alert',
        message: 'Multiple phishing attempts detected in your area',
        location: 'Downtown Area',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        type: 'safety',
        severity: 'medium',
        title: 'Safety Reminder',
        message: 'Update your passwords regularly for better security',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false
      }
    ];
    setAlerts(mockAlerts);
  }, []);

  const unreadCount = alerts.filter(alert => !alert.read).length;

  const addAlert = (alertData: Omit<Alert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setAlerts(prev => [newAlert, ...prev]);

    // Show toast notification for high severity alerts
    if (alertData.severity === 'high' || alertData.severity === 'critical') {
      toast({
        title: alertData.title,
        description: alertData.message,
        variant: alertData.severity === 'critical' ? 'destructive' : 'default',
      });
    }
  };

  const markAsRead = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  const markAllAsRead = () => {
    setAlerts(prev => 
      prev.map(alert => ({ ...alert, read: true }))
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAll = () => {
    setAlerts([]);
  };

  const value: AlertContextType = {
    alerts,
    unreadCount,
    addAlert,
    markAsRead,
    markAllAsRead,
    deleteAlert,
    clearAll
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};