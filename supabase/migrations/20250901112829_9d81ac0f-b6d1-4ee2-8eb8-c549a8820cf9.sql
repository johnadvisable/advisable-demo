-- Step 3: Fix remaining functions without search_path (Continued Security Fix)

-- Continue fixing the remaining functions that lack search_path security settings

CREATE OR REPLACE FUNCTION public.get_all_team_members_admin(p_language_code character varying)
RETURNS TABLE(id uuid, name text, job_position text, bio text, role_description text, image_url text, linkedin_url text, twitter_url text, github_url text, instagram_url text, email text, specializations text[], achievements text[], is_leadership boolean, display_order integer)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  -- Security check: Only admins can call this function
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
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
    tm.twitter_url,
    tm.github_url,
    tm.instagram_url,
    tm.email,
    tm.specializations,
    tm.achievements,
    tm.is_leadership,
    tm.display_order
  FROM public.team_members tm
  ORDER BY tm.display_order, tm.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_all_team_members_public_safe(p_language_code character varying)
RETURNS TABLE(id uuid, name text, job_position text, bio text, role_description text, image_url text, linkedin_url text, twitter_url text, github_url text, instagram_url text, specializations text[], achievements text[], is_leadership boolean, display_order integer)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
    tm.specializations,
    tm.achievements,
    tm.is_leadership,
    tm.display_order
  FROM public.team_members tm
  ORDER BY tm.display_order, tm.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_client_categories(p_client_id uuid)
RETURNS text[]
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN ARRAY(
    SELECT category 
    FROM public.client_categories 
    WHERE client_id = p_client_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.check_auth_rate_limit(user_ip inet)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  attempt_count integer;
  time_window interval := '15 minutes';
  max_attempts integer := 5;
BEGIN
  -- Count recent failed attempts from this IP
  SELECT COUNT(*) INTO attempt_count
  FROM public.security_audit_log
  WHERE ip_address = user_ip
    AND action = 'auth_failed'
    AND created_at > NOW() - time_window;
  
  -- Return false if too many attempts
  IF attempt_count >= max_attempts THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_partner_categories(p_partner_id text)
RETURNS text[]
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN ARRAY(
    SELECT category 
    FROM public.partner_partner_categories 
    WHERE partner_id = p_partner_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.user_has_permission(permission_name text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role_val app_role;
BEGIN
  -- Get user role
  SELECT role INTO user_role_val
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  -- Admin has all permissions
  IF user_role_val = 'admin' THEN
    RETURN true;
  END IF;
  
  -- Add more granular permissions as needed
  -- For now, only admin has permissions
  RETURN false;
END;
$$;

-- Also fix the last few critical functions

CREATE OR REPLACE FUNCTION public.get_client_categories()
RETURNS text[]
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  category_order TEXT[] := ARRAY[
    'Venture Studio Services',
    'Digital Agency Services', 
    'Ecommercen',
    'Market Data',
    'ePrescription Cloud ERP',
    'Advisable AI'
  ];
  db_categories TEXT[];
  sorted_categories TEXT[];
BEGIN
  -- Get unique categories from database
  SELECT ARRAY_AGG(DISTINCT category ORDER BY category)
  INTO db_categories
  FROM client_categories;
  
  -- Filter and sort categories according to the specified order
  SELECT ARRAY_AGG(category)
  INTO sorted_categories
  FROM unnest(category_order) AS category
  WHERE category = ANY(COALESCE(db_categories, ARRAY[]::TEXT[]));
  
  RETURN COALESCE(sorted_categories, ARRAY[]::TEXT[]);
END;
$$;

-- Fix more blog post issues - populate the blog_post_translations table with sample data
INSERT INTO public.blog_post_translations (blog_post_id, language_id, title, excerpt, content)
SELECT 
  bp.id,
  1, -- English language ID
  'Sample Article: ' || bp.slug,
  'This is a sample excerpt for the blog post: ' || bp.slug,
  'This is sample content for the blog post. The original content will be added by the admin.'
FROM public.blog_posts bp
WHERE NOT EXISTS (
  SELECT 1 FROM public.blog_post_translations bpt 
  WHERE bpt.blog_post_id = bp.id AND bpt.language_id = 1
)
LIMIT 50;

-- Improve the get_blog_post_with_translation function to handle individual blog posts
CREATE OR REPLACE FUNCTION public.get_blog_post_with_translation(p_blog_id uuid, p_language_code character varying)
RETURNS TABLE(
    id uuid, 
    title text, 
    excerpt text, 
    content text, 
    slug text, 
    author text, 
    category text, 
    featured_image text, 
    published_date timestamp with time zone
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
    bp.id,
    COALESCE(
      (SELECT bpt.title FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      (SELECT bpt.title FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_default_language_id),
      'Untitled Article'
    ) AS title,
    COALESCE(
      (SELECT bpt.excerpt FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      (SELECT bpt.excerpt FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_default_language_id),
      'No excerpt available'
    ) AS excerpt,
    COALESCE(
      (SELECT bpt.content FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      (SELECT bpt.content FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_default_language_id),
      'Content not available'
    ) AS content,
    bp.slug,
    bp.author,
    bp.category,
    bp.featured_image,
    bp.published_date
  FROM public.blog_posts bp
  WHERE bp.id = p_blog_id;
END;
$$;