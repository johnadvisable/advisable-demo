-- Create improved service lookup function with proper fallback handling
CREATE OR REPLACE FUNCTION public.get_service_by_slug_with_translation_fixed(p_slug text, p_language_code text DEFAULT 'en'::text)
 RETURNS TABLE(id uuid, slug text, category_id uuid, emoji text, display_order integer, created_at timestamp with time zone, updated_at timestamp with time zone, title text, short_description text, long_description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_language_id INTEGER;
    v_default_language_id INTEGER;
    v_service_record RECORD;
BEGIN
    -- Get language IDs
    SELECT l.id INTO v_language_id 
    FROM public.languages l
    WHERE l.code = p_language_code;
    
    SELECT l.id INTO v_default_language_id 
    FROM public.languages l
    WHERE l.is_default = TRUE 
    LIMIT 1;
    
    -- First, find the service by slug
    SELECT s.* INTO v_service_record
    FROM public.services s
    WHERE s.slug = p_slug
    LIMIT 1;
    
    -- If no service found, return empty
    IF v_service_record.id IS NULL THEN
        RETURN;
    END IF;
    
    -- Return the service with translations
    RETURN QUERY
    SELECT 
        v_service_record.id,
        v_service_record.slug,
        v_service_record.category_id,
        v_service_record.emoji,
        v_service_record.display_order,
        v_service_record.created_at,
        v_service_record.updated_at,
        COALESCE(
            (SELECT st.title FROM public.service_translations st 
             WHERE st.service_id = v_service_record.id AND st.language_id = v_language_id),
            (SELECT st.title FROM public.service_translations st 
             WHERE st.service_id = v_service_record.id AND st.language_id = v_default_language_id),
            v_service_record.slug
        ) as title,
        COALESCE(
            (SELECT st.short_description FROM public.service_translations st 
             WHERE st.service_id = v_service_record.id AND st.language_id = v_language_id),
            (SELECT st.short_description FROM public.service_translations st 
             WHERE st.service_id = v_service_record.id AND st.language_id = v_default_language_id),
            ''
        ) as short_description,
        COALESCE(
            (SELECT st.long_description FROM public.service_translations st 
             WHERE st.service_id = v_service_record.id AND st.language_id = v_language_id),
            (SELECT st.long_description FROM public.service_translations st 
             WHERE st.service_id = v_service_record.id AND st.language_id = v_default_language_id),
            ''
        ) as long_description;
END;
$function$