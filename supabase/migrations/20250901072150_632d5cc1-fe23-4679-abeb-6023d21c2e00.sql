-- Fix client drag and drop order update with proper error handling and batch operations

-- Create a more efficient function to update client display orders in batch
CREATE OR REPLACE FUNCTION public.update_client_display_orders(client_updates jsonb)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    client_update jsonb;
    update_count integer := 0;
BEGIN
    -- Only admins can update client orders
    IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
        RETURN QUERY SELECT false::boolean, 'Access denied. Admin privileges required.'::text;
        RETURN;
    END IF;
    
    -- Validate input
    IF client_updates IS NULL OR jsonb_array_length(client_updates) = 0 THEN
        RETURN QUERY SELECT false::boolean, 'No client updates provided.'::text;
        RETURN;
    END IF;
    
    -- Process each client update
    FOR client_update IN SELECT * FROM jsonb_array_elements(client_updates) LOOP
        -- Validate required fields
        IF NOT (client_update ? 'id' AND client_update ? 'display_order') THEN
            CONTINUE;
        END IF;
        
        -- Update the client display order
        UPDATE public.clients 
        SET display_order = (client_update->>'display_order')::integer,
            updated_at = NOW()
        WHERE id = (client_update->>'id')::uuid;
        
        -- Check if update was successful
        IF FOUND THEN
            update_count := update_count + 1;
        END IF;
    END LOOP;
    
    -- Return success with count
    RETURN QUERY SELECT true::boolean, 
        ('Updated display order for ' || update_count::text || ' clients.')::text;
END;
$function$;

-- Enhance get_all_clients_with_translation to ensure consistent ordering and data
DROP FUNCTION IF EXISTS public.get_all_clients_with_translation(character varying);
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
  display_order integer,
  created_at timestamptz,
  updated_at timestamptz
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