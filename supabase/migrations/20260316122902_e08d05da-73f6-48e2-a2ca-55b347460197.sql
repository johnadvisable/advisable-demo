
UPDATE insights_translations
SET content = replace(
  content,
  '<h2>TL;DR</h2>
<p>Most startups don''t fail because they built badly, they fail because they built the wrong thing.',
  '<p><strong>TL;DR:</strong> Most startups don''t fail because they built badly, they fail because they built the wrong thing.'
)
WHERE insights_id = (SELECT id FROM insights WHERE slug = 'market-proof-checklist-7-signals-startup-idea-ready-to-build');
