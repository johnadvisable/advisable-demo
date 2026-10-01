UPDATE insights_translations
SET content = REPLACE(
    content,
    '<p>In other words: How to build a usable product has been methodologically defined for decades.</p>',
    E'<p>In other words:</p>\n\n<p><strong>How to build a usable product has been methodologically defined for decades.</strong></p>'
)
WHERE insights_id = (SELECT id FROM insights WHERE slug = 'how-to-validate-your-startup-idea-before-building-anything')
AND language_id = 1;