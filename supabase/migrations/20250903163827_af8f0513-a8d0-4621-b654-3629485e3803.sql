-- Fix the team members function with proper column names
CREATE OR REPLACE FUNCTION public.get_all_team_members_with_translations(p_language_code character varying)
 RETURNS TABLE(id uuid, slug text, name text, job_position text, bio text, image_url text, linkedin_url text, email text, phone text, display_order integer, is_leadership boolean, department text, join_date date, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
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
    tm.id,
    tm.slug,
    COALESCE(
      (SELECT tmt.name FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.name FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      'Unnamed Member'
    ) AS name,
    COALESCE(
      (SELECT tmt.job_position FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.job_position FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      ''
    ) AS job_position,
    COALESCE(
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      ''
    ) AS bio,
    tm.image_url,
    tm.linkedin_url,
    tm.email,
    tm.phone,
    COALESCE(tm.display_order, 0) AS display_order,
    COALESCE(tm.is_leadership, false) AS is_leadership,
    tm.department,
    tm.join_date,
    tm.created_at,
    tm.updated_at
  FROM public.team_members tm
  ORDER BY tm.display_order ASC NULLS LAST;
END;
$function$;

-- Add foreign key constraints and indexes
ALTER TABLE public.client_categories 
ADD CONSTRAINT fk_client_categories_client_id 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.clients_translations 
ADD CONSTRAINT fk_clients_translations_client_id 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_clients_translations_client_id ON public.clients_translations(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_translations_language_id ON public.clients_translations(language_id);
CREATE INDEX IF NOT EXISTS idx_client_categories_client_id ON public.client_categories(client_id);