-- Create a better function to get blog posts with proper language fallback
CREATE OR REPLACE FUNCTION public.get_all_blog_posts_with_language_fallback()
RETURNS TABLE(
  id uuid, 
  title text, 
  excerpt text, 
  content text, 
  featured_image text, 
  slug text, 
  category text, 
  author text, 
  published_date timestamp with time zone,
  original_language_code character varying,
  display_language_code character varying
)
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    COALESCE(
      bpt.title,
      bp_original.title,
      'No Title Available'
    )::text AS title,
    COALESCE(
      bpt.excerpt,
      bp_original.excerpt,
      ''
    )::text AS excerpt,
    COALESCE(
      bpt.content,
      bp_original.content,
      ''
    )::text AS content,
    bp.featured_image,
    bp.slug,
    bp.category,
    bp.author,
    bp.published_date,
    bp.language_code AS original_language_code,
    COALESCE(l.code, bp.language_code) AS display_language_code
  FROM public.blog_posts bp
  LEFT JOIN public.blog_post_translations bpt ON bp.id = bpt.blog_post_id
  LEFT JOIN public.languages l ON bpt.language_id = l.id AND l.code = 'en'
  LEFT JOIN public.blog_post_translations bp_original ON bp.id = bp_original.blog_post_id
  LEFT JOIN public.languages l_original ON bp_original.language_id = l_original.id AND l_original.code = bp.language_code
  WHERE 
    -- Only show articles that have either English translation or original language content
    (bpt.title IS NOT NULL AND bpt.title != '' AND bpt.title != 'Untitled') 
    OR 
    (bp_original.title IS NOT NULL AND bp_original.title != '' AND bp_original.title != 'Untitled')
  ORDER BY bp.published_date DESC;
END;
$function$

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_all_blog_posts_with_language_fallback() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_blog_posts_with_language_fallback() TO anon;