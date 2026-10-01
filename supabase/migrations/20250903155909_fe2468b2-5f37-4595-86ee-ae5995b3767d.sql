-- Update team members job titles and add missing translations
-- Based on the provided JSON data with multilingual job titles
-- Using exact name matching approach

-- First, let's create a comprehensive update for all team members
-- Create temporary table with all the JSON data
CREATE TEMP TABLE temp_team_updates (
  name TEXT,
  title_en TEXT,
  title_fr TEXT,
  title_de TEXT,
  title_es TEXT,
  title_el TEXT
);

INSERT INTO temp_team_updates VALUES
('Vasilis Kallaras', 'CEO & Co-Founder', 'CEO & Co-Founder', 'CEO & Mitbegründer', 'CEO & Cofundador', 'CEO & Co-Founder'),
('Panagiotis Kollaras', 'Co-Founder', 'Co-fondateur', 'Mitbegründer', 'Cofundador', 'Co-Founder'),
('Alexander Theodosiou', 'Chief Technical Officer (CTO)', 'Directeur Technique (CTO)', 'Technischer Leiter (CTO)', 'Director Técnico (CTO)', 'Chief Technical Officer (CTO)'),
('Yiorgos Blatsis', 'Creative Director', 'Directeur Créatif', 'Kreativdirektor', 'Director Creativo', 'Creative Director'),
('Marios Akrivos', 'Marketing Director', 'Directeur Marketing', 'Marketingdirektor', 'Director de Marketing', 'Marketing Director'),
('Aggelos Ahmeti', 'Support Team Leader', 'Chef d''équipe Support', 'Leiter Support-Team', 'Líder del equipo de Soporte', 'Support Team Leader'),
('Vasilis Panagopoulos', 'Support Project Manager', 'Chef de projet Support', 'Support-Projektleiter', 'Gerente de Proyecto de Soporte', 'Support Project Manager'),
('Maria Mansuli', 'Executive Assistant', 'Assistant Exécutif', 'Exekutivassistent', 'Asistente Ejecutivo', 'Executive Assistant'),
('Zoi Samioti', 'Marketeer', 'Marketeur', 'Marketeer', 'Mercadólogo', 'Marketeer'),
('Eleni Anagnostou', 'Digital Marketing Manager', 'Responsable Marketing Digital', 'Digital Marketing Manager', 'Gerente de Marketing Digital', 'Digital Marketing Manager'),
('Viktor Tatgjonaj', 'Project Manager', 'Chef de projet', 'Projektmanager', 'Gerente de Proyecto', 'Project Manager'),
('Tina Ioannou', 'Client Service', 'Service Clientèle', 'Kundenservice', 'Atención al Cliente', 'Client Service'),
('Diana Kavalieri', 'Art Director', 'Directeur Artistique', 'Artdirektor', 'Director de Arte', 'Art Director'),
('Vag Papaloukas', 'Chief Architect (CA)', 'Architecte en Chef', 'Chefarchitekt', 'Arquitecto Jefe', 'Chief Architect (CA)'),
('George Hatzopoulos', 'CIO (DevOps)', 'DSI (DevOps)', 'CIO (DevOps)', 'Director de Informática (DevOps)', 'CIO (DevOps)'),
('Bill Totskas', 'Full Stack Developer', 'Développeur Full Stack', 'Full-Stack-Entwickler', 'Desarrollador Full Stack', 'Full Stack Developer'),
('Teo Theodorou', 'Full Stack Developer', 'Développeur Full Stack', 'Full-Stack-Entwickler', 'Desarrollador Full Stack', 'Full Stack Developer'),
('Tatiana Charalabidou', 'Account Manager', 'Gestionnaire de comptes', 'Account Manager', 'Gerente de Cuentas', 'Account Manager'),
('Evangelos Drivakos', 'Developer', 'Développeur', 'Entwickler', 'Desarrollador', 'Developer'),
('Darya Krupskaya', 'Graphic Designer', 'Graphiste', 'Grafikdesigner', 'Diseñador Gráfico', 'Graphic Designer'),
('Panagiotis Karnachoritis', 'Full Stack Developer', 'Développeur Full Stack', 'Full-Stack-Entwickler', 'Desarrollador Full Stack', 'Full Stack Developer'),
('Michalis Plakiotis', 'Full Stack Developer', 'Développeur Full Stack', 'Full-Stack-Entwickler', 'Desarrollador Full Stack', 'Full Stack Developer'),
('Natalia Votsi', 'Digital Marketer', 'Marketeur Digital', 'Digital Marketer', 'Marketer Digital', 'Digital Marketer'),
('Evan Xidous', 'SEO Manager', 'Responsable SEO', 'SEO-Manager', 'Gerente SEO', 'SEO Manager'),
('Andreas Mprikos', 'Graphic Designer', 'Graphiste', 'Grafikdesigner', 'Diseñador Gráfico', 'Graphic Designer'),
('Zois Karabelas', 'Marketing Account Manager', 'Responsable comptes marketing', 'Marketing Account Manager', 'Gerente de Cuentas de Marketing', 'Marketing Account Manager'),
('Elias Sdogos', 'Full Stack Developer', 'Développeur Full Stack', 'Full-Stack-Entwickler', 'Desarrollador Full Stack', 'Full Stack Developer'),
('Piro Zani', 'Web Developer', 'Développeur Web', 'Webentwickler', 'Desarrollador Web', 'Web Developer'),
('Tryfon Avrantinis', 'Marketeer', 'Marketeur', 'Marketeer', 'Mercadólogo', 'Marketeer'),
('Emanuil Nikai', 'Project Manager Assistant', 'Assistant Chef de projet', 'Projektmanager-Assistent', 'Asistente de Gerente de Proyecto', 'Project Manager Assistant'),
('John Batas', 'Senior Integration Developer', 'Développeur Intégration Senior', 'Senior Integration-Entwickler', 'Desarrollador Senior de Integración', 'Senior Integration Developer'),
('John Dellis', 'Senior Front End Developer', 'Développeur Front-End Senior', 'Senior Front-End-Entwickler', 'Desarrollador Front End Senior', 'Senior Front End Developer');

-- Update all team members with new job titles using exact name matching
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio, role_description)
SELECT 
  tm.id,
  l.id as language_id,
  ttu.name,
  CASE l.code
    WHEN 'en' THEN ttu.title_en
    WHEN 'fr' THEN ttu.title_fr
    WHEN 'de' THEN ttu.title_de
    WHEN 'es' THEN ttu.title_es
    WHEN 'el' THEN ttu.title_el
  END as job_title,
  COALESCE(existing.bio, '') as bio,
  COALESCE(existing.role_description, '') as role_description
FROM temp_team_updates ttu
CROSS JOIN languages l
JOIN team_members tm ON tm.id IN (
  SELECT DISTINCT team_member_id 
  FROM team_member_translations tmt 
  WHERE LOWER(TRIM(tmt.name)) = LOWER(TRIM(ttu.name))
  LIMIT 1
)
LEFT JOIN team_member_translations existing ON tm.id = existing.team_member_id AND l.id = existing.language_id
WHERE l.code IN ('en', 'fr', 'de', 'es', 'el')
ON CONFLICT (team_member_id, language_id) 
DO UPDATE SET 
  job_title = EXCLUDED.job_title,
  name = EXCLUDED.name;

-- Also try fuzzy matching for common name variations
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio, role_description)
SELECT 
  tm.id,
  l.id as language_id,
  ttu.name,
  CASE l.code
    WHEN 'en' THEN ttu.title_en
    WHEN 'fr' THEN ttu.title_fr
    WHEN 'de' THEN ttu.title_de
    WHEN 'es' THEN ttu.title_es
    WHEN 'el' THEN ttu.title_el
  END as job_title,
  COALESCE(existing.bio, '') as bio,
  COALESCE(existing.role_description, '') as role_description
FROM temp_team_updates ttu
CROSS JOIN languages l
JOIN team_members tm ON tm.id IN (
  SELECT DISTINCT team_member_id 
  FROM team_member_translations tmt 
  WHERE (
    -- Handle common name variations
    (ttu.name = 'Panagiotis Kollaras' AND (LOWER(tmt.name) LIKE '%panos%kollaras%' OR LOWER(tmt.name) LIKE '%panagiotis%kollaras%')) OR
    (ttu.name = 'Yiorgos Blatsis' AND (LOWER(tmt.name) LIKE '%yiorgos%blatsis%' OR LOWER(tmt.name) LIKE '%giorgos%blatsis%')) OR
    (ttu.name = 'George Hatzopoulos' AND (LOWER(tmt.name) LIKE '%george%hatzopoulos%' OR LOWER(tmt.name) LIKE '%giorgos%hatzopoulos%')) OR
    -- Add more name variations as needed
    LOWER(TRIM(tmt.name)) = LOWER(TRIM(ttu.name))
  )
  LIMIT 1
)
LEFT JOIN team_member_translations existing ON tm.id = existing.team_member_id AND l.id = existing.language_id
WHERE l.code IN ('en', 'fr', 'de', 'es', 'el')
ON CONFLICT (team_member_id, language_id) 
DO UPDATE SET 
  job_title = EXCLUDED.job_title,
  name = EXCLUDED.name;

-- Clean up temporary table
DROP TABLE temp_team_updates;

-- Create an RPC function to get all team members with admin access for verification
CREATE OR REPLACE FUNCTION get_all_team_members_admin(p_language_code varchar DEFAULT 'en')
RETURNS TABLE(
  id uuid,
  name varchar,
  job_position varchar,
  bio text,
  image_url text,
  linkedin_url text,
  display_order integer,
  is_leadership boolean,
  role_description text,
  achievements text[],
  specializations text[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
    COALESCE(tmt.name, 'Unknown Member') as name,
    COALESCE(tmt.job_title, 'Team Member') as job_position,
    COALESCE(tmt.bio, '') as bio,
    tm.image_url,
    tm.linkedin_url,
    tm.display_order,
    tm.is_leadership,
    COALESCE(tmt.role_description, '') as role_description,
    tm.achievements,
    tm.specializations
  FROM public.team_members tm
  LEFT JOIN public.team_member_translations tmt 
    ON tm.id = tmt.team_member_id 
    AND tmt.language_id = v_language_id
  ORDER BY tm.display_order ASC NULLS LAST, tmt.name ASC;
END;
$$;