-- Security Fix: Remove insecure team members function that exposes email addresses
-- This addresses the security finding: "Employee Email Addresses Could Be Harvested by Spammers"

-- Drop the insecure function that exposes employee emails to public access
DROP FUNCTION IF EXISTS public.get_all_team_members_public(character varying);

-- Update RLS policy to be more restrictive - only allow access via secure functions
-- First drop the overly permissive policy
DROP POLICY IF EXISTS "Public can view basic team member info via secure function only" ON public.team_members;

-- Create a more restrictive policy that only allows admin access to the table directly
-- Public access should only happen through the secure function
CREATE POLICY "Only admins and secure functions can access team_members" 
ON public.team_members 
FOR SELECT 
TO public
USING (
  -- Allow admin users full access
  has_role(auth.uid(), 'admin'::app_role) 
  OR 
  -- Allow access only when called from a security definer function
  -- This ensures public access only happens through the safe function
  current_setting('role', true) = 'postgres'
);

-- Verify the secure function still exists and works properly
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
    -- EMAIL IS INTENTIONALLY EXCLUDED FOR SECURITY
    tm.specializations,
    tm.achievements,
    tm.is_leadership,
    tm.display_order
  FROM public.team_members tm
  ORDER BY tm.display_order, tm.id;
END;
$function$;

-- Add a comment to document the security consideration
COMMENT ON FUNCTION public.get_all_team_members_public_safe(character varying) IS 
'Secure function for public access to team member data. Email addresses are intentionally excluded to prevent spam harvesting. Use get_all_team_members_admin for admin access that includes emails.';