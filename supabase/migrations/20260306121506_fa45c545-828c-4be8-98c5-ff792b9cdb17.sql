UPDATE insights_translations
SET content = REPLACE(content, '—', ',')
WHERE insights_id = (SELECT id FROM insights WHERE slug = 'ai-powered-growth-stack-ecommerce-2026')
  AND language_id = 1;