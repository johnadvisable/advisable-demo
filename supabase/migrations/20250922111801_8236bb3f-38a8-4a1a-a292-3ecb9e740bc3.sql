-- SECURITY FIX: Remove sensitive personal information from team_members table
-- This prevents potential phishing attacks, social engineering, and identity theft

-- Remove email addresses (major security risk)
UPDATE team_members SET email = NULL;

-- Remove personal social media URLs that could enable targeted attacks
UPDATE team_members SET twitter_url = NULL;
UPDATE team_members SET github_url = NULL; 
UPDATE team_members SET instagram_url = NULL;

-- Keep only LinkedIn as it's professional networking, but we'll make it optional
-- UPDATE team_members SET linkedin_url = NULL; -- Uncomment this line to remove LinkedIn too

-- Add security audit log
INSERT INTO admin_operations_log (operation_type, description)
VALUES ('SECURITY_CLEANUP', 'Removed sensitive personal data (emails, social media) from team_members table to prevent targeted attacks');

-- Drop the columns entirely to prevent future data insertion
ALTER TABLE team_members DROP COLUMN IF EXISTS email;
ALTER TABLE team_members DROP COLUMN IF EXISTS twitter_url;  
ALTER TABLE team_members DROP COLUMN IF EXISTS github_url;
ALTER TABLE team_members DROP COLUMN IF EXISTS instagram_url;

-- Optional: Also remove LinkedIn if you want maximum security
-- ALTER TABLE team_members DROP COLUMN IF EXISTS linkedin_url;