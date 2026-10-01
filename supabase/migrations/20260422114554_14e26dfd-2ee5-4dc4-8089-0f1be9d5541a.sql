UPDATE public.insights_translations
SET content = REPLACE(
  REPLACE(
    REPLACE(
      content,
      '<p>The constraint: Content volume without strategic coherence is noise. The human who owns this system needs to understand the narrative the company is trying to build in its market, not just how to use the tools.</p>',
      '<p><strong>The constraint:</strong> Content volume without strategic coherence is noise. The human who owns this system needs to understand the narrative the company is trying to build in its market, not just how to use the tools.</p>'
    ),
    '<p>The constraint: AI-handled customer communication at volume can feel impersonal at exactly the moments when customers need to feel heard. The human in this system needs to be skilled at knowing when to step out from behind the AI layer and show up directly.</p>',
    '<p><strong>The constraint:</strong> AI-handled customer communication at volume can feel impersonal at exactly the moments when customers need to feel heard. The human in this system needs to be skilled at knowing when to step out from behind the AI layer and show up directly.</p>'
  ),
  '<p>The constraint: AI can draft a compelling proposal. It cannot build the kind of trust that makes someone sign a significant contract with a company they have just met. The human in this system needs to be commercially strong, not just comfortable with AI tools.</p>',
  '<p><strong>The constraint:</strong> AI can draft a compelling proposal. It cannot build the kind of trust that makes someone sign a significant contract with a company they have just met. The human in this system needs to be commercially strong, not just comfortable with AI tools.</p>'
)
WHERE insights_id = '6162fbfc-d15f-460a-8b2e-f844eaa86004'
  AND language_id = 1;