-- Enable RLS on app_settings table and create appropriate policies
-- This fixes the security issue: RLS Disabled in Public

-- Enable Row Level Security on app_settings table
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to app_settings
-- App settings should be readable by everyone for configuration purposes
CREATE POLICY "Public read access to app_settings"
ON public.app_settings
FOR SELECT
USING (true);

-- Create policy for admin-only modifications to app_settings
-- Only admins should be able to create, update, or delete app settings
CREATE POLICY "Only admins can modify app_settings"
ON public.app_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));