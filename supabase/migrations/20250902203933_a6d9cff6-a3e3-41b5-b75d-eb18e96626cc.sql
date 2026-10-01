-- Update get_news_item_by_slug_with_translation function to use correct table names
CREATE OR REPLACE FUNCTION public.get_news_item_by_slug_with_translation(p_slug text, p_language_code text)
RETURNS TABLE(id uuid, title text, excerpt text, content text, slug text, type text, featured_image text, thumbnail_url text, video_url text, bunny_video_id text, published_date timestamp with time zone, created_at timestamp with time zone, updated_at timestamp with time zone)
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