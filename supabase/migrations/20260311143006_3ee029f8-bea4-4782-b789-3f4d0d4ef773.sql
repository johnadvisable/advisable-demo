UPDATE public.insights_translations
SET content = REPLACE(
  content,
  '<p><strong>TL;DR: The productivity gains from AI-assisted development are real but narrower than the headlines suggest, and they come with a compounding cost that most engineering teams are not yet measuring.</strong></p>

<p><strong>Google''s DORA research found that increased AI adoption correlates with a 7.2% decrease in software delivery stability. GitClear''s analysis of 211 million lines of code found that AI-assisted development is producing more duplicate code, less refactoring, and higher churn rates year over year.</strong></p>

<p><strong>A METR randomised controlled trial found that experienced developers using AI tools took 19% longer to complete tasks than those working without them, while believing they were moving faster.</strong></p>

<p><strong>None of this means AI-assisted development is a mistake. It means the way most teams are using it is one. This article explains what is actually happening structurally, why it compounds.</strong></p>',
  '<p>TL;DR: The productivity gains from AI-assisted development are real but narrower than the headlines suggest, and they come with a compounding cost that most engineering teams are not yet measuring.</p>

<p>Google''s DORA research found that increased AI adoption correlates with a <strong>7.2% decrease in software delivery stability</strong>. GitClear''s analysis of 211 million lines of code found that AI-assisted development is producing more duplicate code, less refactoring, and higher churn rates year over year.</p>

<p>A METR randomised controlled trial found that <strong>experienced developers using AI tools took 19% longer to complete tasks than those working without them, while believing they were moving faster.</strong></p>

<p>None of this means AI-assisted development is a mistake. It means the way most teams are using it is one. This article explains what is actually happening structurally, why it compounds.</p>'
)
WHERE id = 'bedd0412-6588-4ec6-8776-717e3efce55e';
