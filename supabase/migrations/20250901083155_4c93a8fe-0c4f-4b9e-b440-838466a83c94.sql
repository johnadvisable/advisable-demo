-- Fix all function search_path security issues by adding SET search_path TO 'public'
-- This prevents SQL injection vulnerabilities in database functions

-- Fix existing functions with proper search_path
ALTER FUNCTION public.get_current_user_role() SET search_path TO 'public';
ALTER FUNCTION public.get_hero_content_by_page_with_translation(text, text) SET search_path TO 'public';
ALTER FUNCTION public.setup_initial_admin(text, text) SET search_path TO 'public';
ALTER FUNCTION public.security_monitor_trigger() SET search_path TO 'public';
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path TO 'public';
ALTER FUNCTION public.create_initial_admin_role(uuid) SET search_path TO 'public';
ALTER FUNCTION public.validate_password_strength(text) SET search_path TO 'public';
ALTER FUNCTION public.validate_user_password() SET search_path TO 'public';
ALTER FUNCTION public.enhanced_audit_trigger() SET search_path TO 'public';
ALTER FUNCTION public.is_admin_user() SET search_path TO 'public';
ALTER FUNCTION public.user_has_permission(text) SET search_path TO 'public';
ALTER FUNCTION public.get_all_products_with_translation(character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_static_page_with_translation(text, text) SET search_path TO 'public';
ALTER FUNCTION public.get_all_credentials_with_translation(character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_contact_info_with_translation(text) SET search_path TO 'public';
ALTER FUNCTION public.get_all_team_members_admin(character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_all_team_members_public_safe(character varying) SET search_path TO 'public';
ALTER FUNCTION public.audit_trigger_function() SET search_path TO 'public';
ALTER FUNCTION public.get_partner_categories(text) SET search_path TO 'public';
ALTER FUNCTION public.get_client_categories(uuid) SET search_path TO 'public';
ALTER FUNCTION public.check_auth_rate_limit(inet) SET search_path TO 'public';
ALTER FUNCTION public.get_all_services_with_translation_enhanced(character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_all_partners_with_translation_enhanced(character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_service_by_slug_safe(text, text) SET search_path TO 'public';
ALTER FUNCTION public.get_all_news_items_with_translation(character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_admin_dashboard_stats() SET search_path TO 'public';
ALTER FUNCTION public.get_news_item_with_translation(uuid, character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_all_company_facts_with_translation(character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_client_with_translation(uuid, character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_partner_with_translation(uuid, character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_all_partners_with_translation(character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_service_category_by_slug_safe(text, text) SET search_path TO 'public';
ALTER FUNCTION public.update_client_display_orders(jsonb) SET search_path TO 'public';
ALTER FUNCTION public.get_all_clients_with_translation(character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_client_categories() SET search_path TO 'public';
ALTER FUNCTION public.get_all_services_with_translation(character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_service_with_translation(uuid, text) SET search_path TO 'public';
ALTER FUNCTION public.get_all_company_values_with_translation(character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_company_value_with_translation(uuid, character varying) SET search_path TO 'public';
ALTER FUNCTION public.get_all_metrics_with_translation(character varying) SET search_path TO 'public';

-- Create missing get_product_with_translation function with proper security
CREATE OR REPLACE FUNCTION public.get_product_with_translation(
    p_product_id uuid,
    p_language_code character varying
)
RETURNS TABLE(
    id uuid,
    title text,
    description text,
    page_title text,
    page_subtitle text,
    page_description text,
    cta_section_title text,
    cta_section_description text,
    cta_button_text text,
    slug text,
    website_url text,
    display_order integer,
    image_url text,
    hero_image text,
    page_background_color text,
    highlight_color text,
    features jsonb,
    stats jsonb,
    testimonials jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_language_id INTEGER;
    v_default_language_id INTEGER;
BEGIN
    -- Get language ID
    SELECT l.id INTO v_language_id 
    FROM public.languages l
    WHERE l.code = p_language_code;
    
    -- Get default language ID
    SELECT l.id INTO v_default_language_id 
    FROM public.languages l
    WHERE l.is_default = TRUE 
    LIMIT 1;
    
    RETURN QUERY
    SELECT 
        p.id,
        COALESCE(
            (SELECT pt.title FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
            (SELECT pt.title FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
            ''
        ) AS title,
        COALESCE(
            (SELECT pt.description FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
            (SELECT pt.description FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
            ''
        ) AS description,
        COALESCE(
            (SELECT pt.page_title FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
            (SELECT pt.page_title FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
            ''
        ) AS page_title,
        COALESCE(
            (SELECT pt.page_subtitle FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
            (SELECT pt.page_subtitle FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
            ''
        ) AS page_subtitle,
        COALESCE(
            (SELECT pt.page_description FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
            (SELECT pt.page_description FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
            ''
        ) AS page_description,
        COALESCE(
            (SELECT pt.cta_section_title FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
            (SELECT pt.cta_section_title FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
            ''
        ) AS cta_section_title,
        COALESCE(
            (SELECT pt.cta_section_description FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
            (SELECT pt.cta_section_description FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
            ''
        ) AS cta_section_description,
        COALESCE(
            (SELECT pt.cta_button_text FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
            (SELECT pt.cta_button_text FROM public.product_translations pt 
             WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
            ''
        ) AS cta_button_text,
        p.slug,
        p.website_url,
        p.display_order,
        p.image_url,
        p.hero_image,
        p.page_background_color,
        p.highlight_color,
        p.features,
        p.stats,
        p.testimonials
    FROM public.products p
    WHERE p.id = p_product_id;
END;
$$;