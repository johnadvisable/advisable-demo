UPDATE insights_translations
SET content = REPLACE(
    content,
    E'<p><strong>Interviews are evaluation.</strong></p>\n\n<p><strong>Compliments are evaluation.</strong></p>\n\n<p><strong>Surveys are evaluation.</strong></p>\n\n<p><strong>Commitment is validation.</strong></p>\n\n<p><strong>Payment is stronger validation.</strong></p>\n\n<p><strong>Retention is the strongest signal of all.</strong></p>\n\n<p><strong>The difference between feeling validated and being validated is where real startups are built.</strong></p>',
    E'<p>Interviews are evaluation.<br>Compliments are evaluation.<br>Surveys are evaluation.</p>\n\n<p>Commitment is validation.</p>\n\n<p>Payment is stronger validation.</p>\n\n<p>Retention is the strongest signal of all.</p>\n\n<p>The difference between feeling validated and being validated is where real startups are built.</p>'
)
WHERE insights_id = (SELECT id FROM insights WHERE slug = 'how-to-validate-your-startup-idea-before-building-anything')
AND language_id = 1;