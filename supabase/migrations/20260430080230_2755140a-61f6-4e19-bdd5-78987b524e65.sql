UPDATE public.insights_translations
SET content = replace(content, '<figcaption>Tracking output is easy. Seeing the full picture is the advantage.</figcaption>' || E'\n', '')
WHERE language_id = 1
  AND insights_id = (SELECT id FROM public.insights WHERE slug = 'human-in-the-loop-trap-ai-oversight-startup-productivity-2026');

UPDATE public.insights_translations
SET content = replace(content, '<figcaption>Tracking output is easy. Seeing the full picture is the advantage.</figcaption>', '')
WHERE language_id = 1
  AND insights_id = (SELECT id FROM public.insights WHERE slug = 'human-in-the-loop-trap-ai-oversight-startup-productivity-2026');