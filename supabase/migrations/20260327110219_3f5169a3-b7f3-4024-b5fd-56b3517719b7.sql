
-- Category FAQs table
CREATE TABLE public.service_category_faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Category FAQ translations table
CREATE TABLE public.service_category_faq_translations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faq_id uuid NOT NULL REFERENCES public.service_category_faqs(id) ON DELETE CASCADE,
  language_id integer NOT NULL REFERENCES public.languages(id),
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(faq_id, language_id)
);

-- RLS
ALTER TABLE public.service_category_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_category_faq_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to service_category_faqs" ON public.service_category_faqs FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can modify service_category_faqs" ON public.service_category_faqs FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to service_category_faq_translations" ON public.service_category_faq_translations FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can modify service_category_faq_translations" ON public.service_category_faq_translations FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
