-- Critical Security Fixes for Anonymous Access and Role Management

-- Fix chat_messages table RLS policies to prevent anonymous access
DROP POLICY IF EXISTS "Users can view their own chat messages or admins can view all" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can create their own chat messages" ON public.chat_messages;

CREATE POLICY "Authenticated users can view their own chat messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE POLICY "Admins can view all chat messages"
ON public.chat_messages
FOR SELECT  
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Authenticated users can create their own chat messages"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- Fix link_checks table RLS policies to prevent anonymous access
DROP POLICY IF EXISTS "Anyone can create link checks" ON public.link_checks;
DROP POLICY IF EXISTS "Users can view their own link checks or admins can view all" ON public.link_checks;

CREATE POLICY "Authenticated users can create link checks"
ON public.link_checks
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (auth.uid() = user_id OR user_id IS NULL)
);

CREATE POLICY "Authenticated users can view their own link checks"
ON public.link_checks
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE POLICY "Admins can view all link checks"
ON public.link_checks
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Fix profiles table RLS policies to remove null user_id access
DROP POLICY IF EXISTS "Users can view their own profile or admins can view all" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Add unique constraint to user_roles to prevent duplicate roles
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_unique UNIQUE (user_id, role);

-- Prevent users from modifying their own roles  
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;

CREATE POLICY "System can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  -- Only allow during user registration or by admins
  auth.uid() = user_id AND role = 'user'::app_role
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create audit log table for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
ON public.security_audit_log
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert audit logs"
ON public.security_audit_log
FOR INSERT
TO authenticated
WITH CHECK (true);