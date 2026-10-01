-- Update the AI opportunity insight text to use a comma instead of a dash
UPDATE public.insights_translations
SET content = REPLACE(
  content,
  'The moat lives in what you build on top of it — and how deeply you embed it',
  'The moat lives in what you build on top of it, and how deeply you embed it'
)
WHERE content LIKE '%The AI opportunity in 2026%';