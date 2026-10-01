-- Update team members job titles and add missing translations
-- Drop existing function first to avoid conflicts
DROP FUNCTION IF EXISTS get_all_team_members_admin(varchar);

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

-- Update existing team members with new job titles using exact name matching
WITH matched_members AS (
  SELECT DISTINCT 
    ttu.name as new_name,
    ttu.title_en,
    ttu.title_fr, 
    ttu.title_de,
    ttu.title_es,
    ttu.title_el,
    tm.id as team_member_id
  FROM temp_team_updates ttu
  JOIN team_member_translations tmt ON LOWER(TRIM(tmt.name)) = LOWER(TRIM(ttu.name))
  JOIN team_members tm ON tm.id = tmt.team_member_id
)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio, role_description)
SELECT 
  mm.team_member_id,
  l.id as language_id,
  mm.new_name,
  CASE l.code
    WHEN 'en' THEN mm.title_en
    WHEN 'fr' THEN mm.title_fr
    WHEN 'de' THEN mm.title_de
    WHEN 'es' THEN mm.title_es
    WHEN 'el' THEN mm.title_el
  END as job_title,
  COALESCE(existing.bio, '') as bio,
  COALESCE(existing.role_description, '') as role_description
FROM matched_members mm
CROSS JOIN languages l
LEFT JOIN team_member_translations existing ON mm.team_member_id = existing.team_member_id AND l.id = existing.language_id
WHERE l.code IN ('en', 'fr', 'de', 'es', 'el')
ON CONFLICT (team_member_id, language_id) 
DO UPDATE SET 
  job_title = EXCLUDED.job_title,
  name = EXCLUDED.name;

-- Handle name variations for members not matched exactly
WITH fuzzy_matched_members AS (
  SELECT DISTINCT 
    ttu.name as new_name,
    ttu.title_en,
    ttu.title_fr, 
    ttu.title_de,
    ttu.title_es,
    ttu.title_el,
    tm.id as team_member_id
  FROM temp_team_updates ttu
  JOIN team_member_translations tmt ON (
    (ttu.name = 'Panagiotis Kollaras' AND LOWER(tmt.name) LIKE '%panos%') OR
    (ttu.name = 'Yiorgos Blatsis' AND LOWER(tmt.name) LIKE '%giorgos%') OR
    (ttu.name = 'George Hatzopoulos' AND LOWER(tmt.name) LIKE '%giorgos%')
  )
  JOIN team_members tm ON tm.id = tmt.team_member_id
)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio, role_description)
SELECT 
  fmm.team_member_id,
  l.id as language_id,
  fmm.new_name,
  CASE l.code
    WHEN 'en' THEN fmm.title_en
    WHEN 'fr' THEN fmm.title_fr
    WHEN 'de' THEN fmm.title_de
    WHEN 'es' THEN fmm.title_es
    WHEN 'el' THEN fmm.title_el
  END as job_title,
  COALESCE(existing.bio, '') as bio,
  COALESCE(existing.role_description, '') as role_description
FROM fuzzy_matched_members fmm
CROSS JOIN languages l
LEFT JOIN team_member_translations existing ON fmm.team_member_id = existing.team_member_id AND l.id = existing.language_id
WHERE l.code IN ('en', 'fr', 'de', 'es', 'el')
ON CONFLICT (team_member_id, language_id) 
DO UPDATE SET 
  job_title = EXCLUDED.job_title,
  name = EXCLUDED.name;

-- Clean up temporary table
DROP TABLE temp_team_updates;