-- Step 4: Fix missing blog RPC functions and complete remaining security fixes

-- Create the missing RPC functions that are used by the frontend
CREATE OR REPLACE FUNCTION public.get_all_blog_posts_with_translation(p_language_code character varying)
RETURNS TABLE(
    id uuid, 
    title text, 
    excerpt text, 
    content text, 
    slug text, 
    author text, 
    category text, 
    featured_image text, 
    published_date timestamp with time zone
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
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
    bp.id,
    COALESCE(
      (SELECT bpt.title FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      (SELECT bpt.title FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_default_language_id),
      'Blog Post ' || bp.id::text
    ) AS title,
    COALESCE(
      (SELECT bpt.excerpt FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      (SELECT bpt.excerpt FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_default_language_id),
      'Sample excerpt for ' || bp.slug
    ) AS excerpt,
    COALESCE(
      (SELECT bpt.content FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      (SELECT bpt.content FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_default_language_id),
      'Sample content for ' || bp.slug
    ) AS content,
    bp.slug,
    bp.author,
    bp.category,
    bp.featured_image,
    bp.published_date
  FROM public.blog_posts bp
  ORDER BY bp.published_date DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_blog_post_with_translation(p_post_id uuid, p_language_code character varying)
RETURNS TABLE(
    id uuid, 
    title text, 
    excerpt text, 
    content text, 
    slug text, 
    author text, 
    category text, 
    featured_image text, 
    published_date timestamp with time zone
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
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
    bp.id,
    COALESCE(
      (SELECT bpt.title FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      (SELECT bpt.title FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_default_language_id),
      'Blog Post ' || bp.id::text
    ) AS title,
    COALESCE(
      (SELECT bpt.excerpt FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      (SELECT bpt.excerpt FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_default_language_id),
      'Sample excerpt for ' || bp.slug
    ) AS excerpt,
    COALESCE(
      (SELECT bpt.content FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      (SELECT bpt.content FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_default_language_id),
      'Sample content for ' || bp.slug
    ) AS content,
    bp.slug,
    bp.author,
    bp.category,
    bp.featured_image,
    bp.published_date
  FROM public.blog_posts bp
  WHERE bp.id = p_post_id;
END;
$$;

-- Fix remaining functions that need search_path
CREATE OR REPLACE FUNCTION public.get_all_clients_with_translation(p_language_code character varying)
RETURNS TABLE(id uuid, name text, logo text, description text, testimonial text, background_image text, website text, featured boolean, product_category text, product_categories text[], case_study_challenge text, case_study_solution text, case_study_team_size text, case_study_timeline text, case_study_images jsonb, case_study_videos jsonb, case_study_results jsonb, industry text, country text, display_order integer, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_language_id INTEGER;
BEGIN
  -- Get language ID
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  RETURN QUERY
  SELECT 
    c.id,
    COALESCE(ct.name, 'Unnamed Client') AS name,
    c.logo,
    COALESCE(ct.description, '') AS description,
    COALESCE(ct.testimonial, '') AS testimonial,
    c.background_image,
    c.website,
    c.featured,
    c.product_category,
    get_client_categories(c.id) AS product_categories,
    COALESCE(ct.case_study_challenge, '') AS case_study_challenge,
    COALESCE(ct.case_study_solution, '') AS case_study_solution,
    c.case_study_team_size,
    c.case_study_timeline,
    COALESCE(c.case_study_images, '[]'::jsonb) AS case_study_images,
    COALESCE(c.case_study_videos, '[]'::jsonb) AS case_study_videos,
    COALESCE(c.case_study_results, '[]'::jsonb) AS case_study_results,
    c.industry,
    c.country,
    COALESCE(c.display_order, 0) AS display_order,
    c.created_at,
    c.updated_at
  FROM public.clients c
  LEFT JOIN public.clients_translations ct ON c.id = ct.client_id AND ct.language_id = v_language_id
  ORDER BY c.display_order ASC NULLS LAST, ct.name ASC NULLS LAST;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_client_categories()
RETURNS text[]
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  category_order TEXT[] := ARRAY[
    'Venture Studio Services',
    'Digital Agency Services', 
    'Ecommercen',
    'Market Data',
    'ePrescription Cloud ERP',
    'Advisable AI'
  ];
  db_categories TEXT[];
  sorted_categories TEXT[];
BEGIN
  -- Get unique categories from database
  SELECT ARRAY_AGG(DISTINCT category ORDER BY category)
  INTO db_categories
  FROM client_categories;
  
  -- Filter and sort categories according to the specified order
  SELECT ARRAY_AGG(category)
  INTO sorted_categories
  FROM unnest(category_order) AS category
  WHERE category = ANY(COALESCE(db_categories, ARRAY[]::TEXT[]));
  
  RETURN COALESCE(sorted_categories, ARRAY[]::TEXT[]);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_all_services_with_translation(p_language_code character varying)
RETURNS TABLE(id uuid, category_id uuid, slug text, emoji text, display_order integer, title text, short_description text, long_description text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
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
    s.id,
    s.category_id,
    s.slug,
    s.emoji,
    s.display_order,
    COALESCE(
      (SELECT st.title FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.title FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS title,
    COALESCE(
      (SELECT st.short_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.short_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS short_description,
    COALESCE(
      (SELECT st.long_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.long_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS long_description
  FROM public.services s
  ORDER BY s.display_order;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_service_with_translation(p_service_id uuid, p_language_code text)
RETURNS TABLE(id uuid, category_id uuid, slug text, emoji text, display_order integer, title text, short_description text, long_description text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
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
    s.id,
    s.category_id,
    s.slug,
    s.emoji,
    s.display_order,
    COALESCE(
      (SELECT st.title FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.title FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS title,
    COALESCE(
      (SELECT st.short_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.short_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS short_description,
    COALESCE(
      (SELECT st.long_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.long_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS long_description
  FROM public.services s
  WHERE s.id = p_service_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_product_with_translation(p_product_id uuid, p_language_code character varying)
RETURNS TABLE(id uuid, title text, description text, page_title text, page_subtitle text, page_description text, cta_section_title text, cta_section_description text, cta_button_text text, slug text, website_url text, display_order integer, image_url text, hero_image text, page_background_color text, highlight_color text, features jsonb, stats jsonb, testimonials jsonb)
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