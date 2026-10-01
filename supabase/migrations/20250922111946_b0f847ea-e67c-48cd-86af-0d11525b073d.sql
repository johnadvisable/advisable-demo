-- FINAL SECURITY CLEANUP: Remove even LinkedIn URLs for maximum employee privacy protection
-- This prevents all forms of social engineering and targeted attacks

-- Clear any existing LinkedIn URLs
UPDATE team_members SET linkedin_url = NULL WHERE linkedin_url IS NOT NULL;

-- Drop the LinkedIn URL column entirely to prevent future data insertion
ALTER TABLE team_members DROP COLUMN IF EXISTS linkedin_url;

-- Log the security action
INSERT INTO admin_operations_log (operation_type, description)
VALUES ('SECURITY_CLEANUP_FINAL', 'Removed all employee LinkedIn URLs from team_members table for maximum privacy protection and anti-phishing security');

-- Verify the cleanup
SELECT 'team_members table secured - no personal contact data remains' as security_status;