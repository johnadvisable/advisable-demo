-- Drop and recreate the get_news_item_with_translation function to include thumbnail_url
DROP FUNCTION IF EXISTS public.get_news_item_with_translation(uuid, character varying);

CREATE OR REPLACE FUNCTION public.get_news_item_with_translation(p_item_id uuid, p_language_code character varying)
 RETURNS TABLE(id uuid, title text, excerpt text, content text, featured_image text, thumbnail_url text, published_date timestamp with time zone, type text, video_url text)
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
      (SELECT nt.title FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_language_id),
      (SELECT nt.title FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_default_language_id),
      'Untitled'
    ) AS title,
    COALESCE(
      (SELECT nt.excerpt FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_language_id),
      (SELECT nt.excerpt FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_default_language_id),
      ''
    ) AS excerpt,
    COALESCE(
      (SELECT nt.content FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_language_id),
      (SELECT nt.content FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_default_language_id),
      ''
    ) AS content,
    n.featured_image,
    n.thumbnail_url,
    n.published_date,
    n.type,
    n.video_url
  FROM public.news_items n
  WHERE n.id = p_item_id;
END;
$function$;