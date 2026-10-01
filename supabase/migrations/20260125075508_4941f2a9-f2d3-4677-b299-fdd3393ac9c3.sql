-- Drop all existing versions of the functions to avoid overloading issues
DROP FUNCTION IF EXISTS public.get_all_insights_with_translation(character varying);
DROP FUNCTION IF EXISTS public.get_all_insights_with_translation(text);
DROP FUNCTION IF EXISTS public.get_insight_by_slug_with_translation(text, character varying);
DROP FUNCTION IF EXISTS public.get_insight_by_slug_with_translation(text, text);

-- Recreate with consistent TEXT type
CREATE OR REPLACE FUNCTION public.get_all_insights_with_translation(p_language_code TEXT)
RETURNS TABLE(
  id UUID,
  slug TEXT,
  title TEXT,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  published_date DATE,
  featured_image TEXT,
  type TEXT,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.slug,
    COALESCE(it.title, i.title) AS title,
    COALESCE(it.excerpt, i.excerpt) AS excerpt,
    COALESCE(it.content, i.content) AS content,
    i.author,
    i.published_date,
    i.featured_image,
    i.type,
    GREATEST(i.updated_at, it.updated_at) AS updated_at
  FROM insights i
  LEFT JOIN insights_translations it 
    ON i.id = it.insights_id 
    AND it.language_code = p_language_code
  ORDER BY i.published_date DESC;
END;
$$;

-- Recreate the single insight function
CREATE OR REPLACE FUNCTION public.get_insight_by_slug_with_translation(p_slug TEXT, p_language_code TEXT)
RETURNS TABLE(
  id UUID,
  slug TEXT,
  title TEXT,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  published_date DATE,
  featured_image TEXT,
  type TEXT,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.slug,
    COALESCE(it.title, i.title) AS title,
    COALESCE(it.excerpt, i.excerpt) AS excerpt,
    COALESCE(it.content, i.content) AS content,
    i.author,
    i.published_date,
    i.featured_image,
    i.type,
    GREATEST(i.updated_at, it.updated_at) AS updated_at
  FROM insights i
  LEFT JOIN insights_translations it 
    ON i.id = it.insights_id 
    AND it.language_code = p_language_code
  WHERE i.slug = p_slug;
END;
$$;