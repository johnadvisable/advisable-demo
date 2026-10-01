-- Create junction table for partner-category many-to-many relationship
CREATE TABLE public.partner_partner_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate partner-category pairs
CREATE UNIQUE INDEX partner_partner_categories_unique_pair 
ON public.partner_partner_categories (partner_id, category);

-- Enable Row Level Security
ALTER TABLE public.partner_partner_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Only admins can modify partner_partner_categories" 
ON public.partner_partner_categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to partner_partner_categories" 
ON public.partner_partner_categories 
FOR SELECT 
USING (true);

-- Create function to get partner categories (similar to get_client_categories)
CREATE OR REPLACE FUNCTION public.get_partner_categories(p_partner_id text)
RETURNS text[]
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN ARRAY(
    SELECT category 
    FROM public.partner_partner_categories 
    WHERE partner_id = p_partner_id
  );
END;
$function$;

-- Migrate existing category data from partners table to junction table
INSERT INTO public.partner_partner_categories (partner_id, category)
SELECT id, category 
FROM public.partners 
WHERE category IS NOT NULL AND category != '';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_partner_partner_categories_updated_at
BEFORE UPDATE ON public.partner_partner_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();