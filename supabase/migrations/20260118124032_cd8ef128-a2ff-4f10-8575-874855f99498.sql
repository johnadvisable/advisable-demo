-- Add child_services_intro field for parent services
-- This field will contain a short 1-2 line description for the child services section

ALTER TABLE public.service_translations
ADD COLUMN child_services_intro TEXT;