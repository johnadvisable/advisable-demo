-- Phase 1: Database Schema Updates

-- Static pages table for Privacy Policy, Terms, Cookie Policy, etc.
CREATE TABLE public.static_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  page_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0
);

-- Static pages translations
CREATE TABLE public.static_page_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  static_page_id UUID NOT NULL REFERENCES public.static_pages(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(static_page_id, language_id)
);

-- Site settings for global configuration
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Contact information table
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  info_type TEXT NOT NULL, -- 'office', 'phone', 'email', 'social'
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Contact info translations
CREATE TABLE public.contact_info_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_info_id UUID NOT NULL REFERENCES public.contact_info(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  label TEXT,
  value TEXT,
  address TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(contact_info_id, language_id)
);

-- Navigation menu items
CREATE TABLE public.navigation_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  menu_type TEXT NOT NULL DEFAULT 'header', -- 'header', 'footer', 'mobile'
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  target_blank BOOLEAN DEFAULT false,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Navigation items translations
CREATE TABLE public.navigation_item_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  navigation_item_id UUID NOT NULL REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  href TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(navigation_item_id, language_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.static_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.static_page_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_item_translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Static pages - public read, admin write
CREATE POLICY "Public read access to static_pages" ON public.static_pages FOR SELECT USING (true);
CREATE POLICY "Only admins can modify static_pages" ON public.static_pages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to static_page_translations" ON public.static_page_translations FOR SELECT USING (true);
CREATE POLICY "Only admins can modify static_page_translations" ON public.static_page_translations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Site settings - admin only
CREATE POLICY "Only admins can access site_settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Public read access to public site_settings" ON public.site_settings FOR SELECT USING (is_public = true);

-- Contact info - public read, admin write
CREATE POLICY "Public read access to contact_info" ON public.contact_info FOR SELECT USING (true);
CREATE POLICY "Only admins can modify contact_info" ON public.contact_info FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to contact_info_translations" ON public.contact_info_translations FOR SELECT USING (true);
CREATE POLICY "Only admins can modify contact_info_translations" ON public.contact_info_translations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Navigation items - public read, admin write
CREATE POLICY "Public read access to navigation_items" ON public.navigation_items FOR SELECT USING (true);
CREATE POLICY "Only admins can modify navigation_items" ON public.navigation_items FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to navigation_item_translations" ON public.navigation_item_translations FOR SELECT USING (true);
CREATE POLICY "Only admins can modify navigation_item_translations" ON public.navigation_item_translations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_static_pages_updated_at BEFORE UPDATE ON public.static_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_static_page_translations_updated_at BEFORE UPDATE ON public.static_page_translations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contact_info_translations_updated_at BEFORE UPDATE ON public.contact_info_translations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_navigation_items_updated_at BEFORE UPDATE ON public.navigation_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_navigation_item_translations_updated_at BEFORE UPDATE ON public.navigation_item_translations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (key, value, description, category, is_public) VALUES
('site_title', 'Advisable', 'Main site title', 'seo', true),
('site_description', 'Digital Agency & Venture Studio', 'Main site description', 'seo', true),
('contact_email', 'info@advisable.gr', 'Primary contact email', 'contact', true),
('contact_phone', '+30 210 1234567', 'Primary contact phone', 'contact', true),
('office_address', 'Athens, Greece', 'Main office address', 'contact', true),
('google_analytics_id', '', 'Google Analytics tracking ID', 'analytics', false),
('facebook_url', '', 'Facebook page URL', 'social', true),
('linkedin_url', '', 'LinkedIn page URL', 'social', true),
('twitter_url', '', 'Twitter page URL', 'social', true),
('instagram_url', '', 'Instagram page URL', 'social', true);

-- Insert default static pages
INSERT INTO public.static_pages (slug, page_type) VALUES
('privacy-policy', 'legal'),
('terms-of-service', 'legal'),
('cookie-policy', 'legal');

-- Insert default contact info
INSERT INTO public.contact_info (info_type, is_primary, display_order) VALUES
('office', true, 1),
('phone', true, 2),
('email', true, 3);

-- Database functions for fetching data with translations
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