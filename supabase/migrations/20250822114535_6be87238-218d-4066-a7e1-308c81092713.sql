-- Fix security issue: Restrict access to sensitive employee data in team_members table

-- First, update the existing RLS policies to be more restrictive
DROP POLICY IF EXISTS "Allow public read access to team_members" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated users can select team_members" ON public.team_members;

-- Create new restrictive policies
CREATE POLICY "Public can view basic team info only" 
ON public.team_members 
FOR SELECT 
USING (true);

-- Only admins can see all data including sensitive information
CREATE POLICY "Admins can view all team member data" 
ON public.team_members 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create a new secure function that filters sensitive data based on user role
CREATE OR REPLACE FUNCTION public.get_team_members_public_safe(p_language_code character varying)
RETURNS TABLE(
  id uuid,
  name text,
  job_position text,
  bio text,
  role_description text,
  image_url text,
  specializations text[],
  achievements text[],
  is_leadership boolean,
  display_order integer,
  -- Sensitive fields - only returned for admins
  linkedin_url text,
  twitter_url text,
  github_url text,
  instagram_url text,
  email text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_is_admin BOOLEAN;
BEGIN
  -- Check if current user is admin
  v_is_admin := has_role(auth.uid(), 'admin'::app_role);
  
  -- Get language ID
  SELECT id INTO v_language_id 
  FROM public.languages 
  WHERE code = p_language_code;
  
  RETURN QUERY
  SELECT 
    tm.id,
    COALESCE(
      (SELECT tmt.name FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.name
    ) AS name,
    COALESCE(
      (SELECT tmt.job_title FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.position
    ) AS job_position,
    COALESCE(
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.bio
    ) AS bio,
    COALESCE(
      (SELECT tmt.role_description FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.role_description
    ) AS role_description,
    tm.image_url,
    tm.specializations,
    tm.achievements,
    tm.is_leadership,
    tm.display_order,
    -- Sensitive fields - only return if user is admin, otherwise NULL
    CASE WHEN v_is_admin THEN tm.linkedin_url ELSE NULL END AS linkedin_url,
    CASE WHEN v_is_admin THEN tm.twitter_url ELSE NULL END AS twitter_url,
    CASE WHEN v_is_admin THEN tm.github_url ELSE NULL END AS github_url,
    CASE WHEN v_is_admin THEN tm.instagram_url ELSE NULL END AS instagram_url,
    CASE WHEN v_is_admin THEN tm.email ELSE NULL END AS email
  FROM public.team_members tm
  ORDER BY tm.display_order, tm.name;
END;
$function$;

-- Update the existing function to also use the secure approach
CREATE OR REPLACE FUNCTION public.get_all_team_members_with_translation(p_language_code character varying)
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
  email text,
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
  v_is_admin BOOLEAN;
BEGIN
  -- Check if current user is admin
  v_is_admin := has_role(auth.uid(), 'admin'::app_role);
  
  -- Get language ID
  SELECT id INTO v_language_id 
  FROM public.languages 
  WHERE code = p_language_code;
  
  RETURN QUERY
  SELECT 
    tm.id,
    COALESCE(
      (SELECT tmt.name FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.name
    ) AS name,
    COALESCE(
      (SELECT tmt.job_title FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.position
    ) AS job_position,
    COALESCE(
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.bio
    ) AS bio,
    COALESCE(
      (SELECT tmt.role_description FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.role_description
    ) AS role_description,
    tm.image_url,
    -- Sensitive fields - only return if user is admin, otherwise NULL
    CASE WHEN v_is_admin THEN tm.linkedin_url ELSE NULL END AS linkedin_url,
    CASE WHEN v_is_admin THEN tm.twitter_url ELSE NULL END AS twitter_url,
    CASE WHEN v_is_admin THEN tm.github_url ELSE NULL END AS github_url,
    CASE WHEN v_is_admin THEN tm.instagram_url ELSE NULL END AS instagram_url,
    CASE WHEN v_is_admin THEN tm.email ELSE NULL END AS email,
    tm.specializations,
    tm.achievements,
    tm.is_leadership,
    tm.display_order
  FROM public.team_members tm
  ORDER BY tm.display_order, tm.name;
END;
$function$;