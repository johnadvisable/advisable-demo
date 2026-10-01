-- Drop and recreate get_service_by_slug_simple to include icon_name
DROP FUNCTION IF EXISTS public.get_service_by_slug_simple(text, text);

CREATE OR REPLACE FUNCTION public.get_service_by_slug_simple(p_slug text, p_language_code text DEFAULT 'en')
RETURNS TABLE(
  id uuid,
  category_id uuid,
  title text,
  slug text,
  emoji text,
  icon_name varchar,
  short_description text,
  long_description text,
  display_order integer
) 
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_language_id integer;
BEGIN
  -- Get language ID
  SELECT l.id INTO v_language_id FROM languages l WHERE l.code = p_language_code;
  IF v_language_id IS NULL THEN
    SELECT l.id INTO v_language_id FROM languages l WHERE l.code = 'en';
  END IF;

  RETURN QUERY
  SELECT 
    s.id,
    s.category_id,
    COALESCE(st.title, s.title) as title,
    s.slug,
    s.emoji,
    s.icon_name,
    COALESCE(st.short_description, s.short_description) as short_description,
    COALESCE(st.long_description, s.long_description) as long_description,
    s.display_order
  FROM services s
  LEFT JOIN service_translations st ON st.service_id = s.id AND st.language_id = v_language_id
  WHERE s.slug = p_slug;
END;
$$;

-- Drop and recreate get_services_by_category_simple to include icon_name
DROP FUNCTION IF EXISTS public.get_services_by_category_simple(text, text);

CREATE OR REPLACE FUNCTION public.get_services_by_category_simple(p_category_slug text, p_language_code text DEFAULT 'en')
RETURNS TABLE(
  id uuid,
  category_id uuid,
  title text,
  slug text,
  emoji text,
  icon_name varchar,
  short_description text,
  long_description text,
  display_order integer
)
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_language_id integer;
  v_category_id uuid;
BEGIN
  -- Get language ID
  SELECT l.id INTO v_language_id FROM languages l WHERE l.code = p_language_code;
  IF v_language_id IS NULL THEN
    SELECT l.id INTO v_language_id FROM languages l WHERE l.code = 'en';
  END IF;

  -- Get category ID
  SELECT sc.id INTO v_category_id FROM service_categories sc WHERE sc.slug = p_category_slug;
  IF v_category_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    s.id,
    s.category_id,
    COALESCE(st.title, s.title) as title,
    s.slug,
    s.emoji,
    s.icon_name,
    COALESCE(st.short_description, s.short_description) as short_description,
    COALESCE(st.long_description, s.long_description) as long_description,
    s.display_order
  FROM services s
  LEFT JOIN service_translations st ON st.service_id = s.id AND st.language_id = v_language_id
  WHERE s.category_id = v_category_id
  ORDER BY s.display_order ASC;
END;
$$;