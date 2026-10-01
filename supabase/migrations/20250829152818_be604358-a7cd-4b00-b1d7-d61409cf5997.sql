-- Create a public version of the team members function that shows all data
CREATE OR REPLACE FUNCTION public.get_all_team_members_public(p_language_code character varying)
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
AS $$
DECLARE
  v_language_id INTEGER;
BEGIN
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
    tm.linkedin_url,
    tm.twitter_url,
    tm.github_url,
    tm.instagram_url,
    tm.email,
    tm.specializations,
    tm.achievements,
    tm.is_leadership,
    tm.display_order
  FROM public.team_members tm
  ORDER BY tm.display_order, tm.name;
END;
$$;