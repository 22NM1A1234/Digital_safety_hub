-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create incident reports table
CREATE TABLE public.incident_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id TEXT NOT NULL UNIQUE,
  incident_type TEXT NOT NULL,
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  incident_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  contact_email TEXT,
  contact_phone TEXT,
  evidence_files TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'closed')),
  assigned_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('crime', 'safety', 'system')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user alert reads table (to track which alerts users have seen)
CREATE TABLE public.user_alert_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_id UUID NOT NULL REFERENCES public.alerts(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, alert_id)
);

-- Create link checks table
CREATE TABLE public.link_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  is_safe BOOLEAN,
  risk_level TEXT CHECK (risk_level IN ('safe', 'low', 'medium', 'high', 'malicious')),
  threats_detected TEXT[],
  scan_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resources table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  is_user BOOLEAN NOT NULL DEFAULT true,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_alert_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for incident reports
CREATE POLICY "Users can view their own reports" ON public.incident_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports" ON public.incident_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" ON public.incident_reports
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for alerts (public read access)
CREATE POLICY "Anyone can view active alerts" ON public.alerts
  FOR SELECT USING (is_active = true);

-- Create RLS policies for user alert reads
CREATE POLICY "Users can manage their own alert reads" ON public.user_alert_reads
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for link checks
CREATE POLICY "Users can view their own link checks" ON public.link_checks
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create link checks" ON public.link_checks
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create RLS policies for resources (public read access)
CREATE POLICY "Anyone can view resources" ON public.resources
  FOR SELECT USING (true);

-- Create RLS policies for chat messages
CREATE POLICY "Users can view their own chat messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create function to generate case IDs
CREATE OR REPLACE FUNCTION generate_case_id() RETURNS TEXT AS $$
BEGIN
  RETURN 'CASE-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to auto-generate case ID for incident reports
CREATE OR REPLACE FUNCTION auto_generate_case_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.case_id IS NULL OR NEW.case_id = '' THEN
    NEW.case_id = generate_case_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating case IDs
CREATE TRIGGER trigger_auto_generate_case_id
  BEFORE INSERT ON public.incident_reports
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_case_id();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incident_reports_updated_at
  BEFORE UPDATE ON public.incident_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Insert sample data
INSERT INTO public.alerts (type, severity, title, message, location) VALUES
  ('crime', 'high', 'Phishing Campaign Alert', 'Multiple phishing emails targeting financial institutions detected in the downtown area', 'Downtown Financial District'),
  ('safety', 'medium', 'Software Update Required', 'Critical security updates available for commonly used business software', NULL),
  ('crime', 'critical', 'Ransomware Activity', 'Increased ransomware attacks reported against small businesses', 'Metro Area'),
  ('safety', 'low', 'Password Security Reminder', 'Regular reminder to update passwords and enable two-factor authentication', NULL);

INSERT INTO public.resources (title, description, content, category, difficulty_level, tags, is_featured) VALUES
  ('Phishing Email Identification', 'Learn to identify and avoid phishing attempts', 'Complete guide on recognizing phishing emails, suspicious links, and social engineering tactics.', 'Email Security', 'beginner', ARRAY['phishing', 'email', 'security'], true),
  ('Secure Password Management', 'Best practices for creating and managing passwords', 'Comprehensive guide on password security, two-factor authentication, and password managers.', 'Authentication', 'beginner', ARRAY['passwords', 'authentication', '2FA'], true),
  ('Incident Response Planning', 'How to respond to cybersecurity incidents', 'Step-by-step guide for businesses to create and implement incident response plans.', 'Incident Response', 'intermediate', ARRAY['incident', 'response', 'business'], false),
  ('Network Security Basics', 'Understanding network security fundamentals', 'Introduction to firewalls, VPNs, and network monitoring for small businesses.', 'Network Security', 'intermediate', ARRAY['network', 'firewall', 'VPN'], false);