
-- =====================================================
-- SERVICE UVPS (Unique Value Propositions)
-- =====================================================

CREATE TABLE public.service_uvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  icon_name TEXT NOT NULL DEFAULT 'TrendingUp',
  metric_value TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.service_uvp_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  uvp_id UUID NOT NULL REFERENCES public.service_uvps(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(uvp_id, language_id)
);

-- Indexes
CREATE INDEX idx_service_uvps_service_id ON public.service_uvps(service_id);
CREATE INDEX idx_service_uvp_translations_uvp_id ON public.service_uvp_translations(uvp_id);
CREATE INDEX idx_service_uvp_translations_language_id ON public.service_uvp_translations(language_id);

-- RLS
ALTER TABLE public.service_uvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_uvp_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to service_uvps" ON public.service_uvps FOR SELECT USING (true);
CREATE POLICY "Only admins can modify service_uvps" ON public.service_uvps FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to service_uvp_translations" ON public.service_uvp_translations FOR SELECT USING (true);
CREATE POLICY "Only admins can modify service_uvp_translations" ON public.service_uvp_translations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- SERVICE FAQS
-- =====================================================

CREATE TABLE public.service_faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.service_faq_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faq_id UUID NOT NULL REFERENCES public.service_faqs(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(faq_id, language_id)
);

-- Indexes
CREATE INDEX idx_service_faqs_service_id ON public.service_faqs(service_id);
CREATE INDEX idx_service_faq_translations_faq_id ON public.service_faq_translations(faq_id);
CREATE INDEX idx_service_faq_translations_language_id ON public.service_faq_translations(language_id);

-- RLS
ALTER TABLE public.service_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_faq_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to service_faqs" ON public.service_faqs FOR SELECT USING (true);
CREATE POLICY "Only admins can modify service_faqs" ON public.service_faqs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to service_faq_translations" ON public.service_faq_translations FOR SELECT USING (true);
CREATE POLICY "Only admins can modify service_faq_translations" ON public.service_faq_translations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- SERVICE CLIENTS (Junction for Case Studies)
-- =====================================================

CREATE TABLE public.service_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(service_id, client_id)
);

-- Indexes
CREATE INDEX idx_service_clients_service_id ON public.service_clients(service_id);
CREATE INDEX idx_service_clients_client_id ON public.service_clients(client_id);

-- RLS
ALTER TABLE public.service_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to service_clients" ON public.service_clients FOR SELECT USING (true);
CREATE POLICY "Only admins can modify service_clients" ON public.service_clients FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- SERVICE PARTNERS (Junction)
-- =====================================================

CREATE TABLE public.service_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(service_id, partner_id)
);

-- Indexes
CREATE INDEX idx_service_partners_service_id ON public.service_partners(service_id);
CREATE INDEX idx_service_partners_partner_id ON public.service_partners(partner_id);

-- RLS
ALTER TABLE public.service_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to service_partners" ON public.service_partners FOR SELECT USING (true);
CREATE POLICY "Only admins can modify service_partners" ON public.service_partners FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- SERVICE TESTIMONIALS
-- =====================================================

CREATE TABLE public.service_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_company TEXT,
  author_image TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.service_testimonial_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  testimonial_id UUID NOT NULL REFERENCES public.service_testimonials(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  quote TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(testimonial_id, language_id)
);

-- Indexes
CREATE INDEX idx_service_testimonials_service_id ON public.service_testimonials(service_id);
CREATE INDEX idx_service_testimonials_client_id ON public.service_testimonials(client_id);
CREATE INDEX idx_service_testimonial_translations_testimonial_id ON public.service_testimonial_translations(testimonial_id);
CREATE INDEX idx_service_testimonial_translations_language_id ON public.service_testimonial_translations(language_id);

-- RLS
ALTER TABLE public.service_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_testimonial_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to service_testimonials" ON public.service_testimonials FOR SELECT USING (true);
CREATE POLICY "Only admins can modify service_testimonials" ON public.service_testimonials FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to service_testimonial_translations" ON public.service_testimonial_translations FOR SELECT USING (true);
CREATE POLICY "Only admins can modify service_testimonial_translations" ON public.service_testimonial_translations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- DATABASE FUNCTIONS
-- =====================================================

-- Get Service UVPs with translations
CREATE OR REPLACE FUNCTION public.get_service_uvps(
  p_service_id UUID,
  p_language_code TEXT DEFAULT 'en'
)
RETURNS TABLE (
  id UUID,
  service_id UUID,
  icon_name TEXT,
  metric_value TEXT,
  display_order INTEGER,
  label TEXT,
  description TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_language_id INTEGER;
BEGIN
  SELECT l.id INTO v_language_id FROM languages l WHERE l.code = p_language_code;
  IF v_language_id IS NULL THEN
    SELECT l.id INTO v_language_id FROM languages l WHERE l.code = 'en';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.service_id,
    u.icon_name,
    u.metric_value,
    u.display_order,
    COALESCE(t.label, et.label) AS label,
    COALESCE(t.description, et.description) AS description
  FROM service_uvps u
  LEFT JOIN service_uvp_translations t ON t.uvp_id = u.id AND t.language_id = v_language_id
  LEFT JOIN service_uvp_translations et ON et.uvp_id = u.id AND et.language_id = (SELECT l.id FROM languages l WHERE l.code = 'en')
  WHERE u.service_id = p_service_id AND u.is_active = true
  ORDER BY u.display_order;
END;
$$;

-- Get Service FAQs with translations
CREATE OR REPLACE FUNCTION public.get_service_faqs(
  p_service_id UUID,
  p_language_code TEXT DEFAULT 'en'
)
RETURNS TABLE (
  id UUID,
  service_id UUID,
  display_order INTEGER,
  question TEXT,
  answer TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_language_id INTEGER;
BEGIN
  SELECT l.id INTO v_language_id FROM languages l WHERE l.code = p_language_code;
  IF v_language_id IS NULL THEN
    SELECT l.id INTO v_language_id FROM languages l WHERE l.code = 'en';
  END IF;

  RETURN QUERY
  SELECT 
    f.id,
    f.service_id,
    f.display_order,
    COALESCE(t.question, et.question) AS question,
    COALESCE(t.answer, et.answer) AS answer
  FROM service_faqs f
  LEFT JOIN service_faq_translations t ON t.faq_id = f.id AND t.language_id = v_language_id
  LEFT JOIN service_faq_translations et ON et.faq_id = f.id AND et.language_id = (SELECT l.id FROM languages l WHERE l.code = 'en')
  WHERE f.service_id = p_service_id AND f.is_active = true
  ORDER BY f.display_order;
END;
$$;

-- Get Service Case Studies (linked clients)
CREATE OR REPLACE FUNCTION public.get_service_case_studies(
  p_service_id UUID,
  p_language_code TEXT DEFAULT 'en'
)
RETURNS TABLE (
  id UUID,
  client_id UUID,
  client_slug TEXT,
  client_logo TEXT,
  client_name TEXT,
  client_description TEXT,
  is_featured BOOLEAN,
  display_order INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_language_id INTEGER;
BEGIN
  SELECT l.id INTO v_language_id FROM languages l WHERE l.code = p_language_code;
  IF v_language_id IS NULL THEN
    SELECT l.id INTO v_language_id FROM languages l WHERE l.code = 'en';
  END IF;

  RETURN QUERY
  SELECT 
    sc.id,
    c.id AS client_id,
    c.slug AS client_slug,
    c.logo AS client_logo,
    COALESCE(ct.name, cet.name, c.slug) AS client_name,
    COALESCE(ct.description, cet.description) AS client_description,
    sc.is_featured,
    sc.display_order
  FROM service_clients sc
  JOIN clients c ON c.id = sc.client_id
  LEFT JOIN clients_translations ct ON ct.client_id = c.id AND ct.language_id = v_language_id
  LEFT JOIN clients_translations cet ON cet.client_id = c.id AND cet.language_id = (SELECT l.id FROM languages l WHERE l.code = 'en')
  WHERE sc.service_id = p_service_id
  ORDER BY sc.is_featured DESC, sc.display_order;
END;
$$;

-- Get Service Partners
CREATE OR REPLACE FUNCTION public.get_service_partners(
  p_service_id UUID
)
RETURNS TABLE (
  id UUID,
  partner_id UUID,
  partner_slug TEXT,
  partner_logo TEXT,
  partner_name TEXT,
  display_order INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    p.id AS partner_id,
    p.slug AS partner_slug,
    p.logo AS partner_logo,
    COALESCE(pt.name, p.slug) AS partner_name,
    sp.display_order
  FROM service_partners sp
  JOIN partners p ON p.id = sp.partner_id
  LEFT JOIN partner_translations pt ON pt.partner_id = p.id AND pt.language_id = (SELECT l.id FROM languages l WHERE l.code = 'en')
  WHERE sp.service_id = p_service_id
  ORDER BY sp.display_order;
END;
$$;

-- Get Service Testimonials with translations
CREATE OR REPLACE FUNCTION public.get_service_testimonials(
  p_service_id UUID,
  p_language_code TEXT DEFAULT 'en'
)
RETURNS TABLE (
  id UUID,
  service_id UUID,
  author_name TEXT,
  author_role TEXT,
  author_company TEXT,
  author_image TEXT,
  rating INTEGER,
  display_order INTEGER,
  quote TEXT,
  client_logo TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_language_id INTEGER;
BEGIN
  SELECT l.id INTO v_language_id FROM languages l WHERE l.code = p_language_code;
  IF v_language_id IS NULL THEN
    SELECT l.id INTO v_language_id FROM languages l WHERE l.code = 'en';
  END IF;

  RETURN QUERY
  SELECT 
    st.id,
    st.service_id,
    st.author_name,
    st.author_role,
    st.author_company,
    st.author_image,
    st.rating,
    st.display_order,
    COALESCE(t.quote, et.quote) AS quote,
    c.logo AS client_logo
  FROM service_testimonials st
  LEFT JOIN service_testimonial_translations t ON t.testimonial_id = st.id AND t.language_id = v_language_id
  LEFT JOIN service_testimonial_translations et ON et.testimonial_id = st.id AND et.language_id = (SELECT l.id FROM languages l WHERE l.code = 'en')
  LEFT JOIN clients c ON c.id = st.client_id
  WHERE st.service_id = p_service_id AND st.is_active = true
  ORDER BY st.display_order;
END;
$$;

-- Update timestamp triggers
CREATE TRIGGER update_service_uvps_updated_at
  BEFORE UPDATE ON public.service_uvps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_uvp_translations_updated_at
  BEFORE UPDATE ON public.service_uvp_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_faqs_updated_at
  BEFORE UPDATE ON public.service_faqs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_faq_translations_updated_at
  BEFORE UPDATE ON public.service_faq_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_testimonials_updated_at
  BEFORE UPDATE ON public.service_testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_testimonial_translations_updated_at
  BEFORE UPDATE ON public.service_testimonial_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
