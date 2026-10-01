-- Fix security issues for the new functions by setting search_path
CREATE OR REPLACE FUNCTION public.get_static_page_with_translation(p_slug text, p_language_code text)
RETURNS TABLE(
  id UUID,
  slug TEXT,
  page_type TEXT,
  is_published BOOLEAN,
  title TEXT,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_language_id INTEGER;
BEGIN
  -- Get language ID
  SELECT id INTO v_language_id 
  FROM public.languages 
  WHERE code = p_language_code;
  
  RETURN QUERY
  SELECT 
    sp.id,
    sp.slug,
    sp.page_type,
    sp.is_published,
    COALESCE(spt.title, '') as title,
    COALESCE(spt.content, '') as content,
    COALESCE(spt.meta_title, '') as meta_title,
    COALESCE(spt.meta_description, '') as meta_description
  FROM public.static_pages sp
  LEFT JOIN public.static_page_translations spt ON sp.id = spt.static_page_id AND spt.language_id = v_language_id
  WHERE sp.slug = p_slug AND sp.is_published = true;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_contact_info_with_translation(p_language_code text)
RETURNS TABLE(
  id UUID,
  info_type TEXT,
  is_primary BOOLEAN,
  display_order INTEGER,
  label TEXT,
  value TEXT,
  address TEXT,
  description TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_language_id INTEGER;
BEGIN
  -- Get language ID
  SELECT id INTO v_language_id 
  FROM public.languages 
  WHERE code = p_language_code;
  
  RETURN QUERY
  SELECT 
    ci.id,
    ci.info_type,
    ci.is_primary,
    ci.display_order,
    COALESCE(cit.label, '') as label,
    COALESCE(cit.value, '') as value,
    COALESCE(cit.address, '') as address,
    COALESCE(cit.description, '') as description
  FROM public.contact_info ci
  LEFT JOIN public.contact_info_translations cit ON ci.id = cit.contact_info_id AND cit.language_id = v_language_id
  ORDER BY ci.display_order;
END;
$$;