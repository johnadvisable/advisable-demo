-- Final cleanup of ALL function overload conflicts for services

-- Drop EVERY variation of the problematic functions to ensure clean slate
DROP FUNCTION IF EXISTS public.get_services_by_category_slug(text, character varying);
DROP FUNCTION IF EXISTS public.get_services_by_category_slug(text, text);
DROP FUNCTION IF EXISTS public.get_service_by_slug_with_translation(text, character varying);
DROP FUNCTION IF EXISTS public.get_service_by_slug_with_translation(text, text);
DROP FUNCTION IF EXISTS public.get_service_category_by_slug_safe(text, text);
DROP FUNCTION IF EXISTS public.get_service_by_slug_safe(text, text);

-- Recreate ALL service functions with consistent TEXT parameters only
CREATE OR REPLACE FUNCTION public.get_services_by_category_slug(p_category_slug text, p_language_code text)
RETURNS TABLE(
    id uuid,
    category_id uuid,
    slug text,
    emoji text,
    display_order integer,
    title text,
    short_description text,
    long_description text,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_language_id INTEGER;
    v_default_language_id INTEGER;
    v_category_id UUID;
BEGIN
    -- Get the category ID from slug
    SELECT sc.id INTO v_category_id 
    FROM public.service_categories sc
    WHERE sc.slug::text = p_category_slug;
    
    IF v_category_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Get the language ID
    SELECT l.id INTO v_language_id 
    FROM public.languages l
    WHERE l.code = p_language_code;
    
    -- Get default language ID
    SELECT l.id INTO v_default_language_id 
    FROM public.languages l
    WHERE l.is_default = TRUE 
    LIMIT 1;
    
    -- Return services with translations
    RETURN QUERY
    SELECT 
        s.id,
        s.category_id,
        s.slug::text,
        s.emoji::text,
        s.display_order,
        COALESCE(
            (SELECT st.title FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.title FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            'Untitled Service'
        )::text AS title,
        COALESCE(
            (SELECT st.short_description FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.short_description FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            ''
        )::text AS short_description,
        COALESCE(
            (SELECT st.long_description FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.long_description FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            ''
        )::text AS long_description,
        s.created_at,
        s.updated_at
    FROM public.services s
    WHERE s.category_id = v_category_id
    ORDER BY s.display_order ASC, s.created_at ASC;
END;
$function$;

-- Recreate get_service_by_slug_with_translation with only text parameters
CREATE OR REPLACE FUNCTION public.get_service_by_slug_with_translation(p_slug text, p_language_code text)
RETURNS TABLE(
    id uuid,
    category_id uuid,
    slug text,
    emoji text,
    display_order integer,
    title text,
    short_description text,
    long_description text,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_language_id INTEGER;
    v_default_language_id INTEGER;
    v_service_exists BOOLEAN;
BEGIN
    -- Check if service exists
    SELECT EXISTS(SELECT 1 FROM public.services WHERE services.slug::text = p_slug) INTO v_service_exists;
    
    IF NOT v_service_exists THEN
        RETURN;
    END IF;
    
    -- Get the language ID
    SELECT l.id INTO v_language_id 
    FROM public.languages l
    WHERE l.code = p_language_code;
    
    -- Get default language ID
    SELECT l.id INTO v_default_language_id 
    FROM public.languages l
    WHERE l.is_default = TRUE 
    LIMIT 1;
    
    -- Return the service with translations
    RETURN QUERY
    SELECT 
        s.id,
        s.category_id,
        s.slug::text,
        s.emoji::text,
        s.display_order,
        COALESCE(
            (SELECT st.title FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.title FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            'Untitled Service'
        )::text AS title,
        COALESCE(
            (SELECT st.short_description FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.short_description FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            ''
        )::text AS short_description,
        COALESCE(
            (SELECT st.long_description FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.long_description FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            ''
        )::text AS long_description,
        s.created_at,
        s.updated_at
    FROM public.services s
    WHERE s.slug::text = p_slug;
END;
$function$;

-- Create the safe functions needed by unified services
CREATE OR REPLACE FUNCTION public.get_service_category_by_slug_safe(p_slug text, p_language_code text)
RETURNS TABLE(id uuid, slug text, name text, description text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_language_id INTEGER;
    v_default_language_id INTEGER;
    v_category_exists BOOLEAN;
BEGIN
    -- Check if category exists
    SELECT EXISTS(SELECT 1 FROM public.service_categories WHERE service_categories.slug::text = p_slug) INTO v_category_exists;
    
    IF NOT v_category_exists THEN
        RETURN;
    END IF;
    
    -- Get the language ID
    SELECT l.id INTO v_language_id 
    FROM public.languages l
    WHERE l.code = p_language_code;
    
    -- Get default language ID
    SELECT l.id INTO v_default_language_id 
    FROM public.languages l
    WHERE l.is_default = TRUE 
    LIMIT 1;
    
    -- Return the category with translations
    RETURN QUERY
    SELECT 
        sc.id,
        sc.slug::text,
        COALESCE(
            (SELECT sct.name FROM public.service_category_translations sct 
             WHERE sct.category_id = sc.id AND sct.language_id = v_language_id),
            (SELECT sct.name FROM public.service_category_translations sct 
             WHERE sct.category_id = sc.id AND sct.language_id = v_default_language_id),
            'Unnamed Category'
        )::text AS name,
        COALESCE(
            (SELECT sct.description FROM public.service_category_translations sct 
             WHERE sct.category_id = sc.id AND sct.language_id = v_language_id),
            (SELECT sct.description FROM public.service_category_translations sct 
             WHERE sct.category_id = sc.id AND sct.language_id = v_default_language_id),
            ''
        )::text AS description
    FROM public.service_categories sc
    WHERE sc.slug::text = p_slug;
END;
$function$;

-- Create the safe service function needed by unified services  
CREATE OR REPLACE FUNCTION public.get_service_by_slug_safe(p_slug text, p_language_code text)
RETURNS TABLE(
    id uuid,
    category_id uuid,
    slug text,
    emoji text,
    display_order integer,
    title text,
    short_description text,
    long_description text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_language_id INTEGER;
    v_default_language_id INTEGER;
    v_service_exists BOOLEAN;
BEGIN
    -- Check if service exists
    SELECT EXISTS(SELECT 1 FROM public.services WHERE services.slug::text = p_slug) INTO v_service_exists;
    
    IF NOT v_service_exists THEN
        RETURN;
    END IF;
    
    -- Get the language ID
    SELECT l.id INTO v_language_id 
    FROM public.languages l
    WHERE l.code = p_language_code;
    
    -- Get default language ID
    SELECT l.id INTO v_default_language_id 
    FROM public.languages l
    WHERE l.is_default = TRUE 
    LIMIT 1;
    
    -- Return the service with translations
    RETURN QUERY
    SELECT 
        s.id,
        s.category_id,
        s.slug::text,
        s.emoji::text,
        s.display_order,
        COALESCE(
            (SELECT st.title FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.title FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            'Untitled Service'
        )::text AS title,
        COALESCE(
            (SELECT st.short_description FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.short_description FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            ''
        )::text AS short_description,
        COALESCE(
            (SELECT st.long_description FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_language_id),
            (SELECT st.long_description FROM public.service_translations st 
             WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
            ''
        )::text AS long_description
    FROM public.services s
    WHERE s.slug::text = p_slug;
END;
$function$;