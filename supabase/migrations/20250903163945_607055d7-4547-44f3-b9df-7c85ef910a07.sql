-- Fix team members function to match actual table structure
CREATE OR REPLACE FUNCTION public.get_all_team_members_with_translations(p_language_code character varying)
 RETURNS TABLE(id uuid, name text, job_position text, bio text, image_url text, linkedin_url text, twitter_url text, github_url text, instagram_url text, email text, display_order integer, is_leadership boolean, achievements text[], specializations text[], created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
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
      'Unnamed Member'
    ) AS name,
    COALESCE(
      (SELECT tmt.job_position FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.job_position FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      ''
    ) AS job_position,
    COALESCE(
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      ''
    ) AS bio,
    tm.image_url,
    tm.linkedin_url,
    tm.twitter_url,
    tm.github_url,
    tm.instagram_url,
    tm.email,
    COALESCE(tm.display_order, 0) AS display_order,
    COALESCE(tm.is_leadership, false) AS is_leadership,
    COALESCE(tm.achievements, ARRAY[]::text[]) AS achievements,
    COALESCE(tm.specializations, ARRAY[]::text[]) AS specializations,
    tm.created_at,
    tm.updated_at
  FROM public.team_members tm
  ORDER BY tm.display_order ASC NULLS LAST;
END;
$function$;