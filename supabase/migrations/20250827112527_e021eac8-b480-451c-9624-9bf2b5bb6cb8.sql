-- Fix the get_all_products_with_translation function with ambiguous column reference
DROP FUNCTION IF EXISTS public.get_all_products_with_translation(character varying);

CREATE OR REPLACE FUNCTION public.get_all_products_with_translation(p_language_code character varying)
RETURNS TABLE(
  id uuid, 
  title text, 
  description text, 
  image_url text, 
  hero_image text, 
  website_url text, 
  display_order integer, 
  slug text, 
  page_title text, 
  page_subtitle text, 
  page_description text, 
  page_background_color text, 
  highlight_color text, 
  features jsonb, 
  stats jsonb, 
  testimonials jsonb, 
  cta_section_title text, 
  cta_section_description text, 
  cta_button_text text
)
LANGUAGE plpgsql
AS $function$
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
      p.title
    ) AS title,
    COALESCE(
      (SELECT pt.description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      p.description
    ) AS description,
    p.image_url,
    p.hero_image,
    p.website_url,
    p.display_order,
    p.slug,
    COALESCE(
      (SELECT pt.page_title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      p.page_title
    ) AS page_title,
    COALESCE(
      (SELECT pt.page_subtitle FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      p.page_subtitle
    ) AS page_subtitle,
    COALESCE(
      (SELECT pt.page_description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      p.page_description
    ) AS page_description,
    p.page_background_color,
    p.highlight_color,
    p.features,
    p.stats,
    p.testimonials,
    COALESCE(
      (SELECT pt.cta_section_title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      p.cta_section_title
    ) AS cta_section_title,
    COALESCE(
      (SELECT pt.cta_section_description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      p.cta_section_description
    ) AS cta_section_description,
    COALESCE(
      (SELECT pt.cta_button_text FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      p.cta_button_text
    ) AS cta_button_text
  FROM public.products p
  ORDER BY p.display_order;
END;
$function$;