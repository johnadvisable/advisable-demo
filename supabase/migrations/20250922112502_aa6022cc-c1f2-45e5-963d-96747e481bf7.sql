-- Drop and recreate the functions to fix the linkedin_url column reference issue
DROP FUNCTION IF EXISTS public.get_all_team_members_admin(text);
DROP FUNCTION IF EXISTS public.get_all_team_members_public(text);

-- Recreate admin function without linkedin_url column
CREATE OR REPLACE FUNCTION public.get_all_team_members_admin(p_language_code text)
 RETURNS TABLE(id uuid, name text, job_position text, bio text, role_description text, image_url text, specializations text[], achievements text[], is_leadership boolean, display_order integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  -- Only allow admins to access sensitive team data
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required for detailed team member data.';
  END IF;

  -- Get language ID
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  -- Get default language ID
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
      'Team Member'
    )::text AS name,
    COALESCE(
      (SELECT tmt.job_title FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.job_title FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      'Position'
    )::text AS job_position,
    COALESCE(
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      ''
    )::text AS bio,
    COALESCE(
      (SELECT tmt.role_description FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.role_description FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      ''
    )::text AS role_description,
    COALESCE(tm.image_url, '')::text,
    -- SECURITY: All personal contact data removed including LinkedIn
    COALESCE(tm.specializations, ARRAY[]::text[]),
    COALESCE(tm.achievements, ARRAY[]::text[]),
    COALESCE(tm.is_leadership, false),
    COALESCE(tm.display_order, 0)
  FROM public.team_members tm
  ORDER BY tm.display_order, tm.id;
END;
$function$;

-- Recreate public function without linkedin_url column
CREATE OR REPLACE FUNCTION public.get_all_team_members_public(p_language_code text)
 RETURNS TABLE(id uuid, name text, job_position text, bio text, role_description text, image_url text, specializations text[], achievements text[], is_leadership boolean, display_order integer)
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
  
  -- Get default language ID
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
      'Team Member'
    )::text AS name,
    COALESCE(
      (SELECT tmt.job_title FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.job_title FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      'Position'
    )::text AS job_position,
    COALESCE(
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      ''
    )::text AS bio,
    COALESCE(
      (SELECT tmt.role_description FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.role_description FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      ''
    )::text AS role_description,
    COALESCE(tm.image_url, '')::text,
    -- SECURITY: All personal contact data removed for public access
    COALESCE(tm.specializations, ARRAY[]::text[]),
    COALESCE(tm.achievements, ARRAY[]::text[]),
    COALESCE(tm.is_leadership, false),
    COALESCE(tm.display_order, 0)
  FROM public.team_members tm
  ORDER BY tm.display_order, tm.id;
END;
$function$;