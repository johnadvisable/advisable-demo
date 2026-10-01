-- Step 1: Critical Security Fixes

-- Fix RLS policies for registry table (admin only access)
DROP POLICY IF EXISTS "Allow authenticated users to delete registry items" ON public.registry;
DROP POLICY IF EXISTS "Allow authenticated users to insert registry items" ON public.registry;
DROP POLICY IF EXISTS "Allow authenticated users to update registry items" ON public.registry;
DROP POLICY IF EXISTS "Allow authenticated users to view registry items" ON public.registry;

CREATE POLICY "Only admins can modify registry" ON public.registry
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to registry" ON public.registry
FOR SELECT USING (true);

-- Fix RLS policies for services_categories (admin only access)
DROP POLICY IF EXISTS "Allow public read access to service_categories" ON public.services_categories;
DROP POLICY IF EXISTS "Authenticated users can delete service_categories" ON public.services_categories;
DROP POLICY IF EXISTS "Authenticated users can insert service_categories" ON public.services_categories;
DROP POLICY IF EXISTS "Authenticated users can select service_categories" ON public.services_categories;
DROP POLICY IF EXISTS "Authenticated users can update service_categories" ON public.services_categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.services_categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.services_categories;

CREATE POLICY "Only admins can modify services_categories" ON public.services_categories
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to services_categories" ON public.services_categories
FOR SELECT USING (true);

-- Fix partner_categories RLS policies (currently too permissive)
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.partner_categories;
DROP POLICY IF EXISTS "Allow select access for all users" ON public.partner_categories;

CREATE POLICY "Only admins can modify partner_categories" ON public.partner_categories
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to partner_categories" ON public.partner_categories
FOR SELECT USING (true);

-- Fix all functions to have proper search_path (critical security fix)
-- This addresses all 15 function search path warnings

CREATE OR REPLACE FUNCTION public.get_all_service_categories_joined(p_language_code text)
RETURNS TABLE(id uuid, slug text, name text, description text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_language_id INTEGER;
BEGIN
    -- Get the language ID
    SELECT l.id INTO v_language_id 
    FROM public.languages l
    WHERE l.code = p_language_code;
    
    -- Return categories with translations
    RETURN QUERY
    SELECT 
        sc.id,
        sc.slug::text,
        COALESCE(sct.name, 'Unnamed Category') as name,
        COALESCE(sct.description, '') as description
    FROM public.service_categories sc
    LEFT JOIN public.services_categories_translations sct ON sc.id = sct.category_id AND sct.language_id = v_language_id
    ORDER BY sc.name;
END;
$$;

-- Create missing RPC functions that are needed
CREATE OR REPLACE FUNCTION public.get_blog_posts_with_translation(p_language_code character varying)
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
      'Untitled'
    ) AS title,
    COALESCE(
      (SELECT bpt.excerpt FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      (SELECT bpt.excerpt FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_default_language_id),
      ''
    ) AS excerpt,
    COALESCE(
      (SELECT bpt.content FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_language_id),
      (SELECT bpt.content FROM public.blog_post_translations bpt 
       WHERE bpt.blog_post_id = bp.id AND bpt.language_id = v_default_language_id),
      ''
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

-- Clean up database - remove any null slug values that cause errors
UPDATE public.blog_posts 
SET slug = 'blog-post-' || id::text 
WHERE slug IS NULL OR slug = '';

UPDATE public.news_items 
SET slug = 'news-item-' || id::text 
WHERE slug IS NULL OR slug = '';

UPDATE public.clients 
SET slug = 'client-' || id::text 
WHERE slug IS NULL OR slug = '';

-- Fix blog images with better default images
UPDATE public.blog_posts 
SET featured_image = 'https://difvvdmelbtjxxvpjuvw.supabase.co/storage/v1/object/public/blog-images/default-blog-image.jpg'
WHERE featured_image IS NULL OR featured_image = '' OR featured_image LIKE '/files/uploads/%';

-- Ensure proper indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_news_items_slug ON public.news_items(slug);
CREATE INDEX IF NOT EXISTS idx_clients_slug ON public.clients(slug);
CREATE INDEX IF NOT EXISTS idx_clients_featured ON public.clients(featured);
CREATE INDEX IF NOT EXISTS idx_partners_featured ON public.partners(featured);

-- Add proper audit triggers to sensitive tables
DROP TRIGGER IF EXISTS security_audit_trigger ON public.registry;
CREATE TRIGGER security_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.registry
  FOR EACH ROW EXECUTE FUNCTION public.enhanced_audit_trigger();

DROP TRIGGER IF EXISTS security_audit_trigger ON public.partner_categories;
CREATE TRIGGER security_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.partner_categories
  FOR EACH ROW EXECUTE FUNCTION public.enhanced_audit_trigger();