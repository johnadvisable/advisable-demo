
UPDATE insights_translations
SET content = REPLACE(
  content,
  '<h2>The Integration Layer: Why Wiring Matters More Than Tool Selection</h2>',
  '<img src="/images/insights/ai-growth-stack-dashboard-2026.png" alt="AI-powered e-commerce growth stack dashboard showing conversion, retention, and operations metrics" style="width:100%;border-radius:8px;margin:2rem 0;" />' || chr(10) || '<h2>The Integration Layer: Why Wiring Matters More Than Tool Selection</h2>'
)
WHERE insights_id = (SELECT id FROM insights WHERE slug = 'ai-powered-growth-stack-ecommerce-2026')
  AND language_id = 1;
