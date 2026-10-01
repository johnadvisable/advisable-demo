-- Fix remaining security functions that are missing SET search_path TO 'public'

-- Fix service-related functions that are missing search_path
CREATE OR REPLACE FUNCTION public.get_all_service_categories(p_language_code text)
 RETURNS TABLE(id uuid, slug text, name text, description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    sc.id,
    sc.slug,
    sct.name,
    sct.description
  FROM service_categories sc
  JOIN service_category_translations sct ON sc.id = sct.category_id
  JOIN languages l ON sct.language_id = l.id
  WHERE l.code = p_language_code
  ORDER BY sc.slug;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_service_by_slug(p_slug text, p_language_code text)
 RETURNS TABLE(id uuid, category_id uuid, slug text, emoji text, display_order integer, title text, short_description text, long_description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.category_id,
    s.slug,
    s.emoji,
    s.display_order,
    st.title,
    st.short_description,
    st.long_description
  FROM services s
  JOIN service_translations st ON s.id = st.service_id
  JOIN languages l ON st.language_id = l.id
  WHERE s.slug = p_slug
  AND l.code = p_language_code;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_service_category_by_slug(p_slug text, p_language_code text)
 RETURNS TABLE(id uuid, slug text, name text, description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    sc.id,
    sc.slug,
    sct.name,
    sct.description
  FROM service_categories sc
  JOIN service_category_translations sct ON sc.id = sct.category_id
  JOIN languages l ON sct.language_id = l.id
  WHERE sc.slug = p_slug
  AND l.code = p_language_code;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_services_by_category_slug(p_category_slug text, p_language_code text)
 RETURNS TABLE(id uuid, category_id uuid, slug text, emoji text, display_order integer, title text, short_description text, long_description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.category_id,
    s.slug,
    s.emoji,
    s.display_order,
    st.title,
    st.short_description,
    st.long_description
  FROM services s
  JOIN service_translations st ON s.id = st.service_id
  JOIN languages l ON st.language_id = l.id
  JOIN service_categories sc ON s.category_id = sc.id
  WHERE sc.slug = p_category_slug
  AND l.code = p_language_code
  ORDER BY s.display_order;
END;
$function$;

-- Fix team member functions
CREATE OR REPLACE FUNCTION public.get_all_team_members_with_translations(p_language_code text)
 RETURNS TABLE(id uuid, name text, job_position text, bio text, role_description text, image_url text, linkedin_url text, twitter_url text, github_url text, instagram_url text, email text, specializations text[], achievements text[], is_leadership boolean, display_order integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Return team members with translations for the specified language
  RETURN QUERY
  SELECT 
    tm.id,
    COALESCE(tmt.name, tm.name) as name,
    COALESCE(tmt.job_title, tm.position) as job_position,
    COALESCE(tmt.bio, tm.bio) as bio,
    COALESCE(tmt.role_description, tm.role_description) as role_description,
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
  FROM team_members tm
  LEFT JOIN team_member_translations tmt ON tm.id = tmt.team_member_id
  LEFT JOIN languages l ON tmt.language_id = l.id AND l.code = p_language_code
  ORDER BY tm.display_order, tm.name;
END;
$function$;