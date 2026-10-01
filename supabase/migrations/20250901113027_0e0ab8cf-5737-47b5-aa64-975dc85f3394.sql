-- Step 3: Final security fixes - update ALL remaining functions with search_path

-- These are the remaining functions that need search_path fixes
CREATE OR REPLACE FUNCTION public.get_all_services_with_translation_enhanced(p_language_code character varying)
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

CREATE OR REPLACE FUNCTION public.get_all_partners_with_translation_enhanced(p_language_code character varying)
RETURNS TABLE(id uuid, name text, description text, long_description text, use_case text, logo text, category text, has_detail_page boolean, featured boolean, benefits text[], integration_steps text[], contact_person text, partnership_type text, display_order integer)
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
    p.id,
    COALESCE(
      (SELECT pt.name FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.name FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_default_language_id),
      'Unnamed Partner'
    ) AS name,
    COALESCE(
      (SELECT pt.description FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.description FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_default_language_id),
      ''
    ) AS description,
    COALESCE(
      (SELECT pt.long_description FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.long_description FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_default_language_id),
      ''
    ) AS long_description,
    COALESCE(
      (SELECT pt.use_case FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.use_case FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_default_language_id),
      ''
    ) AS use_case,
    p.logo,
    p.category,
    p.has_detail_page,
    p.featured,
    p.benefits,
    p.integration_steps,
    p.contact_person,
    p.partnership_type,
    p.display_order
  FROM public.partners p
  ORDER BY p.display_order, (
    SELECT pt.name FROM public.partner_translations pt 
    WHERE pt.partner_id = p.id AND pt.language_id = v_language_id
    LIMIT 1
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_service_by_slug_safe(p_slug text, p_language_code text)
RETURNS TABLE(id uuid, category_id uuid, slug text, emoji text, display_order integer, title text, short_description text, long_description text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
  v_service_exists BOOLEAN;
BEGIN
  -- Check if service exists
  SELECT EXISTS(SELECT 1 FROM public.services WHERE services.slug = p_slug) INTO v_service_exists;
  
  IF NOT v_service_exists THEN
    RETURN;
  END IF;
  
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
  WHERE s.slug = p_slug;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS TABLE(total_clients bigint, total_services bigint, total_products bigint, total_partners bigint, total_blog_posts bigint, total_news_items bigint, total_team_members bigint, total_credentials bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow admins to access this function
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.clients) as total_clients,
    (SELECT COUNT(*) FROM public.services) as total_services,
    (SELECT COUNT(*) FROM public.products) as total_products,
    (SELECT COUNT(*) FROM public.partners) as total_partners,
    (SELECT COUNT(*) FROM public.blog_posts) as total_blog_posts,
    (SELECT COUNT(*) FROM public.news_items) as total_news_items,
    (SELECT COUNT(*) FROM public.team_members) as total_team_members,
    (SELECT COUNT(*) FROM public.credentials) as total_credentials;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_all_company_facts_with_translation(p_language_code character varying)
RETURNS TABLE(id uuid, key text, value text, icon_name text, display_order integer, label text, description text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_language_id INTEGER;
BEGIN
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  RETURN QUERY
  SELECT 
    cf.id,
    cf.key,
    cf.value,
    cf.icon_name,
    cf.display_order,
    COALESCE(cft.label, cf.key) as label,
    COALESCE(cft.description, '') as description
  FROM public.company_facts cf
  LEFT JOIN public.company_fact_translations cft ON cf.id = cft.company_fact_id AND cft.language_id = v_language_id
  ORDER BY cf.display_order;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_client_with_translation(p_client_id uuid, p_language_code character varying)
RETURNS TABLE(id uuid, name text, logo text, description text, testimonial text, background_image text, website text, featured boolean, product_category text, product_categories text[], case_study_challenge text, case_study_solution text, case_study_team_size text, case_study_timeline text, case_study_images jsonb, case_study_videos jsonb, case_study_results jsonb, industry text, country text, display_order integer)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_language_id INTEGER;
BEGIN
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
    c.case_study_images,
    c.case_study_videos,
    c.case_study_results,
    c.industry,
    c.country,
    c.display_order
  FROM public.clients c
  LEFT JOIN public.clients_translations ct ON c.id = ct.client_id AND ct.language_id = v_language_id
  WHERE c.id = p_client_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_partner_with_translation(p_partner_id uuid, p_language_code character varying)
RETURNS TABLE(id uuid, name text, description text, long_description text, use_case text, logo text, category text, has_detail_page boolean, featured boolean, benefits text[], integration_steps text[], contact_person text, partnership_type text, display_order integer)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_language_id INTEGER;
BEGIN
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  RETURN QUERY
  SELECT 
    p.id,
    COALESCE(pt.name, 'Unnamed Partner') AS name,
    COALESCE(pt.description, '') AS description,
    COALESCE(pt.long_description, '') AS long_description,
    COALESCE(pt.use_case, '') AS use_case,
    p.logo,
    p.category,
    p.has_detail_page,
    p.featured,
    p.benefits,
    p.integration_steps,
    p.contact_person,
    p.partnership_type,
    p.display_order
  FROM public.partners p
  LEFT JOIN public.partner_translations pt ON p.id = pt.partner_id AND pt.language_id = v_language_id
  WHERE p.id = p_partner_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_all_partners_with_translation(p_language_code character varying)
RETURNS TABLE(id uuid, name text, description text, long_description text, use_case text, logo text, category text, has_detail_page boolean, featured boolean, benefits text[], integration_steps text[], contact_person text, partnership_type text, display_order integer)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_language_id INTEGER;
BEGIN
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  RETURN QUERY
  SELECT 
    p.id,
    COALESCE(pt.name, 'Unnamed Partner') AS name,
    COALESCE(pt.description, '') AS description,
    COALESCE(pt.long_description, '') AS long_description,
    COALESCE(pt.use_case, '') AS use_case,
    p.logo,
    p.category,
    p.has_detail_page,
    p.featured,
    p.benefits,
    p.integration_steps,
    p.contact_person,
    p.partnership_type,
    p.display_order
  FROM public.partners p
  LEFT JOIN public.partner_translations pt ON p.id = pt.partner_id AND pt.language_id = v_language_id
  ORDER BY p.display_order, pt.name;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_service_category_by_slug_safe(p_slug text, p_language_code text)
RETURNS TABLE(id uuid, slug text, name text, description text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_language_id INTEGER;
    v_category_exists BOOLEAN;
BEGIN
    -- Check if category exists
    SELECT EXISTS(SELECT 1 FROM public.service_categories WHERE service_categories.slug = p_slug) INTO v_category_exists;
    
    IF NOT v_category_exists THEN
        RETURN;
    END IF;
    
    -- Get the language ID
    SELECT l.id INTO v_language_id 
    FROM public.languages l
    WHERE l.code = p_language_code;
    
    -- Return the category with translations
    RETURN QUERY
    SELECT 
        sc.id,
        sc.slug,
        COALESCE(sct.name, 'Unnamed Category') as name,
        COALESCE(sct.description, '') as description
    FROM public.service_categories sc
    LEFT JOIN public.service_category_translations sct ON sc.id = sct.category_id AND sct.language_id = v_language_id
    WHERE sc.slug = p_slug;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_client_display_orders(client_updates jsonb)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    client_update jsonb;
    update_count integer := 0;
BEGIN
    -- Only admins can update client orders
    IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
        RETURN QUERY SELECT false::boolean, 'Access denied. Admin privileges required.'::text;
        RETURN;
    END IF;
    
    -- Validate input
    IF client_updates IS NULL OR jsonb_array_length(client_updates) = 0 THEN
        RETURN QUERY SELECT false::boolean, 'No client updates provided.'::text;
        RETURN;
    END IF;
    
    -- Process each client update
    FOR client_update IN SELECT * FROM jsonb_array_elements(client_updates) LOOP
        -- Validate required fields
        IF NOT (client_update ? 'id' AND client_update ? 'display_order') THEN
            CONTINUE;
        END IF;
        
        -- Update the client display order
        UPDATE public.clients 
        SET display_order = (client_update->>'display_order')::integer,
            updated_at = NOW()
        WHERE id = (client_update->>'id')::uuid;
        
        -- Check if update was successful
        IF FOUND THEN
            update_count := update_count + 1;
        END IF;
    END LOOP;
    
    -- Return success with count
    RETURN QUERY SELECT true::boolean, 
        ('Updated display order for ' || update_count::text || ' clients.')::text;
END;
$$;