UPDATE insights_translations
SET content = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(
        content,
        E'<p>Commitment is validation.</p>\n\n<p>Payment is stronger validation.</p>\n\n<p>Retention is the strongest signal of all.</p>',
        E'<p>Commitment is validation.<br>Payment is stronger validation.<br>Retention is the strongest signal of all.</p>'
      ),
      'two domains that startup discourse often merges: product building and business administration.',
      'two domains that startup discourse often merges: <strong>product building</strong> and <strong>business administration</strong>.'
    ),
    'the field of Human–Computer Interaction (HCI) had already established structured approaches to research, usability testing, prototyping, and iterative design. From the 1970s onward, user-centered design matured into formal engineering practice.',
    'the field of <strong>Human–Computer Interaction (HCI)</strong> had already established structured approaches to research, usability testing, prototyping, and iterative design. From the 1970s onward, user-centered design matured into formal engineering practice.'
  ),
  E'<p><strong>Real validation requires risk.</strong></p>\n\n<p><strong>It requires commitment.</strong></p>\n\n<p><strong>It requires skin in the game.</strong></p>',
  E'<p>Real validation requires risk.<br>It requires commitment.<br>It requires skin in the game.</p>'
)
WHERE insights_id = (SELECT id FROM insights WHERE slug = 'how-to-validate-your-startup-idea-before-building-anything')
AND language_id = 1;