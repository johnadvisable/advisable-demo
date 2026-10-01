-- Clean up conflicting function overloads and create single, consistent versions

-- Drop all conflicting function overloads
DROP FUNCTION IF EXISTS public.get_news_item_by_slug_with_translation(text, character varying);
DROP FUNCTION IF EXISTS public.get_news_item_by_slug_with_translation(text, text);
DROP FUNCTION IF EXISTS public.get_service_by_slug_with_translation(text, character varying);
DROP FUNCTION IF EXISTS public.get_service_by_slug_with_translation(text, text);
DROP FUNCTION IF EXISTS public.get_service_category_by_slug_with_translation(text, character varying);
DROP FUNCTION IF EXISTS public.get_service_category_by_slug_with_translation(text, text);

-- Create single, consistent function for getting news by slug
CREATE OR REPLACE FUNCTION public.get_news_item_by_slug_with_translation(p_slug text, p_language_code text DEFAULT 'en')
RETURNS TABLE(
  id uuid, 
  title text, 
  excerpt text, 
  content text, 
  slug text, 
  type text, 
  featured_image text, 
  thumbnail_url text, 
  video_url text, 
  bunny_video_id text, 
  published_date timestamp with time zone, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
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
  
  -- Get default language ID
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    n.id,
    COALESCE(
      (SELECT nt.title FROM public.news_translations nt 
       WHERE nt.news_id = n.id AND nt.language_id = v_language_id),
      (SELECT nt.title FROM public.news_translations nt 
       WHERE nt.news_id = n.id AND nt.language_id = v_default_language_id),
      'Latest Company News'
    ) AS title,
    COALESCE(
      (SELECT nt.excerpt FROM public.news_translations nt 
       WHERE nt.news_id = n.id AND nt.language_id = v_language_id),
      (SELECT nt.excerpt FROM public.news_translations nt 
       WHERE nt.news_id = n.id AND nt.language_id = v_default_language_id),
      'Stay updated with our latest developments and achievements.'
    ) AS excerpt,
    COALESCE(
      (SELECT nt.content FROM public.news_translations nt 
       WHERE nt.news_id = n.id AND nt.language_id = v_language_id),
      (SELECT nt.content FROM public.news_translations nt 
       WHERE nt.news_id = n.id AND nt.language_id = v_default_language_id),
      'Discover the latest news, updates, and announcements from Advisable.'
    ) AS content,
    n.slug,
    n.type,
    n.featured_image,
    n.thumbnail_url,
    n.video_url,
    n.bunny_video_id,
    n.published_date,
    n.created_at,
    n.updated_at
  FROM public.news n
  WHERE n.slug = p_slug
  LIMIT 1;
END;
$function$;

-- Create single, consistent function for getting service by slug
CREATE OR REPLACE FUNCTION public.get_service_by_slug_with_translation(p_slug text, p_language_code text DEFAULT 'en')
RETURNS TABLE(
  id uuid, 
  category_id uuid, 
  slug text, 
  emoji text, 
  display_order integer, 
  title text, 
  short_description text, 
  long_description text
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
  
  -- Get default language ID
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    s.id,
    s.category_id,
    s.slug,
    s.emoji,
    s.display_order,
    COALESCE(
      (SELECT st.title FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.title FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS title,
    COALESCE(
      (SELECT st.short_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.short_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS short_description,
    COALESCE(
      (SELECT st.long_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.long_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS long_description
  FROM public.services s
  WHERE s.slug = p_slug
  LIMIT 1;
END;
$function$;

-- Create single, consistent function for getting service category by slug
CREATE OR REPLACE FUNCTION public.get_service_category_by_slug_with_translation(p_slug text, p_language_code text DEFAULT 'en')
RETURNS TABLE(
  id uuid, 
  slug text, 
  name text, 
  description text
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
  
  -- Get default language ID
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    sc.id,
    sc.slug,
    COALESCE(
      (SELECT sct.name FROM public.service_category_translations sct 
       WHERE sct.category_id = sc.id AND sct.language_id = v_language_id),
      (SELECT sct.name FROM public.service_category_translations sct 
       WHERE sct.category_id = sc.id AND sct.language_id = v_default_language_id),
      'Unnamed Category'
    ) AS name,
    COALESCE(
      (SELECT sct.description FROM public.service_category_translations sct 
       WHERE sct.category_id = sc.id AND sct.language_id = v_language_id),
      (SELECT sct.description FROM public.service_category_translations sct 
       WHERE sct.category_id = sc.id AND sct.language_id = v_default_language_id),
      ''
    ) AS description
  FROM public.service_categories sc
  WHERE sc.slug = p_slug
  LIMIT 1;
END;
$function$;