-- Update metrics table to reflect 250+ clients
UPDATE metrics SET value = 250 WHERE key = 'companies';

-- Update company_facts for projects_delivered to 250+
UPDATE company_facts SET value = '250+' WHERE key = 'projects_delivered';

-- Update company_info_translations for all languages with 250+ clients
UPDATE company_info_translations 
SET content = REPLACE(content, '150 clients', '250+ clients')
WHERE content LIKE '%150 clients%';

UPDATE company_info_translations 
SET content = REPLACE(content, '150+ projects', '250+ projects')
WHERE content LIKE '%150+ projects%';

UPDATE company_info_translations 
SET content = REPLACE(content, '150+ έργα', '250+ έργα')
WHERE content LIKE '%150+ έργα%';

UPDATE company_info_translations 
SET content = REPLACE(content, '150 πελάτες', '250+ πελάτες')
WHERE content LIKE '%150 πελάτες%';

UPDATE company_info_translations 
SET content = REPLACE(content, '500 projects', '250+ projects')
WHERE content LIKE '%500 projects%';

-- Update clients_translations case study content
UPDATE clients_translations 
SET case_study_solution = REPLACE(case_study_solution, '150+', '250+')
WHERE case_study_solution LIKE '%150+%';

-- Update any other references in company_fact_translations
UPDATE company_fact_translations 
SET description = REPLACE(description, '150', '250+')
WHERE description LIKE '%150%' AND label LIKE '%project%';

UPDATE company_fact_translations 
SET description = REPLACE(description, '500', '250+')
WHERE description LIKE '%500%' AND label LIKE '%project%';