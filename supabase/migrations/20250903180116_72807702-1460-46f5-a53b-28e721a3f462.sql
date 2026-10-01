-- Drop existing problematic functions
DROP FUNCTION IF EXISTS public.get_service_by_slug_simple(text, text);
DROP FUNCTION IF EXISTS public.get_service_category_by_slug_simple(text, text);
DROP FUNCTION IF EXISTS public.get_services_by_category_simple(text, text);

-- Create new service functions with correct types
CREATE OR REPLACE FUNCTION public.get_service_by_slug_simple(p_slug text, p_language_code text DEFAULT 'en')
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
AS $$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  -- Get language IDs
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
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
      s.slug
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
  WHERE s.slug = p_slug;
END;
$$;

-- Create category function
CREATE OR REPLACE FUNCTION public.get_service_category_by_slug_simple(p_slug text, p_language_code text DEFAULT 'en')
RETURNS TABLE(
  id uuid,
  slug text,
  name text,
  description text
) 
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  -- Get language IDs
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    sc.id,
    sc.slug::text,
    COALESCE(
      (SELECT sct.name FROM public.service_category_translations sct 
       WHERE sct.category_id = sc.id AND sct.language_id = v_language_id),
      (SELECT sct.name FROM public.service_category_translations sct 
       WHERE sct.category_id = sc.id AND sct.language_id = v_default_language_id),
      sc.name
    )::text AS name,
    COALESCE(
      (SELECT sct.description FROM public.service_category_translations sct 
       WHERE sct.category_id = sc.id AND sct.language_id = v_language_id),
      (SELECT sct.description FROM public.service_category_translations sct 
       WHERE sct.category_id = sc.id AND sct.language_id = v_default_language_id),
      sc.description
    )::text AS description
  FROM public.service_categories sc
  WHERE sc.slug = p_slug;
END;
$$;

-- Create services by category function  
CREATE OR REPLACE FUNCTION public.get_services_by_category_simple(p_category_slug text, p_language_code text DEFAULT 'en')
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
AS $$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
  v_category_id UUID;
BEGIN
  -- Get language IDs
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  -- Get category ID
  SELECT sc.id INTO v_category_id
  FROM public.service_categories sc
  WHERE sc.slug = p_category_slug;
  
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
      s.slug
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
  WHERE s.category_id = v_category_id
  ORDER BY s.display_order, s.slug;
END;
$$;