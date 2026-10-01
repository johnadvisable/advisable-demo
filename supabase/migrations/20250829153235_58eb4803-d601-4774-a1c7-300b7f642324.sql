-- Create table for company facts management
CREATE TABLE IF NOT EXISTS public.company_facts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  icon_name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_facts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access to company_facts" 
ON public.company_facts FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify company_facts" 
ON public.company_facts FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create translations table for company facts
CREATE TABLE IF NOT EXISTS public.company_fact_translations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_fact_id uuid NOT NULL REFERENCES public.company_facts(id) ON DELETE CASCADE,
  language_id integer NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  label text,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(company_fact_id, language_id)
);

-- Enable RLS
ALTER TABLE public.company_fact_translations ENABLE ROW LEVEL SECURITY;

-- Create policies for translations
CREATE POLICY "Public read access to company_fact_translations" 
ON public.company_fact_translations FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify company_fact_translations" 
ON public.company_fact_translations FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default company facts
INSERT INTO public.company_facts (key, value, icon_name, display_order) VALUES
('founded_year', '2018', 'Calendar', 1),
('team_size', '45+', 'Users', 2),
('projects_delivered', '500+', 'Award', 3)
ON CONFLICT (key) DO NOTHING;

-- Insert default English translations
INSERT INTO public.company_fact_translations (company_fact_id, language_id, label, description)
SELECT 
  cf.id,
  l.id,
  CASE cf.key
    WHEN 'founded_year' THEN 'Founded'
    WHEN 'team_size' THEN 'Team Size'  
    WHEN 'projects_delivered' THEN 'Projects Delivered'
  END,
  CASE cf.key
    WHEN 'founded_year' THEN 'Year the company was established'
    WHEN 'team_size' THEN 'Current team size across all departments'
    WHEN 'projects_delivered' THEN 'Total number of successfully delivered projects'
  END
FROM public.company_facts cf
CROSS JOIN public.languages l
WHERE l.code = 'en'
ON CONFLICT (company_fact_id, language_id) DO NOTHING;

-- Create function to get company facts with translations
CREATE OR REPLACE FUNCTION public.get_all_company_facts_with_translation(p_language_code character varying)
RETURNS TABLE(
  id uuid,
  key text,
  value text,
  icon_name text,
  display_order integer,
  label text,
  description text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
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