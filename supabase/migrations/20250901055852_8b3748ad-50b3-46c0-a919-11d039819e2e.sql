-- Phase 1: Database Schema Normalization and Security Fixes

-- Fix table naming inconsistencies 
-- The correct table name should be 'service_translations' to match the pattern

-- First, check if data exists and migrate if needed
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    -- Check if services_translations exists and has data
    SELECT COUNT(*) INTO row_count FROM services_translations;
    
    IF row_count > 0 THEN
        -- Create service_translations if it doesn't exist
        CREATE TABLE IF NOT EXISTS public.service_translations (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            service_id UUID NOT NULL,
            language_id INTEGER NOT NULL,
            title TEXT,
            short_description TEXT,
            long_description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            UNIQUE(service_id, language_id)
        );
        
        -- Enable RLS on service_translations
        ALTER TABLE public.service_translations ENABLE ROW LEVEL SECURITY;
        
        -- Migrate data from services_translations to service_translations if needed
        INSERT INTO public.service_translations (
            id, service_id, language_id, title, short_description, 
            long_description, created_at, updated_at
        )
        SELECT 
            id, service_id, language_id, title, short_description,
            long_description, created_at, updated_at
        FROM public.services_translations
        ON CONFLICT (service_id, language_id) DO UPDATE SET
            title = EXCLUDED.title,
            short_description = EXCLUDED.short_description,
            long_description = EXCLUDED.long_description,
            updated_at = EXCLUDED.updated_at;
    END IF;
END $$;

-- Create proper RLS policies for service_translations
CREATE POLICY "Public read access to service_translations" 
ON public.service_translations 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Only admins can modify service_translations" 
ON public.service_translations 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Update the get_all_services_with_translation function to use correct table name
CREATE OR REPLACE FUNCTION public.get_all_services_with_translation(p_language_code character varying)
 RETURNS TABLE(id uuid, category_id uuid, slug text, emoji text, display_order integer, title text, short_description text, long_description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  -- Get language ID
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  -- Get default language ID
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    s.id,
    s.category_id,
    s.slug,
    s.emoji,
    s.display_order,
    COALESCE(
      (SELECT st.title FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.title FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS title,
    COALESCE(
      (SELECT st.short_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.short_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS short_description,
    COALESCE(
      (SELECT st.long_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.long_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS long_description
  FROM public.services s
  ORDER BY s.display_order;
END;
$function$;

-- Update service category functions with proper security
CREATE OR REPLACE FUNCTION public.get_all_service_categories_joined(p_language_code text)
 RETURNS TABLE(id uuid, slug text, name text, description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_language_id INTEGER;
BEGIN
    -- Get the language ID
    SELECT l.id INTO v_language_id 
    FROM public.languages l
    WHERE l.code = p_language_code;
    
    -- Return categories with translations
    RETURN QUERY
    SELECT 
        sc.id,
        sc.slug::text,
        COALESCE(sct.name, 'Unnamed Category') as name,
        COALESCE(sct.description, '') as description
    FROM public.service_categories sc
    LEFT JOIN public.service_category_translations sct ON sc.id = sct.category_id
    WHERE sct.language_id = v_language_id OR sct.language_id IS NULL
    ORDER BY sc.slug;
END;
$function$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_translations_service_id ON public.service_translations(service_id);
CREATE INDEX IF NOT EXISTS idx_service_translations_language_id ON public.service_translations(language_id);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON public.services(display_order);

-- Add foreign key constraints if they don't exist
ALTER TABLE public.service_translations 
ADD CONSTRAINT fk_service_translations_service_id 
FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE public.service_translations 
ADD CONSTRAINT fk_service_translations_language_id 
FOREIGN KEY (language_id) REFERENCES public.languages(id) ON DELETE CASCADE;