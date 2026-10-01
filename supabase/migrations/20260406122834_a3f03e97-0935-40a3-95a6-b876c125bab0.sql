UPDATE public.insights_translations
SET content = REPLACE(
  content,
  '<ul>
<li>how your product integrates with AI, and</li>
<li>how AI integrates with your product?</li>
</ul>',
  '<p>How your product integrates with AI, and how AI integrates with your product?</p>'
)
WHERE id = '572c99f3-56bb-4365-ab72-890f4af46149';