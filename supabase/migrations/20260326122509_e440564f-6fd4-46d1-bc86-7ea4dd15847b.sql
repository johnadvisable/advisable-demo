UPDATE insights_translations
SET content = REPLACE(
    content,
    'is actually evaluation — interviews, surveys, and feedback',
    'is actually evaluation: interviews, surveys, and feedback'
)
WHERE insights_id = (SELECT id FROM insights WHERE slug = 'how-to-validate-your-startup-idea-before-building-anything')
AND language_id = 1;