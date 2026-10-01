-- Create client_categories table for many-to-many relationship
CREATE TABLE public.client_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate category assignments
ALTER TABLE public.client_categories ADD CONSTRAINT unique_client_category UNIQUE (client_id, category);

-- Enable RLS
ALTER TABLE public.client_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access to client_categories" 
ON public.client_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify client_categories" 
ON public.client_categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Migrate existing data from product_category to client_categories
INSERT INTO public.client_categories (client_id, category)
SELECT id, product_category 
FROM public.clients 
WHERE product_category IS NOT NULL AND product_category != '';

-- Create function to get client categories
CREATE OR REPLACE FUNCTION public.get_client_categories(p_client_id UUID)
RETURNS TEXT[]
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN ARRAY(
    SELECT category 
    FROM public.client_categories 
    WHERE client_id = p_client_id
  );
END;
$function$;

-- Update the existing function to return categories as array
CREATE OR REPLACE FUNCTION public.get_all_clients_with_translation(p_language_code character varying)
RETURNS TABLE(
  id uuid, 
  name text, 
  logo text, 
  description text, 
  testimonial text, 
  background_image text, 
  website text, 
  featured boolean, 
  product_category text, 
  product_categories text[],
  case_study_challenge text, 
  case_study_solution text, 
  case_study_team_size text, 
  case_study_timeline text, 
  case_study_images jsonb, 
  case_study_videos jsonb, 
  case_study_results jsonb, 
  industry text, 
  country text, 
  display_order integer
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  -- Get language ID
  SELECT id INTO v_language_id 
  FROM public.languages 
  WHERE code = p_language_code;
  
  -- Get default language ID
  SELECT id INTO v_default_language_id 
  FROM public.languages 
  WHERE is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    c.id,
    COALESCE(
      (SELECT ct.name FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.name
    ) AS name,
    c.logo,
    COALESCE(
      (SELECT ct.description FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.description
    ) AS description,
    COALESCE(
      (SELECT ct.testimonial FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.testimonial
    ) AS testimonial,
    c.background_image,
    c.website,
    c.featured,
    c.product_category,
    get_client_categories(c.id) AS product_categories,
    COALESCE(
      (SELECT ct.case_study_challenge FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.case_study_challenge
    ) AS case_study_challenge,
    COALESCE(
      (SELECT ct.case_study_solution FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.case_study_solution
    ) AS case_study_solution,
    c.case_study_team_size,
    c.case_study_timeline,
    c.case_study_images,
    c.case_study_videos,
    c.case_study_results,
    c.industry,
    c.country,
    c.display_order
  FROM public.clients c
  ORDER BY c.display_order, c.name;
END;
$function$;

-- Update get_client_with_translation function
CREATE OR REPLACE FUNCTION public.get_client_with_translation(p_client_id uuid, p_language_code character varying)
RETURNS TABLE(
  id uuid, 
  name text, 
  logo text, 
  description text, 
  testimonial text, 
  background_image text, 
  website text, 
  featured boolean, 
  product_category text, 
  product_categories text[],
  case_study_challenge text, 
  case_study_solution text, 
  case_study_team_size text, 
  case_study_timeline text, 
  case_study_images jsonb, 
  case_study_videos jsonb, 
  case_study_results jsonb, 
  industry text, 
  country text, 
  display_order integer
)
LANGUAGE plpgsql
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  -- Get language ID
  SELECT id INTO v_language_id 
  FROM public.languages 
  WHERE code = p_language_code;
  
  -- Get default language ID
  SELECT id INTO v_default_language_id 
  FROM public.languages 
  WHERE is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    c.id,
    COALESCE(
      (SELECT ct.name FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.name
    ) AS name,
    c.logo,
    COALESCE(
      (SELECT ct.description FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.description
    ) AS description,
    COALESCE(
      (SELECT ct.testimonial FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.testimonial
    ) AS testimonial,
    c.background_image,
    c.website,
    c.featured,
    c.product_category,
    get_client_categories(c.id) AS product_categories,
    COALESCE(
      (SELECT ct.case_study_challenge FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.case_study_challenge
    ) AS case_study_challenge,
    COALESCE(
      (SELECT ct.case_study_solution FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.case_study_solution
    ) AS case_study_solution,
    c.case_study_team_size,
    c.case_study_timeline,
    c.case_study_images,
    c.case_study_videos,
    c.case_study_results,
    c.industry,
    c.country,
    c.display_order
  FROM public.clients c
  WHERE c.id = p_client_id;
END;
$function$;