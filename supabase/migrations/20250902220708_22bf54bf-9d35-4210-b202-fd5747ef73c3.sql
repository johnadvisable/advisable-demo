-- SECURITY FIX: Restrict Employee Personal Information Exposure
-- Issue: Personal social media profiles (Twitter, Instagram, GitHub) exposed publicly
-- Fix: Only expose professional LinkedIn profiles publicly, hide other personal social media

-- Update the public-safe function to only include professional information
CREATE OR REPLACE FUNCTION public.get_all_team_members_public_safe(p_language_code character varying)
 RETURNS TABLE(
   id uuid, 
   name text, 
   job_position text, 
   bio text, 
   role_description text, 
   image_url text, 
   linkedin_url text,  -- Keep LinkedIn as it's professional networking
   -- SECURITY: Remove twitter_url, github_url, instagram_url from public access
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
    tm.linkedin_url,  -- Professional networking - kept for public access
    -- SECURITY FIX: Personal social media removed from public access
    -- tm.twitter_url, tm.github_url, tm.instagram_url - now admin-only
    -- EMAIL IS INTENTIONALLY EXCLUDED FOR SECURITY REASONS
    tm.specializations,
    tm.achievements,
    tm.is_leadership,
    tm.display_order
  FROM public.team_members tm
  ORDER BY tm.display_order, tm.id;
END;
$function$;

-- Add security comment documenting the change
COMMENT ON FUNCTION public.get_all_team_members_public_safe(character varying) IS 'Public-safe team member function that excludes personal information (email, Twitter, GitHub, Instagram) to prevent social engineering attacks. Only exposes professional LinkedIn profiles and basic work information.';

-- Ensure admin function still has access to all data for management
CREATE OR REPLACE FUNCTION public.get_all_team_members_admin(p_language_code character varying)
 RETURNS TABLE(
   id uuid, 
   name text, 
   job_position text, 
   bio text, 
   role_description text, 
   image_url text, 
   linkedin_url text, 
   twitter_url text,    -- Admin can see all social media
   github_url text,     -- Admin can see all social media  
   instagram_url text,  -- Admin can see all social media
   email text,          -- Admin can see email
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
  -- Security check: Only admins can access this function
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
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
    tm.twitter_url,      -- Admin access to all social media
    tm.github_url,       -- Admin access to all social media
    tm.instagram_url,    -- Admin access to all social media
    tm.email,            -- Admin access to email
    tm.specializations,
    tm.achievements,
    tm.is_leadership,
    tm.display_order
  FROM public.team_members tm
  ORDER BY tm.display_order, tm.id;
END;
$function$;

COMMENT ON FUNCTION public.get_all_team_members_admin(character varying) IS 'Admin-only function with access to complete team member information including email and all social media profiles. Requires admin privileges.';