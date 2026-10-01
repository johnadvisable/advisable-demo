UPDATE public.insights_translations
SET content = 
  REPLACE(
    content,
    '<p><strong>The constraint:</strong> This person needs to be genuinely senior, capable of making architectural decisions independently and catching AI-generated errors in technical output. The leverage multiplies experience; it does not replace it.</p>',
    '<p>What the human handles:<br />Everything that matters. Which market to enter, which product bet to make, which partnership to pursue, how to respond to unexpected competitive moves, and what the company should become.</p>'
  )
WHERE insights_id = '6162fbfc-d15f-460a-8b2e-f844eaa86004' AND language_id = 1;