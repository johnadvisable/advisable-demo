-- Fix all database function security issues and create missing translation function
-- Update all existing functions to have secure search_path

-- Fix search_path for existing functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS app_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.is_admin_user()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
$function$;

-- Create the missing get_translation function that useTranslatedContent is trying to call
CREATE OR REPLACE FUNCTION public.get_translation(
  p_table_name text,
  p_record_id text,
  p_field_name text,
  p_language_code text
)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result text;
BEGIN
  -- Check if we have a specific translation table for this entity type
  CASE p_table_name
    WHEN 'products' THEN
      SELECT CASE p_field_name
        WHEN 'title' THEN pt.title
        WHEN 'description' THEN pt.description
        WHEN 'page_title' THEN pt.page_title
        WHEN 'page_subtitle' THEN pt.page_subtitle
        WHEN 'page_description' THEN pt.page_description
        WHEN 'cta_section_title' THEN pt.cta_section_title
        WHEN 'cta_section_description' THEN pt.cta_section_description
        WHEN 'cta_button_text' THEN pt.cta_button_text
        ELSE NULL
      END INTO result
      FROM public.product_translations pt
      JOIN public.languages l ON pt.language_id = l.id
      WHERE pt.product_id = p_record_id::uuid 
        AND l.code = p_language_code;
    
    WHEN 'clients' THEN
      SELECT CASE p_field_name
        WHEN 'name' THEN ct.name
        WHEN 'description' THEN ct.description
        WHEN 'testimonial' THEN ct.testimonial
        WHEN 'case_study_challenge' THEN ct.case_study_challenge
        WHEN 'case_study_solution' THEN ct.case_study_solution
        ELSE NULL
      END INTO result
      FROM public.clients_translations ct
      JOIN public.languages l ON ct.language_id = l.id
      WHERE ct.client_id = p_record_id::uuid 
        AND l.code = p_language_code;
    
    WHEN 'services' THEN
      SELECT CASE p_field_name
        WHEN 'title' THEN st.title
        WHEN 'short_description' THEN st.short_description
        WHEN 'long_description' THEN st.long_description
        ELSE NULL
      END INTO result
      FROM public.service_translations st
      JOIN public.languages l ON st.language_id = l.id
      WHERE st.service_id = p_record_id::uuid 
        AND l.code = p_language_code;
    
    WHEN 'partners' THEN
      SELECT CASE p_field_name
        WHEN 'name' THEN pt.name
        WHEN 'description' THEN pt.description
        WHEN 'long_description' THEN pt.long_description
        WHEN 'use_case' THEN pt.use_case
        ELSE NULL
      END INTO result
      FROM public.partner_translations pt
      JOIN public.languages l ON pt.language_id = l.id
      WHERE pt.partner_id = p_record_id::uuid 
        AND l.code = p_language_code;
    
    WHEN 'news_items' THEN
      SELECT CASE p_field_name
        WHEN 'title' THEN nt.title
        WHEN 'excerpt' THEN nt.excerpt
        WHEN 'content' THEN nt.content
        ELSE NULL
      END INTO result
      FROM public.news_item_translations nt
      JOIN public.languages l ON nt.language_id = l.id
      WHERE nt.news_item_id = p_record_id::uuid 
        AND l.code = p_language_code;
    
    ELSE
      -- Fall back to generic translations table for other cases
      SELECT content INTO result
      FROM public.translations
      WHERE table_name = p_table_name
        AND record_id = p_record_id
        AND field_name = p_field_name
        AND language_code = p_language_code;
  END CASE;
  
  RETURN result;
END;
$function$;

-- Create indexes for better performance on translation lookups
CREATE INDEX IF NOT EXISTS idx_product_translations_lookup ON public.product_translations(product_id, language_id);
CREATE INDEX IF NOT EXISTS idx_client_translations_lookup ON public.clients_translations(client_id, language_id);
CREATE INDEX IF NOT EXISTS idx_service_translations_lookup ON public.service_translations(service_id, language_id);
CREATE INDEX IF NOT EXISTS idx_partner_translations_lookup ON public.partner_translations(partner_id, language_id);
CREATE INDEX IF NOT EXISTS idx_news_translations_lookup ON public.news_item_translations(news_item_id, language_id);
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON public.translations(table_name, record_id, field_name, language_code);

-- Create a function to get language ID by code for better performance
CREATE OR REPLACE FUNCTION public.get_language_id(language_code text)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT id FROM public.languages WHERE code = language_code LIMIT 1;
$function$;