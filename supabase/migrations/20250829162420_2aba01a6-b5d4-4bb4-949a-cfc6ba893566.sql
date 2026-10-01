-- Fix security search_path issues for functions
-- Add SECURITY DEFINER and SET search_path to 'public' for all functions

-- Fix migrate_client_translations function
CREATE OR REPLACE FUNCTION public.migrate_client_translations()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_count INTEGER := 0;
  r RECORD;
  v_lang_id INTEGER;
  v_name TEXT;
  v_description TEXT;
  v_testimonial TEXT;
  v_case_study_challenge TEXT;
  v_case_study_solution TEXT;
BEGIN
  -- Iterate through clients
  FOR r IN SELECT * FROM public.clients LOOP
    -- Iterate through languages
    FOR v_lang_id IN SELECT id FROM public.languages WHERE is_active = TRUE LOOP
      -- Skip English as it's the default language
      IF (SELECT code FROM public.languages WHERE id = v_lang_id) = 'en' THEN
        CONTINUE;
      END IF;
      
      -- Check if we already have a translation
      IF NOT EXISTS (
        SELECT 1 FROM public.clients_translations 
        WHERE client_id = r.id AND language_id = v_lang_id
      ) THEN
        -- Get translations from existing translations table
        SELECT content INTO v_name 
        FROM public.translations 
        WHERE table_name = 'clients' 
          AND record_id = r.id 
          AND field_name = 'name' 
          AND language_code = (SELECT code FROM public.languages WHERE id = v_lang_id);
          
        SELECT content INTO v_description
        FROM public.translations 
        WHERE table_name = 'clients' 
          AND record_id = r.id 
          AND field_name = 'description' 
          AND language_code = (SELECT code FROM public.languages WHERE id = v_lang_id);
          
        SELECT content INTO v_testimonial
        FROM public.translations 
        WHERE table_name = 'clients' 
          AND record_id = r.id 
          AND field_name = 'testimonial' 
          AND language_code = (SELECT code FROM public.languages WHERE id = v_lang_id);
          
        SELECT content INTO v_case_study_challenge
        FROM public.translations 
        WHERE table_name = 'clients' 
          AND record_id = r.id 
          AND field_name = 'case_study_challenge' 
          AND language_code = (SELECT code FROM public.languages WHERE id = v_lang_id);
          
        SELECT content INTO v_case_study_solution
        FROM public.translations 
        WHERE table_name = 'clients' 
          AND record_id = r.id 
          AND field_name = 'case_study_solution' 
          AND language_code = (SELECT code FROM public.languages WHERE id = v_lang_id);
          
        -- Insert into the new structure with default values if no translation found
        INSERT INTO public.clients_translations (
          client_id, 
          language_id,
          name,
          description,
          testimonial,
          case_study_challenge,
          case_study_solution
        ) VALUES (
          r.id,
          v_lang_id,
          COALESCE(v_name, r.name),
          COALESCE(v_description, r.description),
          COALESCE(v_testimonial, r.testimonial),
          COALESCE(v_case_study_challenge, r.case_study_challenge),
          COALESCE(v_case_study_solution, r.case_study_solution)
        );
        
        v_count := v_count + 1;
      END IF;
    END LOOP;
  END LOOP;
  
  RETURN v_count;
END;
$function$;

-- Fix migrate_team_member_translations function
CREATE OR REPLACE FUNCTION public.migrate_team_member_translations()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_count INTEGER := 0;
  r RECORD;
  v_lang_id INTEGER;
BEGIN
  -- Iterate through team members
  FOR r IN SELECT * FROM public.team_members LOOP
    -- Iterate through languages
    FOR v_lang_id IN SELECT id FROM public.languages WHERE is_active = TRUE LOOP
      -- Skip English as it's the default language
      IF (SELECT code FROM public.languages WHERE id = v_lang_id) = 'en' THEN
        CONTINUE;
      END IF;
      
      -- First check if we already have a translation for this team member and language
      IF NOT EXISTS (
        SELECT 1 FROM public.team_member_translations 
        WHERE team_member_id = r.id AND language_id = v_lang_id
      ) THEN
        -- Insert default values from the original team member record
        INSERT INTO public.team_member_translations (
          team_member_id, 
          language_id,
          name,
          job_title, -- Changed to job_title
          bio,
          role_description
        ) VALUES (
          r.id,
          v_lang_id,
          r.name,
          r.position,
          r.bio,
          r.role_description
        );
        
        v_count := v_count + 1;
      END IF;
    END LOOP;
  END LOOP;
  
  RETURN v_count;
END;
$function$;

-- Fix migrate_news_item_translations function
CREATE OR REPLACE FUNCTION public.migrate_news_item_translations()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_count INTEGER := 0;
  r RECORD;
  v_lang_id INTEGER;
BEGIN
  -- Iterate through news items
  FOR r IN SELECT * FROM public.news_items LOOP
    -- Iterate through languages
    FOR v_lang_id IN SELECT id FROM public.languages WHERE is_active = TRUE LOOP
      -- Skip English as it's the default language
      IF (SELECT code FROM public.languages WHERE id = v_lang_id) = 'en' THEN
        CONTINUE;
      END IF;
      
      -- Check if we already have a translation
      IF NOT EXISTS (
        SELECT 1 FROM public.news_item_translations 
        WHERE news_item_id = r.id AND language_id = v_lang_id
      ) THEN
        -- Insert default values from the original record
        INSERT INTO public.news_item_translations (
          news_item_id,
          language_id,
          title,
          excerpt,
          content
        ) VALUES (
          r.id,
          v_lang_id,
          r.title,
          r.excerpt,
          r.content
        );
        
        v_count := v_count + 1;
      END IF;
    END LOOP;
  END LOOP;
  
  RETURN v_count;
END;
$function$;