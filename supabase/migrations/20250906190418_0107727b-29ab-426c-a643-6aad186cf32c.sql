-- Fix service category names and descriptions that are currently swapped

-- Update service_categories table
UPDATE service_categories 
SET 
  name = 'Digital Agency Services',
  description = 'Full-service digital agency solutions'
WHERE slug = 'digital-agency';

UPDATE service_categories 
SET 
  name = 'Venture Studio Services', 
  description = 'Venture studio and startup incubation services'
WHERE slug = 'venture-studio';

-- Update service_category_translations table for English (language_id = 1)
UPDATE service_category_translations sct
SET 
  name = 'Digital Agency Services',
  description = 'Full-service digital agency solutions'
FROM service_categories sc
WHERE sct.category_id = sc.id 
  AND sc.slug = 'digital-agency'
  AND sct.language_id = 1;

UPDATE service_category_translations sct
SET 
  name = 'Venture Studio Services',
  description = 'Venture studio and startup incubation services'  
FROM service_categories sc
WHERE sct.category_id = sc.id 
  AND sc.slug = 'venture-studio'
  AND sct.language_id = 1;