-- Create or replace the generate_case_id function
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

-- Create or replace the auto_generate_case_id trigger function
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

-- Create trigger for incident_reports table to auto-generate case_id
DROP TRIGGER IF EXISTS trigger_auto_generate_case_id ON public.incident_reports;
CREATE TRIGGER trigger_auto_generate_case_id
  BEFORE INSERT ON public.incident_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_case_id();

-- Create or replace the handle_new_user_role function
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

-- Create trigger for auth.users to auto-create user role
DROP TRIGGER IF EXISTS trigger_handle_new_user_role ON auth.users;
CREATE TRIGGER trigger_handle_new_user_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();