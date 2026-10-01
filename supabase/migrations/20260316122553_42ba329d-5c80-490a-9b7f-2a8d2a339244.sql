
UPDATE insights_translations
SET content = replace(
  content,
  '<h2>Signal 4: You can Cross the 40% Product-Market Fit Threshold</h2>',
  '<img src="/images/insights/market-proof-40-percent-threshold.png" alt="40% Product-Market Fit Threshold - Sean Ellis Test benchmark chart showing Very disappointed, Somewhat disappointed, and Not disappointed response categories" style="width:100%;border-radius:8px;margin:2rem 0" />' || chr(10) || '<h2>Signal 4: You can Cross the 40% Product-Market Fit Threshold</h2>'
)
WHERE insights_id = (SELECT id FROM insights WHERE slug = 'market-proof-checklist-7-signals-startup-idea-ready-to-build');
