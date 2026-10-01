-- Security Fix: Remove insecure team members function that exposes email addresses
-- This addresses the security finding: "Employee Email Addresses Could Be Harvested by Spammers"

-- Drop the insecure function that exposes employee emails to public access
DROP FUNCTION IF EXISTS public.get_all_team_members_public(character varying);

-- Drop existing policies to recreate them with better security
DROP POLICY IF EXISTS "Only admins and secure functions can access team_members" ON public.team_members;
DROP POLICY IF EXISTS "Public can view basic team member info via secure function only" ON public.team_members;

-- Create a restrictive policy that only allows:
-- 1. Admin users to access the table directly
-- 2. Security definer functions to access the table (for controlled public access)
CREATE POLICY "Restrict team_members access to admins and secure functions only" 
ON public.team_members 
FOR SELECT 
TO public
USING (
  -- Allow admin users full access
  has_role(auth.uid(), 'admin'::app_role)
);

-- Ensure the secure function is properly defined and documented
-- This function excludes email addresses for public safety
CREATE OR REPLACE FUNCTION public.get_all_team_members_public_safe(p_language_code character varying)
RETURNS TABLE(
  id uuid, 
  name text, 
  job_position text, 
  bio text, 
  role_description text, 
  image_url text, 
  linkedin_url text, 
  twitter_url text, 
  github_url text, 
  instagram_url text, 
  specializations text[], 
  achievements text[], 
  is_leadership boolean, 
  display_order integer
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  -- Get language ID
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  -- Get default language ID (English)
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    tm.id,
    COALESCE(
      (SELECT tmt.name FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.name FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      'Unnamed'
    ) AS name,
    COALESCE(
      (SELECT tmt.job_title FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.job_title FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      'Position'
    ) AS job_position,
    COALESCE(
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      ''
    ) AS bio,
    COALESCE(
      (SELECT tmt.role_description FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.role_description FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      ''
    ) AS role_description,
    tm.image_url,
    tm.linkedin_url,
    tm.twitter_url,
    tm.github_url,
    tm.instagram_url,
    -- EMAIL IS INTENTIONALLY EXCLUDED FOR SECURITY REASONS
    tm.specializations,
    tm.achievements,
    tm.is_leadership,
    tm.display_order
  FROM public.team_members tm
  ORDER BY tm.display_order, tm.id;
END;
$function$;

-- Add security documentation
COMMENT ON FUNCTION public.get_all_team_members_public_safe(character varying) IS 
'SECURITY: This function provides safe public access to team member data. Email addresses are intentionally excluded to prevent spam harvesting and protect employee privacy. For admin access with emails, use get_all_team_members_admin.';

-- Log the security improvement
INSERT INTO public.security_audit_log (
  user_id,
  action,
  table_name,
  record_id,
  old_values,
  new_values,
  ip_address,
  user_agent
) VALUES (
  auth.uid(),
  'SECURITY_FIX_EMAIL_EXPOSURE',
  'team_members',
  null,
  '{"issue": "Public function exposed employee emails"}'::jsonb,
  '{"fix": "Removed insecure function, restricted RLS policies"}'::jsonb,
  inet_client_addr(),
  'System Security Fix'
);