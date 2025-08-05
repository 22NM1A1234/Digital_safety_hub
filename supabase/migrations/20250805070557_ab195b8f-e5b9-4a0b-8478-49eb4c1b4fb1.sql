-- First, ensure the user_roles table allows INSERT for users creating their own roles
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;

-- Create proper RLS policies for user_roles
CREATE POLICY "Users can view their own role or admins can view all" 
ON public.user_roles 
FOR SELECT 
USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own role" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Recreate the generate_case_id function to ensure it exists
CREATE OR REPLACE FUNCTION public.generate_case_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RETURN 'CASE-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$function$;

-- Recreate the auto_generate_case_id trigger function
CREATE OR REPLACE FUNCTION public.auto_generate_case_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF NEW.case_id IS NULL OR NEW.case_id = '' THEN
    NEW.case_id = generate_case_id();
  END IF;
  RETURN NEW;
END;
$function$;

-- Ensure the trigger exists on incident_reports
DROP TRIGGER IF EXISTS trigger_auto_generate_case_id ON public.incident_reports;
CREATE TRIGGER trigger_auto_generate_case_id
  BEFORE INSERT ON public.incident_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_case_id();

-- Fix the new user role creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$function$;

-- Ensure the auth.users trigger exists
DROP TRIGGER IF EXISTS trigger_handle_new_user_role ON auth.users;
CREATE TRIGGER trigger_handle_new_user_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();

-- Manually create the user role for the existing user to fix immediate issue
INSERT INTO public.user_roles (user_id, role)
VALUES ('6f0452fc-0ce9-4d90-a4c2-69bc0a7c6106', 'user')
ON CONFLICT (user_id, role) DO NOTHING;