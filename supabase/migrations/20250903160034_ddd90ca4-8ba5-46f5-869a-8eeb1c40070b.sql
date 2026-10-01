-- Update team members job titles and add missing translations
-- Drop existing function first to avoid conflicts

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_all_team_members_admin(character varying);
DROP FUNCTION IF EXISTS get_all_team_members_public_safe(character varying);

-- Create a temporary function to help with name matching
CREATE OR REPLACE FUNCTION find_team_member_by_name(search_name TEXT)
RETURNS UUID AS $$
DECLARE
  member_id UUID;
BEGIN
  -- Try exact match first
  SELECT DISTINCT team_member_id INTO member_id
  FROM team_member_translations 
  WHERE LOWER(name) = LOWER(search_name)
  LIMIT 1;
  
  IF member_id IS NOT NULL THEN
    RETURN member_id;
  END IF;
  
  -- Try partial matches
  SELECT DISTINCT team_member_id INTO member_id
  FROM team_member_translations 
  WHERE LOWER(name) LIKE '%' || LOWER(split_part(search_name, ' ', 1)) || '%'
    AND LOWER(name) LIKE '%' || LOWER(split_part(search_name, ' ', 2)) || '%'
  LIMIT 1;
  
  RETURN member_id;
END;
$$ LANGUAGE plpgsql;

-- Update all team member translations based on JSON data
WITH team_data AS (
  SELECT name, title_en, title_fr, title_de, title_es, title_el FROM (
    VALUES 
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
    ('John Dellis', 'Senior Front End Developer', 'Développeur Front-End Senior', 'Senior Front-End-Entwickler', 'Desarrollador Front End Senior', 'Senior Front End Developer')
  ) AS team_info(name, title_en, title_fr, title_de, title_es, title_el)
)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio, role_description)
SELECT 
  find_team_member_by_name(td.name) as team_member_id,
  l.id as language_id,
  td.name,
  CASE l.code
    WHEN 'en' THEN td.title_en
    WHEN 'fr' THEN td.title_fr
    WHEN 'de' THEN td.title_de
    WHEN 'es' THEN td.title_es
    WHEN 'el' THEN td.title_el
  END as job_title,
  COALESCE(existing.bio, '') as bio,
  COALESCE(existing.role_description, '') as role_description
FROM team_data td
CROSS JOIN languages l
LEFT JOIN team_member_translations existing ON find_team_member_by_name(td.name) = existing.team_member_id AND l.id = existing.language_id
WHERE l.code IN ('en', 'fr', 'de', 'es', 'el')
  AND find_team_member_by_name(td.name) IS NOT NULL
ON CONFLICT (team_member_id, language_id) 
DO UPDATE SET 
  job_title = EXCLUDED.job_title,
  name = EXCLUDED.name;

-- Clean up temporary function
DROP FUNCTION find_team_member_by_name(TEXT);