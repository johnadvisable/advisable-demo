
-- Remove the prepended img tag from content since featured_image already renders it
UPDATE insights_translations
SET content = REPLACE(
  content, 
  '<img src="/images/insights/ai-powered-growth-stack-ecommerce-2026.png" alt="Building an AI-Powered Growth Stack for E-Commerce in 2026" style="width:100%;border-radius:8px;margin-bottom:1.5rem;" />', 
  ''
)
WHERE insights_id = (SELECT id FROM insights WHERE slug = 'ai-powered-growth-stack-ecommerce-2026')
  AND language_id = 1;
