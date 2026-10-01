-- Fix function overload conflicts by removing all variations and recreating with consistent types

-- Drop ALL existing function variations to completely resolve overload conflicts
DROP FUNCTION IF EXISTS public.get_service_category_by_slug_safe(text, text);
DROP FUNCTION IF EXISTS public.get_service_category_by_slug_with_translation(character varying, character varying);
DROP FUNCTION IF EXISTS public.get_service_category_by_slug_with_translation(text, text);

-- Recreate the function with only text parameters to avoid any confusion
CREATE OR REPLACE FUNCTION public.get_service_category_by_slug_with_translation(p_slug text, p_language_code text)
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