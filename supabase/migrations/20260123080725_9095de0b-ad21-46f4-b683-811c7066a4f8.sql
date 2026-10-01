-- Create domain_config table for centralized domain management
CREATE TABLE public.domain_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language_code character varying NOT NULL REFERENCES public.languages(code) ON DELETE CASCADE,
  domain text NOT NULL,
  is_primary boolean DEFAULT true,
  homepage_url text GENERATED ALWAYS AS ('https://www.' || domain) STORED,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(language_code, domain)
);

-- Create index for fast language lookups
CREATE INDEX idx_domain_config_language ON public.domain_config(language_code);
CREATE INDEX idx_domain_config_domain ON public.domain_config(domain);

-- Enable RLS
ALTER TABLE public.domain_config ENABLE ROW LEVEL SECURITY;

-- Public read access (needed for SEO generation)
CREATE POLICY "Public read access to domain_config"
ON public.domain_config
FOR SELECT
USING (true);

-- Only admins can modify
CREATE POLICY "Only admins can modify domain_config"
ON public.domain_config
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert the domain mappings
INSERT INTO public.domain_config (language_code, domain, is_primary) VALUES
('en', 'advisable.com', true),
('el', 'advisable.gr', true),
('es', 'advisable.es', true),
('fr', 'advisable.fr', true),
('it', 'advisable.it', true);

-- Create updated_at trigger
CREATE TRIGGER update_domain_config_updated_at
BEFORE UPDATE ON public.domain_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();