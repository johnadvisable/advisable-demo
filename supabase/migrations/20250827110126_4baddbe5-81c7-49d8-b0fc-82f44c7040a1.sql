-- Step 4: Update partner descriptions in partner_translations
-- First, get the English language ID and update descriptions
WITH english_lang AS (
  SELECT id as lang_id FROM languages WHERE code = 'en' LIMIT 1
),
partner_updates AS (
  SELECT 
    p.id as partner_id,
    el.lang_id,
    CASE p.name
      WHEN 'OpenAI' THEN 'AI research & language models'
      WHEN 'Fedra' THEN 'Google CSS, 20% CPC discount'
      WHEN 'SALESmanago' THEN 'AI customer data platform'
      WHEN 'Google' THEN 'Cloud, ads & analytics'
      WHEN 'Facebook' THEN 'Social ads & commerce'
      WHEN 'Instagram' THEN 'Social media shopping'
      WHEN 'Taboola' THEN 'Native advertising network'
      WHEN 'Mailchimp' THEN 'Email marketing platform'
      WHEN 'Asana' THEN 'Project management tool'
      WHEN 'Bitbucket' THEN 'Git code repository'
      WHEN 'BunnyCDN' THEN 'Content delivery network'
      WHEN 'Hetzner' THEN 'Hosting & cloud provider'
      WHEN 'Leaseweb' THEN 'Global hosting services'
      WHEN 'Softone' THEN 'ERP software Greece'
      WHEN 'Entersoft' THEN 'ERP & CRM suite'
      WHEN 'Smartware' THEN 'Retail ERP solutions'
      WHEN 'CSA' THEN 'ERP & business software'
      WHEN 'Ilyda' THEN 'ERP retail systems'
      WHEN 'Similarweb' THEN 'Web traffic analytics'
      WHEN 'Nosto' THEN 'AI personalization engine'
      WHEN 'Google Analytics' THEN 'Web analytics'
      WHEN 'DoubleClick' THEN 'Ad campaign manager'
      WHEN 'Data Studio' THEN 'Data visualization'
      WHEN 'OneSignal' THEN 'Push notifications'
      WHEN 'Outgrow' THEN 'Interactive content tools'
      WHEN 'Lavinet' THEN 'Cloud IT provider'
      WHEN 'Pinterest' THEN 'Visual ads platform'
      WHEN 'ProveSource' THEN 'Social proof widget'
      WHEN 'Retargeting' THEN 'AI remarketing platform'
      WHEN 'Criteo' THEN 'AI ad retargeting'
      ELSE 'Technology partner integration'
    END as description
  FROM partners p
  CROSS JOIN english_lang el
)
INSERT INTO partner_translations (partner_id, language_id, description)
SELECT partner_id, lang_id, description FROM partner_updates
WHERE partner_id IN (SELECT id FROM partners)
ON CONFLICT (partner_id, language_id) 
DO UPDATE SET description = EXCLUDED.description;

-- Step 5: Clear existing partner category assignments and reassign them
DELETE FROM partner_partner_categories;

-- Reassign categories based on the new mapping
INSERT INTO partner_partner_categories (partner_id, category)
SELECT p.id, 'AI & Machine Learning'
FROM partners p
WHERE p.name IN ('OpenAI', 'SALESmanago', 'Nosto', 'Retargeting', 'Criteo')

UNION ALL

SELECT p.id, 'Development Tools'
FROM partners p
WHERE p.name IN ('OpenAI', 'Asana', 'Bitbucket', 'BunnyCDN', 'Similarweb')

UNION ALL

SELECT p.id, 'Digital Marketing'
FROM partners p
WHERE p.name IN ('Google', 'Facebook', 'Instagram', 'Taboola', 'Mailchimp', 'Asana', 'Google Analytics', 'DoubleClick', 'Data Studio', 'OneSignal', 'Outgrow')

UNION ALL

SELECT p.id, 'Cloud Services'
FROM partners p
WHERE p.name IN ('Google', 'BunnyCDN', 'Hetzner', 'Leaseweb')

UNION ALL

SELECT p.id, 'Technology Partners'
FROM partners p
WHERE p.name IN ('Fedra', 'Bitbucket', 'Hetzner', 'Leaseweb', 'Lavinet')

UNION ALL

SELECT p.id, 'Integrations'
FROM partners p
WHERE p.name IN ('Fedra', 'SALESmanago', 'Facebook', 'Instagram', 'Taboola', 'Mailchimp', 'Softone', 'Entersoft', 'Smartware', 'CSA', 'Ilyda', 'Nosto', 'Google Analytics', 'DoubleClick', 'Data Studio', 'OneSignal', 'Outgrow', 'Pinterest', 'ProveSource', 'Retargeting', 'Criteo');