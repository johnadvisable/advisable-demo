-- Fix the news item functions with proper table aliasing
CREATE OR REPLACE FUNCTION public.get_all_news_items_with_translation(p_language_code character varying)
 RETURNS TABLE(id uuid, title text, excerpt text, content text, featured_image text, published_date timestamp with time zone, type text, video_url text)
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
    n.id,
    COALESCE(
      (SELECT nt.title FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_language_id),
      n.title
    ) AS title,
    COALESCE(
      (SELECT nt.excerpt FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_language_id),
      n.excerpt
    ) AS excerpt,
    COALESCE(
      (SELECT nt.content FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_language_id),
      n.content
    ) AS content,
    n.featured_image,
    n.published_date,
    n.type,
    n.video_url
  FROM public.news_items n
  ORDER BY n.published_date DESC;
END;
$function$;

-- Fix the single news item function
CREATE OR REPLACE FUNCTION public.get_news_item_with_translation(p_news_item_id uuid, p_language_code character varying)
 RETURNS TABLE(id uuid, title text, excerpt text, content text, featured_image text, published_date timestamp with time zone, type text, video_url text)
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
    n.id,
    COALESCE(
      (SELECT nt.title FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_language_id),
      n.title
    ) AS title,
    COALESCE(
      (SELECT nt.excerpt FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_language_id),
      n.excerpt
    ) AS excerpt,
    COALESCE(
      (SELECT nt.content FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_language_id),
      n.content
    ) AS content,
    n.featured_image,
    n.published_date,
    n.type,
    n.video_url
  FROM public.news_items n
  WHERE n.id = p_news_item_id;
END;
$function$;

-- Fix the blog posts function
CREATE OR REPLACE FUNCTION public.get_all_blog_posts_with_translation(p_language_code character varying)
 RETURNS TABLE(id uuid, title text, excerpt text, content text, featured_image text, slug text, category text, author text, published_date timestamp with time zone)
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
    bp.id,
    COALESCE(
      (SELECT bpt.title FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      bp.title
    ) AS title,
    COALESCE(
      (SELECT bpt.excerpt FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      bp.excerpt
    ) AS excerpt,
    COALESCE(
      (SELECT bpt.content FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      bp.content
    ) AS content,
    bp.featured_image,
    bp.slug,
    bp.category,
    bp.author,
    bp.published_date
  FROM public.blog_posts bp
  ORDER BY bp.published_date DESC;
END;
$function$;

-- Fix the single blog post function
CREATE OR REPLACE FUNCTION public.get_blog_post_with_translation(p_post_id uuid, p_language_code character varying)
 RETURNS TABLE(id uuid, title text, excerpt text, content text, featured_image text, slug text, category text, author text, published_date timestamp with time zone)
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
    bp.id,
    COALESCE(
      (SELECT bpt.title FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      bp.title
    ) AS title,
    COALESCE(
      (SELECT bpt.excerpt FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      bp.excerpt
    ) AS excerpt,
    COALESCE(
      (SELECT bpt.content FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      bp.content
    ) AS content,
    bp.featured_image,
    bp.slug,
    bp.category,
    bp.author,
    bp.published_date
  FROM public.blog_posts bp
  WHERE bp.id = p_post_id;
END;
$function$;