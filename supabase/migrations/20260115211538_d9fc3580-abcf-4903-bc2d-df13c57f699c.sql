
-- Make AI Web & App Development a parent service
UPDATE services 
SET is_parent = true, parent_service_id = NULL
WHERE slug = 'ai-web-app-development';

-- Get the ID of AI Web & App Development and update children
WITH parent AS (
  SELECT id FROM services WHERE slug = 'ai-web-app-development'
)
UPDATE services 
SET parent_service_id = (SELECT id FROM parent)
WHERE slug IN (
  'web-development',
  'mobile-app-development', 
  'ai-automations-agents',
  'ecommerce-solutions',
  'ai-mvp-build'
);

-- Also remove these from Conversion & Revenue Optimization parent
-- They should only be under AI Web & App Development now
