-- Update partner_categories table with proper names based on descriptions
UPDATE partner_categories 
SET name = CASE 
  WHEN description LIKE '%Technology and software integration%' THEN 'Technology Partners'
  WHEN description LIKE '%Cloud infrastructure%' THEN 'Cloud Services'
  WHEN description LIKE '%Artificial Intelligence%' THEN 'AI & Machine Learning'
  WHEN description LIKE '%Digital marketing%' THEN 'Digital Marketing'
  WHEN description LIKE '%Software development%' THEN 'Development Tools'
  WHEN description LIKE '%Communication and collaboration%' THEN 'Communication Tools'
  ELSE 'Uncategorized'
END
WHERE name = 'Uncategorized' OR name = '' OR name IS NULL;

-- Get the default language ID
DO $$
DECLARE
  default_lang_id INTEGER;
  category_record RECORD;
BEGIN
  -- Get default language ID
  SELECT id INTO default_lang_id FROM languages WHERE is_default = TRUE LIMIT 1;
  
  -- If no default language, use the first active language
  IF default_lang_id IS NULL THEN
    SELECT id INTO default_lang_id FROM languages WHERE is_active = TRUE LIMIT 1;
  END IF;
  
  -- Insert translations for each category
  FOR category_record IN SELECT id, name, description FROM partner_categories LOOP
    INSERT INTO partner_category_translations (
      partner_category_id, 
      language_id, 
      name, 
      description
    ) VALUES (
      category_record.id,
      default_lang_id,
      category_record.name,
      category_record.description
    ) ON CONFLICT (partner_category_id, language_id) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description;
  END LOOP;
END $$;