-- First, drop existing problematic policies and functions
DROP POLICY IF EXISTS "Public read access to team_member_translations" ON public.team_member_translations;
DROP POLICY IF EXISTS "Only admins can modify team_member_translations" ON public.team_member_translations;
DROP TRIGGER IF EXISTS update_team_member_translations_updated_at ON public.team_member_translations;
DROP FUNCTION IF EXISTS public.get_all_team_members_with_translation(character varying);
DROP FUNCTION IF EXISTS public.get_team_members_public_safe(character varying);

-- Create team_member_translations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.team_member_translations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_member_id uuid NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  language_id integer NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  name text,
  job_title text,
  bio text,
  role_description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(team_member_id, language_id)
);

-- Enable RLS on team_member_translations
ALTER TABLE public.team_member_translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for team_member_translations
CREATE POLICY "team_member_translations_public_read" 
ON public.team_member_translations 
FOR SELECT 
USING (true);

CREATE POLICY "team_member_translations_admin_all" 
ON public.team_member_translations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_team_member_translations_updated_at
BEFORE UPDATE ON public.team_member_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fix the main team members function with proper column aliasing
CREATE OR REPLACE FUNCTION public.get_all_team_members_public(p_language_code character varying)
RETURNS TABLE(
  id uuid, 
  name text, 
  job_position text, 
  bio text, 
  role_description text, 
  image_url text, 
  linkedin_url text, 
  twitter_url text, 
  github_url text, 
  instagram_url text, 
  email text, 
  specializations text[], 
  achievements text[], 
  is_leadership boolean, 
  display_order integer
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
    tm.id,
    COALESCE(
      (SELECT tmt.name FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.name
    ) AS name,
    COALESCE(
      (SELECT tmt.job_title FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.position
    ) AS job_position,
    COALESCE(
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.bio
    ) AS bio,
    COALESCE(
      (SELECT tmt.role_description FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.role_description
    ) AS role_description,
    tm.image_url,
    tm.linkedin_url,
    tm.twitter_url,
    tm.github_url,
    tm.instagram_url,
    tm.email,
    tm.specializations,
    tm.achievements,
    tm.is_leadership,
    tm.display_order
  FROM public.team_members tm
  ORDER BY tm.display_order, tm.name;
END;
$function$;