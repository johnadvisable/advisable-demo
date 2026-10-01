-- Fix critical blog post function with ambiguous column reference
DROP FUNCTION IF EXISTS public.get_blog_post_by_id_with_translation(uuid, character varying);

-- Create fixed blog post function with proper column aliasing
CREATE OR REPLACE FUNCTION public.get_blog_post_by_id_with_translation(p_id uuid, p_language_code character varying)
RETURNS TABLE(
  id uuid, 
  title text, 
  excerpt text, 
  content text, 
  slug text, 
  category text, 
  author text, 
  featured_image text, 
  published_date timestamp with time zone, 
  language_code text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        COALESCE(it.title, '') AS title,
        COALESCE(it.excerpt, '') AS excerpt,
        COALESCE(it.content, '') AS content,
        i.slug,
        COALESCE(i.category, 'General') AS category,
        COALESCE(i.author, 'Advisable Team') AS author,
        i.featured_image,
        i.published_date,
        p_language_code::text AS language_code
    FROM 
        public.insights i
    LEFT JOIN 
        public.insights_translations it 
        ON i.id = it.insights_id 
        AND it.language_id = (SELECT l.id FROM public.languages l WHERE l.code = p_language_code LIMIT 1)
    WHERE 
        i.id = p_id
        AND i.type IN ('article', 'news')
    LIMIT 1;
END;
$function$;