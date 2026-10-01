-- Create admin-only function for full team member access
CREATE FUNCTION public.get_all_team_members_admin(p_language_code character varying DEFAULT 'en'::character varying)
RETURNS TABLE(
  id uuid,
  name text,
  job_position text,
  bio text,
  image_url text,
  email text,
  linkedin_url text,
  twitter_url text,
  github_url text,
  instagram_url text,
  display_order integer,
  is_leadership boolean,
  role_description text,
  achievements text[],
  specializations text[]
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  -- Check if user is admin
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
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
  
  -- If language not found, use default
  IF v_language_id IS NULL THEN
    v_language_id := v_default_language_id;
  END IF;
  
  RETURN QUERY
  SELECT 
    tm.id,
    COALESCE(tmt.name, 'Team Member') AS name,
    COALESCE(tmt.job_title, 'Position') AS job_position,
    tmt.bio,
    tm.image_url,
    tm.email, -- Admin access includes email
    tm.linkedin_url,
    tm.twitter_url, -- Admin access includes personal social media
    tm.github_url,
    tm.instagram_url,
    tm.display_order,
    tm.is_leadership,
    tmt.role_description,
    tm.achievements,
    tm.specializations
  FROM public.team_members tm
  LEFT JOIN public.team_member_translations tmt 
    ON tm.id = tmt.team_member_id AND tmt.language_id = v_language_id
  ORDER BY tm.display_order ASC NULLS LAST, tmt.name ASC NULLS LAST;
END;
$function$;