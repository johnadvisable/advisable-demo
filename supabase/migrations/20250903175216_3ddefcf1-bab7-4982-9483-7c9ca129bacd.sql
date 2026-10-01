-- Drop all existing service-related functions
DROP FUNCTION IF EXISTS get_service_by_slug_with_translation(text, text);
DROP FUNCTION IF EXISTS get_service_by_slug_with_translation_fixed(text, character varying);
DROP FUNCTION IF EXISTS get_service_by_slug_safe(text, text);
DROP FUNCTION IF EXISTS get_service_category_by_slug_with_translation(text, text);
DROP FUNCTION IF EXISTS get_service_category_by_slug_safe(text, text);
DROP FUNCTION IF EXISTS get_services_by_category_slug(text, text);
DROP FUNCTION IF EXISTS get_all_services_with_translation(character varying);
DROP FUNCTION IF EXISTS get_all_services_with_translation_enhanced(character varying);

-- Create new simple service functions

-- 1. Get service by slug with translation
CREATE OR REPLACE FUNCTION get_service_by_slug_simple(p_slug text, p_language_code text DEFAULT 'en')
RETURNS TABLE(
    id uuid,
    slug text,
    category_id uuid,
    emoji text,
    display_order integer,
    title text,
    short_description text,
    long_description text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
    v_language_id INTEGER;
    v_default_language_id INTEGER;
BEGIN
    -- Get language IDs
    SELECT l.id INTO v_language_id 
    FROM languages l WHERE l.code = p_language_code;
    
    SELECT l.id INTO v_default_language_id 
    FROM languages l WHERE l.is_default = true LIMIT 1;
    
    RETURN QUERY
    SELECT 
        s.id,
        s.slug,
        s.category_id,
        s.emoji,
        s.display_order,
        COALESCE(
            (SELECT st.title FROM service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.title FROM service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            s.slug
        ) as title,
        COALESCE(
            (SELECT st.short_description FROM service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.short_description FROM service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            ''
        ) as short_description,
        COALESCE(
            (SELECT st.long_description FROM service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.long_description FROM service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            ''
        ) as long_description
    FROM services s
    WHERE s.slug = p_slug;
END;
$$;

-- 2. Get service category by slug with translation
CREATE OR REPLACE FUNCTION get_service_category_by_slug_simple(p_slug text, p_language_code text DEFAULT 'en')
RETURNS TABLE(
    id uuid,
    slug text,
    name text,
    description text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
    v_language_id INTEGER;
    v_default_language_id INTEGER;
BEGIN
    -- Get language IDs
    SELECT l.id INTO v_language_id 
    FROM languages l WHERE l.code = p_language_code;
    
    SELECT l.id INTO v_default_language_id 
    FROM languages l WHERE l.is_default = true LIMIT 1;
    
    RETURN QUERY
    SELECT 
        sc.id,
        sc.slug,
        COALESCE(
            (SELECT sct.name FROM service_category_translations sct 
             WHERE sct.category_id = sc.id AND sct.language_id = v_language_id),
            (SELECT sct.name FROM service_category_translations sct 
             WHERE sct.category_id = sc.id AND sct.language_id = v_default_language_id),
            'Unnamed Category'
        ) as name,
        COALESCE(
            (SELECT sct.description FROM service_category_translations sct 
             WHERE sct.category_id = sc.id AND sct.language_id = v_language_id),
            (SELECT sct.description FROM service_category_translations sct 
             WHERE sct.category_id = sc.id AND sct.language_id = v_default_language_id),
            ''
        ) as description
    FROM service_categories sc
    WHERE sc.slug = p_slug;
END;
$$;

-- 3. Get services by category slug with translation
CREATE OR REPLACE FUNCTION get_services_by_category_simple(p_category_slug text, p_language_code text DEFAULT 'en')
RETURNS TABLE(
    id uuid,
    slug text,
    category_id uuid,
    emoji text,
    display_order integer,
    title text,
    short_description text,
    long_description text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
    v_language_id INTEGER;
    v_default_language_id INTEGER;
    v_category_id UUID;
BEGIN
    -- Get category ID
    SELECT sc.id INTO v_category_id 
    FROM service_categories sc WHERE sc.slug = p_category_slug;
    
    IF v_category_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Get language IDs
    SELECT l.id INTO v_language_id 
    FROM languages l WHERE l.code = p_language_code;
    
    SELECT l.id INTO v_default_language_id 
    FROM languages l WHERE l.is_default = true LIMIT 1;
    
    RETURN QUERY
    SELECT 
        s.id,
        s.slug,
        s.category_id,
        s.emoji,
        s.display_order,
        COALESCE(
            (SELECT st.title FROM service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.title FROM service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            s.slug
        ) as title,
        COALESCE(
            (SELECT st.short_description FROM service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.short_description FROM service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            ''
        ) as short_description,
        COALESCE(
            (SELECT st.long_description FROM service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.long_description FROM service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            ''
        ) as long_description
    FROM services s
    WHERE s.category_id = v_category_id
    ORDER BY s.display_order, s.slug;
END;
$$;