-- Step 2: Fix remaining functions with search_path issues (Security Critical)

-- Update all existing functions to have proper search_path settings
-- This will fix the remaining 15+ security warnings

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.setup_initial_admin(admin_email text, admin_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    admin_user_id uuid;
    existing_admins int;
BEGIN
    -- Check if any admins already exist
    SELECT COUNT(*) INTO existing_admins
    FROM public.user_roles
    WHERE role = 'admin'::app_role;
    
    -- Only allow if no admins exist
    IF existing_admins > 0 THEN
        RAISE EXCEPTION 'Admin users already exist. Cannot create initial admin.';
    END IF;
    
    -- This would need to be called during initial setup
    -- The actual user creation should be done through Supabase Auth
    RAISE NOTICE 'Use Supabase Auth to create admin user with email: %', admin_email;
    
    RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  );
$$;

CREATE OR REPLACE FUNCTION public.get_all_products_with_translation(p_language_code character varying)
RETURNS TABLE(id uuid, title text, description text, image_url text, hero_image text, website_url text, display_order integer, slug text, page_title text, page_subtitle text, page_description text, page_background_color text, highlight_color text, features jsonb, stats jsonb, testimonials jsonb, cta_section_title text, cta_section_description text, cta_button_text text)
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
      (SELECT pt.title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS title,
    COALESCE(
      (SELECT pt.description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS description,
    p.image_url,
    p.hero_image,
    p.website_url,
    p.display_order,
    p.slug,
    COALESCE(
      (SELECT pt.page_title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS page_title,
    COALESCE(
      (SELECT pt.page_subtitle FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS page_subtitle,
    COALESCE(
      (SELECT pt.page_description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS page_description,
    p.page_background_color,
    p.highlight_color,
    p.features,
    p.stats,
    p.testimonials,
    COALESCE(
      (SELECT pt.cta_section_title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS cta_section_title,
    COALESCE(
      (SELECT pt.cta_section_description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS cta_section_description,
    COALESCE(
      (SELECT pt.cta_button_text FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS cta_button_text
  FROM public.products p
  ORDER BY p.display_order;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_static_page_with_translation(p_slug text, p_language_code text)
RETURNS TABLE(id uuid, slug text, page_type text, is_published boolean, title text, content text, meta_title text, meta_description text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.get_all_credentials_with_translation(p_language_code character varying)
RETURNS TABLE(id uuid, title text, description text, icon_name text, image_url text, display_order integer)
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
    c.id,
    COALESCE(
      (SELECT ct.title FROM public.credential_translations ct 
       WHERE ct.credential_id = c.id AND ct.language_id = v_language_id),
      (SELECT ct.title FROM public.credential_translations ct 
       WHERE ct.credential_id = c.id AND ct.language_id = v_default_language_id),
      ''
    ) AS title,
    COALESCE(
      (SELECT ct.description FROM public.credential_translations ct 
       WHERE ct.credential_id = c.id AND ct.language_id = v_language_id),
      (SELECT ct.description FROM public.credential_translations ct 
       WHERE ct.credential_id = c.id AND ct.language_id = v_default_language_id),
      ''
    ) AS description,
    c.icon_name,
    c.image_url,
    c.display_order
  FROM public.credentials c
  ORDER BY c.display_order ASC, c.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_contact_info_with_translation(p_language_code text)
RETURNS TABLE(id uuid, info_type text, is_primary boolean, display_order integer, label text, value text, address text, description text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.get_language_id(language_code text)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id FROM public.languages WHERE code = language_code LIMIT 1;
$$;

-- Create blog translation table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.blog_post_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id uuid NOT NULL,
  language_id integer NOT NULL,
  title text,
  excerpt text,
  content text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(blog_post_id, language_id)
);

-- Enable RLS on blog_post_translations
ALTER TABLE public.blog_post_translations ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for blog_post_translations
CREATE POLICY "Public read access to blog_post_translations" ON public.blog_post_translations
FOR SELECT USING (true);

CREATE POLICY "Only admins can modify blog_post_translations" ON public.blog_post_translations
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));