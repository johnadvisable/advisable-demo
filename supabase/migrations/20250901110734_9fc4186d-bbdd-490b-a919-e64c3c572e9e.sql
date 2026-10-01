-- Create missing RPC functions for blog posts and news items translations
-- These functions are needed for the Blog and News components to work properly

-- 1. Create RPC function for blog posts with translations
CREATE OR REPLACE FUNCTION public.get_all_blog_posts_with_translation(p_language_code character varying)
 RETURNS TABLE(id uuid, title text, excerpt text, content text, slug text, category text, author text, featured_image text, published_date timestamp with time zone)
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
    bp.id,
    COALESCE(
      (SELECT bpt.title FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      (SELECT bpt.title FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_default_language_id),
      'Untitled Blog Post'
    ) AS title,
    COALESCE(
      (SELECT bpt.excerpt FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      (SELECT bpt.excerpt FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_default_language_id),
      ''
    ) AS excerpt,
    COALESCE(
      (SELECT bpt.content FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      (SELECT bpt.content FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_default_language_id),
      ''
    ) AS content,
    bp.slug,
    bp.category,
    bp.author,
    bp.featured_image,
    bp.published_date
  FROM public.blog_posts bp
  ORDER BY bp.published_date DESC;
END;
$function$;

-- 2. Create RPC function for news items with translations
CREATE OR REPLACE FUNCTION public.get_all_news_items_with_translation(p_language_code character varying)
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
    ni.id,
    COALESCE(
      (SELECT nit.title FROM public.news_item_translations nit 
       WHERE nit.news_item_id = ni.id AND nit.language_id = v_language_id),
      (SELECT nit.title FROM public.news_item_translations nit 
       WHERE nit.news_item_id = ni.id AND nit.language_id = v_default_language_id),
      'Untitled News Item'
    ) AS title,
    COALESCE(
      (SELECT nit.excerpt FROM public.news_item_translations nit 
       WHERE nit.news_item_id = ni.id AND nit.language_id = v_language_id),
      (SELECT nit.excerpt FROM public.news_item_translations nit 
       WHERE nit.news_item_id = ni.id AND nit.language_id = v_default_language_id),
      ''
    ) AS excerpt,
    COALESCE(
      (SELECT nit.content FROM public.news_item_translations nit 
       WHERE nit.news_item_id = ni.id AND nit.language_id = v_language_id),
      (SELECT nit.content FROM public.news_item_translations nit 
       WHERE nit.news_item_id = ni.id AND nit.language_id = v_default_language_id),
      ''
    ) AS content,
    ni.slug,
    ni.type,
    ni.featured_image,
    ni.thumbnail_url,
    ni.video_url,
    ni.bunny_video_id,
    ni.published_date,
    ni.created_at,
    ni.updated_at
  FROM public.news_items ni
  ORDER BY ni.published_date DESC;
END;
$function$;

-- 3. Create blog post translations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.blog_post_translations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id uuid NOT NULL,
  language_id integer NOT NULL,
  title text,
  excerpt text,
  content text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(blog_post_id, language_id)
);

-- 4. Enable RLS on blog_post_translations
ALTER TABLE public.blog_post_translations ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for blog_post_translations
CREATE POLICY "Public read access to blog_post_translations" 
ON public.blog_post_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify blog_post_translations" 
ON public.blog_post_translations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));