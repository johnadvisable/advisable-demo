-- First, create the blog_post_translations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.blog_post_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID NOT NULL,
  language_id INTEGER NOT NULL,
  title TEXT,
  excerpt TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(blog_post_id, language_id)
);

-- Enable RLS
ALTER TABLE public.blog_post_translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access to blog_post_translations" 
ON public.blog_post_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify blog_post_translations" 
ON public.blog_post_translations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create or replace the function to get all blog posts with translations
CREATE OR REPLACE FUNCTION public.get_all_blog_posts_with_translation(p_language_code character varying)
RETURNS TABLE(
  id uuid,
  title text,
  slug text,
  excerpt text,
  content text,
  category text,
  author text,
  published_date timestamp with time zone,
  featured_image text,
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
  
  -- Get default language ID (English)
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
    bp.slug,
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
    bp.category,
    bp.author,
    bp.published_date,
    bp.featured_image,
    bp.created_at,
    bp.updated_at
  FROM public.blog_posts bp
  ORDER BY bp.published_date DESC;
END;
$function$;

-- Create function to get blog post by slug with translations
CREATE OR REPLACE FUNCTION public.get_blog_post_by_slug_with_translation(p_slug text, p_language_code character varying)
RETURNS TABLE(
  id uuid,
  title text,
  slug text,
  excerpt text,
  content text,
  category text,
  author text,
  published_date timestamp with time zone,
  featured_image text,
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
  
  -- Get default language ID (English)
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
    bp.slug,
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
    bp.category,
    bp.author,
    bp.published_date,
    bp.featured_image,
    bp.created_at,
    bp.updated_at
  FROM public.blog_posts bp
  WHERE bp.slug = p_slug;
END;
$function$;

-- Create function to get blog post by ID with translations (for admin)
CREATE OR REPLACE FUNCTION public.get_blog_post_by_id_with_translation(p_id uuid, p_language_code character varying)
RETURNS TABLE(
  id uuid,
  title text,
  slug text,
  excerpt text,
  content text,
  category text,
  author text,
  published_date timestamp with time zone,
  featured_image text,
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
  
  -- Get default language ID (English)
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
    bp.slug,
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
    bp.category,
    bp.author,
    bp.published_date,
    bp.featured_image,
    bp.created_at,
    bp.updated_at
  FROM public.blog_posts bp
  WHERE bp.id = p_id;
END;
$function$;