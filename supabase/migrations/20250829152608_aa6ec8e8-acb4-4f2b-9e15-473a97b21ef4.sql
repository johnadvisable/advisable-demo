-- Create service_category_translations table
CREATE TABLE public.service_category_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(category_id, language_id)
);

-- Enable RLS
ALTER TABLE public.service_category_translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Only admins can modify service_category_translations" 
ON public.service_category_translations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to service_category_translations" 
ON public.service_category_translations 
FOR SELECT 
USING (true);

-- Create proper service categories
DELETE FROM public.service_categories;

INSERT INTO public.service_categories (id, name, slug, description) VALUES 
('54d5b665-a721-4b1d-8c3f-517c402125de', 'Digital Agency Services', 'digital-agency', 'Full-service digital agency solutions'),
('164b114a-ccb9-4900-8777-70fb9dcb5108', 'Venture Studio Services', 'venture-studio', 'Venture studio and startup incubation services');

-- Insert translations for service categories
DO $$
DECLARE
    english_lang_id INTEGER;
BEGIN
    -- Get language ID for English
    SELECT id INTO english_lang_id FROM public.languages WHERE code = 'en' LIMIT 1;
    
    IF english_lang_id IS NOT NULL THEN
        INSERT INTO public.service_category_translations (category_id, language_id, name, description) VALUES
        ('54d5b665-a721-4b1d-8c3f-517c402125de', english_lang_id, 'Digital Agency Services', 'Full-service digital agency solutions'),
        ('164b114a-ccb9-4900-8777-70fb9dcb5108', english_lang_id, 'Venture Studio Services', 'Venture studio and startup incubation services');
    END IF;
END $$;