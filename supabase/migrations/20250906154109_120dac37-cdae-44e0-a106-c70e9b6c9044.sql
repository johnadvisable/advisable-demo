-- Fix function overloading conflict for team members
-- Drop the conflicting function and create a single correct one

DROP FUNCTION IF EXISTS public.get_all_team_members_with_translations(character varying);
DROP FUNCTION IF EXISTS public.get_all_team_members_with_translations(text);

-- Recreate the function with a single parameter type
CREATE OR REPLACE FUNCTION public.get_all_team_members_with_translations(p_language_code text)
 RETURNS TABLE(id uuid, name text, job_position text, bio text, role_description text, image_url text, linkedin_url text, twitter_url text, github_url text, instagram_url text, email text, specializations text[], achievements text[], is_leadership boolean, display_order integer)
 LANGUAGE plpgsql
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
    COALESCE(tm.linkedin_url, '')::text,
    COALESCE(tm.twitter_url, '')::text,
    COALESCE(tm.github_url, '')::text,
    COALESCE(tm.instagram_url, '')::text,
    COALESCE(tm.email, '')::text,
    COALESCE(tm.specializations, ARRAY[]::text[]),
    COALESCE(tm.achievements, ARRAY[]::text[]),
    COALESCE(tm.is_leadership, false),
    COALESCE(tm.display_order, 0)
  FROM public.team_members tm
  ORDER BY tm.display_order, tm.id;
END;
$function$;