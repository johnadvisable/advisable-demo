-- Fix the ambiguous column reference in get_all_service_categories_joined function
CREATE OR REPLACE FUNCTION public.get_all_service_categories_joined(p_language_code text)
RETURNS TABLE(id uuid, slug text, name text, description text)
LANGUAGE plpgsql
AS $function$
DECLARE
    v_language_id INTEGER;
BEGIN
    -- Get the language ID (use fully qualified reference)
    SELECT l.id INTO v_language_id 
    FROM public.languages l
    WHERE l.code = p_language_code;
    
    -- Return categories with translations
    RETURN QUERY
    SELECT 
        sc.id,
        sc.slug,
        sct.name,
        sct.description
    FROM public.service_categories sc
    JOIN public.service_category_translations sct ON sc.id = sct.category_id
    WHERE sct.language_id = v_language_id;
END;
$function$;