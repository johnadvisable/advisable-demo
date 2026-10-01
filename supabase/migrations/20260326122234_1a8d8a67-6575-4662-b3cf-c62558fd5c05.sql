UPDATE insights_translations
SET content = REPLACE(
    content,
    '<p><strong>Measure:</strong></p>',
    '<p>Measure:</p>'
)
WHERE insights_id = (SELECT id FROM insights WHERE slug = 'how-to-validate-your-startup-idea-before-building-anything')
AND language_id = 1;