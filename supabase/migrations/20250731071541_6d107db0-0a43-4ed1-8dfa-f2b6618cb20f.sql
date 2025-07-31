-- Disable email confirmation for new signups
UPDATE auth.config SET 
  enable_signup = true,
  enable_email_confirmations = false
WHERE id = 1;