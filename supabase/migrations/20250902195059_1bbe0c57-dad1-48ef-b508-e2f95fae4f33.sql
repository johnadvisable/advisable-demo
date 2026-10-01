-- Create missing RPC functions for insights
CREATE OR REPLACE FUNCTION public.get_all_insights_with_translation(p_language_code character varying)
 RETURNS TABLE(id uuid, title text, excerpt text, content text, slug text, category text, author text, featured_image text, published_date timestamp with time zone, language_code text, type text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
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
    i.id,
    COALESCE(
      (SELECT it.title FROM public.insights_translations it 
       WHERE it.insights_id = i.id AND it.language_id = v_language_id),
      (SELECT it.title FROM public.insights_translations it 
       WHERE it.insights_id = i.id AND it.language_id = v_default_language_id),
      'Untitled'
    ) AS title,
    COALESCE(
      (SELECT it.excerpt FROM public.insights_translations it 
       WHERE it.insights_id = i.id AND it.language_id = v_language_id),
      (SELECT it.excerpt FROM public.insights_translations it 
       WHERE it.insights_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS excerpt,
    COALESCE(
      (SELECT it.content FROM public.insights_translations it 
       WHERE it.insights_id = i.id AND it.language_id = v_language_id),
      (SELECT it.content FROM public.insights_translations it 
       WHERE it.insights_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS content,
    i.slug,
    'insights' AS category,
    i.author,
    i.featured_image,
    i.published_date,
    p_language_code::text AS language_code,
    i.type
  FROM public.insights i
  WHERE i.type IN ('insight', 'article')
  ORDER BY i.published_date DESC NULLS LAST, i.created_at DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_insight_by_slug_with_translation(p_slug text, p_language_code character varying)
 RETURNS TABLE(id uuid, title text, excerpt text, content text, slug text, category text, author text, featured_image text, published_date timestamp with time zone, language_code text, type text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
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
    i.id,
    COALESCE(
      (SELECT it.title FROM public.insights_translations it 
       WHERE it.insights_id = i.id AND it.language_id = v_language_id),
      (SELECT it.title FROM public.insights_translations it 
       WHERE it.insights_id = i.id AND it.language_id = v_default_language_id),
      'Untitled'
    ) AS title,
    COALESCE(
      (SELECT it.excerpt FROM public.insights_translations it 
       WHERE it.insights_id = i.id AND it.language_id = v_language_id),
      (SELECT it.excerpt FROM public.insights_translations it 
       WHERE it.insights_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS excerpt,
    COALESCE(
      (SELECT it.content FROM public.insights_translations it 
       WHERE it.insights_id = i.id AND it.language_id = v_language_id),
      (SELECT it.content FROM public.insights_translations it 
       WHERE it.insights_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS content,
    i.slug,
    'insights' AS category,
    i.author,
    i.featured_image,
    i.published_date,
    p_language_code::text AS language_code,
    i.type
  FROM public.insights i
  WHERE i.slug = p_slug AND i.type IN ('insight', 'article')
  LIMIT 1;
END;
$function$;