
UPDATE insights_translations
SET content = replace(
  content,
  '<h2>TL;DR</h2>
<p>',
  '<p><strong>TL;DR:</strong> '
)
WHERE insights_id = (SELECT id FROM insights WHERE slug = 'ai-powered-growth-stack-ecommerce-2026')
AND content LIKE '%<h2>TL;DR</h2>%';
