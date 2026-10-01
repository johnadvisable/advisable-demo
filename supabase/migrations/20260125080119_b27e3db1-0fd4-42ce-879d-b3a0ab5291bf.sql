-- Fix RPC functions for Insights translations (insights_translations uses language_id, not language_code)

-- Drop conflicting/old overloads (safe if missing)
DROP FUNCTION IF EXISTS public.get_all_insights_with_translation(text);
DROP FUNCTION IF EXISTS public.get_all_insights_with_translation(character varying);
DROP FUNCTION IF EXISTS public.get_insight_by_slug_with_translation(text, text);
DROP FUNCTION IF EXISTS public.get_insight_by_slug_with_translation(character varying, character varying);

-- Helper: resolve language id by code with fallback to default language
CREATE OR REPLACE FUNCTION public._lang_id_from_code(p_language_code text)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    (SELECT id FROM public.languages WHERE code = p_language_code LIMIT 1),
    (SELECT id FROM public.languages WHERE is_default = true LIMIT 1)
  );
$$;

-- Recreate get_all_insights_with_translation
CREATE OR REPLACE FUNCTION public.get_all_insights_with_translation(p_language_code text)
RETURNS TABLE (
  id uuid,
  slug text,
  title text,
  excerpt text,
  content text,
  author text,
  published_date timestamptz,
  featured_image text,
  type text,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH lang AS (
    SELECT public._lang_id_from_code(p_language_code) AS lang_id
  )
  SELECT
    i.id,
    i.slug,
    COALESCE(it.title, '')::text AS title,
    COALESCE(it.excerpt, '')::text AS excerpt,
    COALESCE(it.content, '')::text AS content,
    i.author,
    i.published_date,
    i.featured_image,
    COALESCE(i.type, '')::text AS type,
    GREATEST(i.updated_at, COALESCE(it.updated_at, i.updated_at)) AS updated_at
  FROM public.insights i
  CROSS JOIN lang
  LEFT JOIN public.insights_translations it
    ON it.insights_id = i.id
   AND it.language_id = lang.lang_id
  ORDER BY i.published_date DESC;
$$;

-- Recreate get_insight_by_slug_with_translation
CREATE OR REPLACE FUNCTION public.get_insight_by_slug_with_translation(p_slug text, p_language_code text)
RETURNS TABLE (
  id uuid,
  slug text,
  title text,
  excerpt text,
  content text,
  author text,
  published_date timestamptz,
  featured_image text,
  type text,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH lang AS (
    SELECT public._lang_id_from_code(p_language_code) AS lang_id
  )
  SELECT
    i.id,
    i.slug,
    COALESCE(it.title, '')::text AS title,
    COALESCE(it.excerpt, '')::text AS excerpt,
    COALESCE(it.content, '')::text AS content,
    i.author,
    i.published_date,
    i.featured_image,
    COALESCE(i.type, '')::text AS type,
    GREATEST(i.updated_at, COALESCE(it.updated_at, i.updated_at)) AS updated_at
  FROM public.insights i
  CROSS JOIN lang
  LEFT JOIN public.insights_translations it
    ON it.insights_id = i.id
   AND it.language_id = lang.lang_id
  WHERE i.slug = p_slug
  LIMIT 1;
$$;

-- Allow anonymous role to execute (needed for public pages)
GRANT EXECUTE ON FUNCTION public._lang_id_from_code(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_insights_with_translation(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_insight_by_slug_with_translation(text, text) TO anon, authenticated;
