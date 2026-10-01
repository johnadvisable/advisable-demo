-- Fix function overloading issue for get_service_by_slug_with_translation
-- Drop any existing versions of the function to avoid conflicts
DROP FUNCTION IF EXISTS public.get_service_by_slug_with_translation(p_slug character varying, p_language_code character varying);
DROP FUNCTION IF EXISTS public.get_service_by_slug_with_translation(p_slug text, p_language_code text);

-- Recreate the function with consistent TEXT parameters
CREATE OR REPLACE FUNCTION public.get_service_by_slug_with_translation(
    p_slug TEXT,
    p_language_code TEXT DEFAULT 'en'
)
RETURNS TABLE (
    id UUID,
    slug TEXT,
    category_id UUID,
    emoji TEXT,
    display_order INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    title TEXT,
    short_description TEXT,
    long_description TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.slug,
        s.category_id,
        s.emoji,
        s.display_order,
        s.created_at,
        s.updated_at,
        COALESCE(st.title, s.slug) as title,
        COALESCE(st.short_description, '') as short_description,
        COALESCE(st.long_description, '') as long_description
    FROM services s
    LEFT JOIN service_translations st ON s.id = st.service_id
    LEFT JOIN languages l ON st.language_id = l.id
    WHERE s.slug = p_slug 
    AND (l.code = p_language_code OR l.code IS NULL)
    ORDER BY l.code NULLS LAST
    LIMIT 1;
END;
$$;