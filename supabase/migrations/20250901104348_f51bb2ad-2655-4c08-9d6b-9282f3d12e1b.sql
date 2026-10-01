-- Add slug column to clients table and generate slugs for existing clients
ALTER TABLE public.clients ADD COLUMN slug text;

-- Create function to generate slug from client name
CREATE OR REPLACE FUNCTION public.generate_client_slug(client_name text)
RETURNS text
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(client_name, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$function$;

-- Generate slugs for existing clients using their names from translations
UPDATE public.clients 
SET slug = public.generate_client_slug(
  COALESCE(
    (SELECT name FROM public.clients_translations ct 
     JOIN public.languages l ON ct.language_id = l.id 
     WHERE ct.client_id = clients.id AND l.is_default = true 
     LIMIT 1),
    'client'
  )
);

-- Handle any potential duplicate slugs by appending numbers
DO $$
DECLARE
    duplicate_record RECORD;
    new_slug TEXT;
    counter INTEGER;
BEGIN
    FOR duplicate_record IN 
        SELECT slug, array_agg(id) as ids 
        FROM public.clients 
        WHERE slug IS NOT NULL 
        GROUP BY slug 
        HAVING count(*) > 1
    LOOP
        counter := 1;
        FOR i IN 2..array_length(duplicate_record.ids, 1) LOOP
            new_slug := duplicate_record.slug || '-' || counter;
            -- Make sure the new slug doesn't exist
            WHILE EXISTS (SELECT 1 FROM public.clients WHERE slug = new_slug) LOOP
                counter := counter + 1;
                new_slug := duplicate_record.slug || '-' || counter;
            END LOOP;
            
            UPDATE public.clients 
            SET slug = new_slug 
            WHERE id = duplicate_record.ids[i];
            
            counter := counter + 1;
        END LOOP;
    END LOOP;
END $$;

-- Make slug required and unique
ALTER TABLE public.clients ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX idx_clients_slug ON public.clients(slug);

-- Create function to get client by slug with translation
CREATE OR REPLACE FUNCTION public.get_client_by_slug_with_translation(p_slug text, p_language_code character varying)
RETURNS TABLE(
  id uuid, 
  slug text,
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
BEGIN
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  RETURN QUERY
  SELECT 
    c.id,
    c.slug,
    COALESCE(ct.name, 'Unnamed Client') AS name,
    c.logo,
    COALESCE(ct.description, '') AS description,
    COALESCE(ct.testimonial, '') AS testimonial,
    c.background_image,
    c.website,
    c.featured,
    c.product_category,
    get_client_categories(c.id) AS product_categories,
    COALESCE(ct.case_study_challenge, '') AS case_study_challenge,
    COALESCE(ct.case_study_solution, '') AS case_study_solution,
    c.case_study_team_size,
    c.case_study_timeline,
    COALESCE(c.case_study_images, '[]'::jsonb) AS case_study_images,
    COALESCE(c.case_study_videos, '[]'::jsonb) AS case_study_videos,
    COALESCE(c.case_study_results, '[]'::jsonb) AS case_study_results,
    c.industry,
    c.country,
    COALESCE(c.display_order, 0) AS display_order
  FROM public.clients c
  LEFT JOIN public.clients_translations ct ON c.id = ct.client_id AND ct.language_id = v_language_id
  WHERE c.slug = p_slug;
END;
$function$;

-- Update existing function to include slug in results
CREATE OR REPLACE FUNCTION public.get_all_clients_with_translation(p_language_code character varying)
RETURNS TABLE(
  id uuid, 
  slug text,
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
  display_order integer, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
BEGIN
  -- Get language ID
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  RETURN QUERY
  SELECT 
    c.id,
    c.slug,
    COALESCE(ct.name, 'Unnamed Client') AS name,
    c.logo,
    COALESCE(ct.description, '') AS description,
    COALESCE(ct.testimonial, '') AS testimonial,
    c.background_image,
    c.website,
    c.featured,
    c.product_category,
    get_client_categories(c.id) AS product_categories,
    COALESCE(ct.case_study_challenge, '') AS case_study_challenge,
    COALESCE(ct.case_study_solution, '') AS case_study_solution,
    c.case_study_team_size,
    c.case_study_timeline,
    COALESCE(c.case_study_images, '[]'::jsonb) AS case_study_images,
    COALESCE(c.case_study_videos, '[]'::jsonb) AS case_study_videos,
    COALESCE(c.case_study_results, '[]'::jsonb) AS case_study_results,
    c.industry,
    c.country,
    COALESCE(c.display_order, 0) AS display_order,
    c.created_at,
    c.updated_at
  FROM public.clients c
  LEFT JOIN public.clients_translations ct ON c.id = ct.client_id AND ct.language_id = v_language_id
  ORDER BY c.display_order ASC NULLS LAST, ct.name ASC NULLS LAST;
END;
$function$;

-- Update get_client_with_translation to include slug
CREATE OR REPLACE FUNCTION public.get_client_with_translation(p_client_id uuid, p_language_code character varying)
RETURNS TABLE(
  id uuid, 
  slug text,
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
BEGIN
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  RETURN QUERY
  SELECT 
    c.id,
    c.slug,
    COALESCE(ct.name, 'Unnamed Client') AS name,
    c.logo,
    COALESCE(ct.description, '') AS description,
    COALESCE(ct.testimonial, '') AS testimonial,
    c.background_image,
    c.website,
    c.featured,
    c.product_category,
    get_client_categories(c.id) AS product_categories,
    COALESCE(ct.case_study_challenge, '') AS case_study_challenge,
    COALESCE(ct.case_study_solution, '') AS case_study_solution,
    c.case_study_team_size,
    c.case_study_timeline,
    COALESCE(c.case_study_images, '[]'::jsonb) AS case_study_images,
    COALESCE(c.case_study_videos, '[]'::jsonb) AS case_study_videos,
    COALESCE(c.case_study_results, '[]'::jsonb) AS case_study_results,
    c.industry,
    c.country,
    COALESCE(c.display_order, 0) AS display_order
  FROM public.clients c
  LEFT JOIN public.clients_translations ct ON c.id = ct.client_id AND ct.language_id = v_language_id
  WHERE c.id = p_client_id;
END;
$function$;