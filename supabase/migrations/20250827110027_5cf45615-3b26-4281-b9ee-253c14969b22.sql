-- Step 1: Fix category typo and ensure all required categories exist
UPDATE partner_categories 
SET 
  name = 'Integrations',
  description = 'Third-party system integrations and APIs'
WHERE name = 'Intergration';

-- Insert missing categories if they don't exist
INSERT INTO partner_categories (name, description, display_order) VALUES
  ('AI & Machine Learning', 'Artificial intelligence and machine learning platforms', 1),
  ('Development Tools', 'Software development and coding tools', 2),
  ('Digital Marketing', 'Marketing automation and advertising platforms', 3),
  ('Cloud Services', 'Cloud hosting and infrastructure services', 4),
  ('Technology Partners', 'Strategic technology partnerships', 5),
  ('Integrations', 'Third-party system integrations and APIs', 6)
ON CONFLICT (name) DO NOTHING;

-- Step 2: Update partner names to standardize them
UPDATE partners SET name = 'OpenAI' WHERE name = 'OPEN AI';
UPDATE partners SET name = 'SALESmanago' WHERE name = 'Sales manago';
UPDATE partners SET name = 'Similarweb' WHERE name = 'Similar Web';
UPDATE partners SET name = 'Bitbucket' WHERE name = 'bitbucket';
UPDATE partners SET name = 'Hetzner' WHERE name = 'hetzner';
UPDATE partners SET name = 'Leaseweb' WHERE name = 'leaseweb';

-- Step 3: Update partner descriptions in partner_translations
-- First, get the English language ID
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
ON CONFLICT (partner_id, language_id) 
DO UPDATE SET description = EXCLUDED.description;

-- Step 4: Clear existing partner category assignments and reassign them
DELETE FROM partner_partner_categories;

-- Reassign categories based on the new mapping
WITH category_mappings AS (
  SELECT 
    p.id as partner_id,
    UNNEST(
      CASE p.name
        WHEN 'OpenAI' THEN ARRAY['AI & Machine Learning', 'Development Tools']
        WHEN 'Fedra' THEN ARRAY['Technology Partners', 'Integrations']
        WHEN 'SALESmanago' THEN ARRAY['AI & Machine Learning', 'Integrations']
        WHEN 'Google' THEN ARRAY['Digital Marketing', 'Cloud Services']
        WHEN 'Facebook' THEN ARRAY['Digital Marketing', 'Integrations']
        WHEN 'Instagram' THEN ARRAY['Digital Marketing', 'Integrations']
        WHEN 'Taboola' THEN ARRAY['Digital Marketing', 'Integrations']
        WHEN 'Mailchimp' THEN ARRAY['Digital Marketing', 'Integrations']
        WHEN 'Asana' THEN ARRAY['Digital Marketing', 'Development Tools']
        WHEN 'Bitbucket' THEN ARRAY['Development Tools', 'Technology Partners']
        WHEN 'BunnyCDN' THEN ARRAY['Cloud Services', 'Development Tools']
        WHEN 'Hetzner' THEN ARRAY['Cloud Services', 'Technology Partners']
        WHEN 'Leaseweb' THEN ARRAY['Cloud Services', 'Technology Partners']
        WHEN 'Softone' THEN ARRAY['Integrations']
        WHEN 'Entersoft' THEN ARRAY['Integrations']
        WHEN 'Smartware' THEN ARRAY['Integrations']
        WHEN 'CSA' THEN ARRAY['Integrations']
        WHEN 'Ilyda' THEN ARRAY['Integrations']
        WHEN 'Similarweb' THEN ARRAY['Development Tools']
        WHEN 'Nosto' THEN ARRAY['AI & Machine Learning', 'Integrations']
        WHEN 'Google Analytics' THEN ARRAY['Digital Marketing', 'Integrations']
        WHEN 'DoubleClick' THEN ARRAY['Digital Marketing', 'Integrations']
        WHEN 'Data Studio' THEN ARRAY['Digital Marketing', 'Integrations']
        WHEN 'OneSignal' THEN ARRAY['Digital Marketing', 'Integrations']
        WHEN 'Outgrow' THEN ARRAY['Digital Marketing', 'Integrations']
        WHEN 'Lavinet' THEN ARRAY['Technology Partners']
        WHEN 'Pinterest' THEN ARRAY['Integrations']
        WHEN 'ProveSource' THEN ARRAY['Integrations']
        WHEN 'Retargeting' THEN ARRAY['AI & Machine Learning', 'Integrations']
        WHEN 'Criteo' THEN ARRAY['AI & Machine Learning', 'Integrations']
        ELSE ARRAY['Integrations']
      END
    ) as category_name
  FROM partners p
)
INSERT INTO partner_partner_categories (partner_id, category)
SELECT DISTINCT cm.partner_id, cm.category_name
FROM category_mappings cm
WHERE cm.category_name IS NOT NULL;