UPDATE insights_translations
SET content = REPLACE(
    content,
    E'<p><strong>Clicks measure interest.</strong></p>\n\n<p><strong>Payments measure commitment.</strong></p>',
    '<p>Clicks measure interest, while payments measure commitment.</p>'
)
WHERE insights_id = (SELECT id FROM insights WHERE slug = 'how-to-validate-your-startup-idea-before-building-anything')
AND language_id = 1;