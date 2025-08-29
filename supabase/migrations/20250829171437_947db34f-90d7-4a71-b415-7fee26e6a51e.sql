-- Fix incident_reports RLS policies to prevent any potential anonymous access
-- and strengthen authentication requirements

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.incident_reports;  
DROP POLICY IF EXISTS "Users can view their own reports or admins can view all" ON public.incident_reports;

-- Create new secure policies with explicit authentication checks
CREATE POLICY "Authenticated users can create their own reports"
ON public.incident_reports
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE POLICY "Authenticated users can update their own reports"
ON public.incident_reports  
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE POLICY "Authenticated users can view their own reports"
ON public.incident_reports
FOR SELECT
TO authenticated  
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- Separate admin policy with additional security checks
CREATE POLICY "Verified admins can view all reports"
ON public.incident_reports
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role) = true
  AND EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email_confirmed_at IS NOT NULL
  )
);