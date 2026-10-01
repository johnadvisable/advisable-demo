-- Fix partner_categories table structure
ALTER TABLE partner_categories 
ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT 'Uncategorized',
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add some default partner categories with proper structure
INSERT INTO partner_categories (name, description, display_order) VALUES
('Technology Partners', 'Technology and software integration partners', 0),
('Cloud Services', 'Cloud infrastructure and service providers', 1),
('AI/ML Tools', 'Artificial Intelligence and Machine Learning platforms', 2),
('Marketing Tools', 'Digital marketing and analytics platforms', 3),
('Development Tools', 'Software development and deployment tools', 4),
('Communication', 'Communication and collaboration platforms', 5)
ON CONFLICT (name) DO NOTHING;

-- Update existing partners to be featured and ensure they have translation entries
UPDATE partners SET featured = true WHERE featured = false;

-- Ensure all partners have entries in partner_translations table
INSERT INTO partner_translations (partner_id, language_id, name, description, use_case)
SELECT 
  p.id,
  1 as language_id, -- English
  p.name,
  COALESCE('Integration with ' || p.name, 'Partner integration') as description,
  COALESCE('Seamlessly integrate with ' || p.name || ' to enhance your business capabilities.', 'Integration benefits') as use_case
FROM partners p
WHERE NOT EXISTS (
  SELECT 1 FROM partner_translations pt 
  WHERE pt.partner_id = p.id AND pt.language_id = 1
);

-- Update partners category to use proper category names
UPDATE partners 
SET category = 'Technology Partners' 
WHERE category IS NULL OR category = '';