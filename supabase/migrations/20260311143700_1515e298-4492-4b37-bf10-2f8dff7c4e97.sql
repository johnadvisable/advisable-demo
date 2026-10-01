UPDATE public.insights_translations
SET content = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                content,
                '<p>AI enables developers to complete valuable work faster, but instead of the reclaimed time being directed to higher-value architectural work, it gets absorbed by lower-value tasks, generating more code, shipping more features, filling the available time with output rather than quality.</p>',
                '<p><strong>AI enables developers to complete valuable work faster, but instead of the reclaimed time being directed to higher-value architectural work, it gets absorbed by lower-value tasks,</strong> generating more code, shipping more features, filling the available time with output rather than quality.</p>'
              ),
              '<p>The first governance principle is measuring what actually matters.',
              '<p><strong>The first governance principle is measuring what actually matters.</strong>'
            ),
            'McKinsey''s recommendation, treating technical debt as a business issue with P&amp;L ownership rather than a technology housekeeping problem, applies',
            '<strong>McKinsey''s recommendation, treating technical debt as a business issue with P&amp;L ownership rather than a technology housekeeping problem,</strong> applies'
          ),
          '<p>The second principle is distinguishing where AI assistance actually helps.',
          '<p><strong>The second principle is distinguishing where AI assistance actually helps.</strong>'
        ),
        '<p>The third principle is maintaining refactoring as a first-class engineering activity.',
        '<p><strong>The third principle is maintaining refactoring as a first-class engineering activity.</strong>'
      ),
      '<p>The fourth principle is code review discipline at scale.',
      '<p><strong>The fourth principle is code review discipline at scale.</strong>'
    ),
    '<p>The fifth principle is governance at the organisational level, not just the team level.',
    '<p><strong>The fifth principle is governance at the organisational level, not just the team level.</strong>'
  ),
  '<p>Engineering and product leaders who are deploying AI coding tools in 2026 are making decisions that will determine the structural health of their codebases in 2028 and beyond.</p>',
  '<p><strong>Engineering and product leaders who are deploying AI coding tools in 2026 are making decisions that will determine the structural health of their codebases in 2028 and beyond.</strong></p>'
)
WHERE id = 'bedd0412-6588-4ec6-8776-717e3efce55e';
