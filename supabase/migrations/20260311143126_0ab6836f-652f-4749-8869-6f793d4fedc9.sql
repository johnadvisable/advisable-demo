UPDATE public.insights_translations
SET content = REPLACE(
  content,
  '<p>TL;DR: The productivity gains',
  '<p><strong>TL;DR:</strong> The productivity gains'
)
WHERE id = 'bedd0412-6588-4ec6-8776-717e3efce55e';
