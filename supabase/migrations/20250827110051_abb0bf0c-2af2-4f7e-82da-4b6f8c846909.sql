-- Step 1: Fix category typo
UPDATE partner_categories 
SET 
  name = 'Integrations',
  description = 'Third-party system integrations and APIs'
WHERE name = 'Intergration';

-- Step 2: Insert missing categories (check if they exist first)
DO $$
BEGIN
  -- AI & Machine Learning
  IF NOT EXISTS (SELECT 1 FROM partner_categories WHERE name = 'AI & Machine Learning') THEN
    INSERT INTO partner_categories (name, description, display_order) 
    VALUES ('AI & Machine Learning', 'Artificial intelligence and machine learning platforms', 1);
  END IF;
  
  -- Development Tools
  IF NOT EXISTS (SELECT 1 FROM partner_categories WHERE name = 'Development Tools') THEN
    INSERT INTO partner_categories (name, description, display_order) 
    VALUES ('Development Tools', 'Software development and coding tools', 2);
  END IF;
  
  -- Digital Marketing
  IF NOT EXISTS (SELECT 1 FROM partner_categories WHERE name = 'Digital Marketing') THEN
    INSERT INTO partner_categories (name, description, display_order) 
    VALUES ('Digital Marketing', 'Marketing automation and advertising platforms', 3);
  END IF;
  
  -- Cloud Services
  IF NOT EXISTS (SELECT 1 FROM partner_categories WHERE name = 'Cloud Services') THEN
    INSERT INTO partner_categories (name, description, display_order) 
    VALUES ('Cloud Services', 'Cloud hosting and infrastructure services', 4);
  END IF;
  
  -- Technology Partners
  IF NOT EXISTS (SELECT 1 FROM partner_categories WHERE name = 'Technology Partners') THEN
    INSERT INTO partner_categories (name, description, display_order) 
    VALUES ('Technology Partners', 'Strategic technology partnerships', 5);
  END IF;
  
  -- Integrations (ensure it exists after the update)
  IF NOT EXISTS (SELECT 1 FROM partner_categories WHERE name = 'Integrations') THEN
    INSERT INTO partner_categories (name, description, display_order) 
    VALUES ('Integrations', 'Third-party system integrations and APIs', 6);
  END IF;
END $$;

-- Step 3: Update partner names to standardize them
UPDATE partners SET name = 'OpenAI' WHERE name = 'OPEN AI';
UPDATE partners SET name = 'SALESmanago' WHERE name = 'Sales manago';
UPDATE partners SET name = 'Similarweb' WHERE name = 'Similar Web';
UPDATE partners SET name = 'Bitbucket' WHERE name = 'bitbucket';
UPDATE partners SET name = 'Hetzner' WHERE name = 'hetzner';
UPDATE partners SET name = 'Leaseweb' WHERE name = 'leaseweb';