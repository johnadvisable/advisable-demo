UPDATE public.insights_translations
SET content = 
  REPLACE(
  REPLACE(
  REPLACE(
    content,
    '<p>What AI handles:</p>

<p>Code generation, testing, documentation, bug triage, technical specifications, architecture review for standard patterns, QA of non-critical paths.</p>

<p>What the human handles:</p>

<p>Architecture decisions for novel problems, product strategy, user research synthesis, prioritization, and the judgment calls on what to build next and why.</p>

<p>What the human handles:<br />Everything that matters. Which market to enter, which product bet to make, which partnership to pursue, how to respond to unexpected competitive moves, and what the company should become.</p>',
    '<p><strong>What AI handles:</strong> Code generation, testing, documentation, bug triage, technical specifications, architecture review for standard patterns, QA of non-critical paths.</p>

<p><strong>What the human handles:</strong> Architecture decisions for novel problems, product strategy, user research synthesis, prioritization, and the judgment calls on what to build next and why.</p>

<p><strong>The constraint:</strong> This person needs to be genuinely senior, capable of making architectural decisions independently and catching AI-generated errors in technical output. The leverage multiplies experience; it does not replace it.</p>'),
    'What AI handles: ',
    '</p><p><strong>What AI handles:</strong> '),
    'What the human handles: ',
    '</p><p><strong>What the human handles:</strong> ')
WHERE insights_id = '6162fbfc-d15f-460a-8b2e-f844eaa86004' AND language_id = 1;