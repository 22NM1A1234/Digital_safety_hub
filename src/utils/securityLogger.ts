// Security event logging utility
import { supabase } from '@/integrations/supabase/client';

export type SecurityEventType = 
  | 'auth_login_success'
  | 'auth_login_failed'
  | 'auth_logout'
  | 'role_change_attempt'
  | 'suspicious_activity'
  | 'data_access'
  | 'admin_action';

interface SecurityEvent {
  event_type: SecurityEventType;
  event_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export const logSecurityEvent = async (event: SecurityEvent) => {
  try {
    // Get client IP and user agent if available
    const userAgent = navigator.userAgent;
    
    await supabase
      .from('security_audit_log')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        event_type: event.event_type,
        event_data: event.event_data,
        user_agent: userAgent,
        ...event
      });
  } catch (error) {
    // Silent logging failure - don't expose errors
  }
};

// Helper functions for common security events
export const logAuthEvent = (type: 'login' | 'logout' | 'failed_login', details?: Record<string, any>) => {
  logSecurityEvent({
    event_type: type === 'login' ? 'auth_login_success' : 
               type === 'logout' ? 'auth_logout' : 'auth_login_failed',
    event_data: details
  });
};

export const logSuspiciousActivity = (activity: string, details?: Record<string, any>) => {
  logSecurityEvent({
    event_type: 'suspicious_activity',
    event_data: { activity, ...details }
  });
};

export const logAdminAction = (action: string, details?: Record<string, any>) => {
  logSecurityEvent({
    event_type: 'admin_action',
    event_data: { action, ...details }
  });
};