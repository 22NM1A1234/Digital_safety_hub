-- Drop the problematic admin policy that references auth.users
DROP POLICY IF EXISTS "Verified admins can view all reports" ON incident_reports;

-- Create a simpler admin policy that only checks the role
CREATE POLICY "Admins can view all reports"
ON incident_reports
FOR SELECT
USING (
  (auth.uid() IS NOT NULL) AND 
  has_role(auth.uid(), 'admin'::app_role)
);