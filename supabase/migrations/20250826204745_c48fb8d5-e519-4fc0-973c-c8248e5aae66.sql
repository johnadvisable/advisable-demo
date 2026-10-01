-- Move all clients from non-standard categories to Digital Agency Services
UPDATE clients 
SET product_category = 'Digital Agency Services' 
WHERE product_category IN ('E-commerce', 'Healthcare', 'Other', 'Professional Services');

-- Also update any client categories that reference the old categories
UPDATE client_categories 
SET category = 'Digital Agency Services' 
WHERE category IN ('E-commerce', 'Healthcare', 'Other', 'Professional Services');