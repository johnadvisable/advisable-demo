UPDATE public.insights_translations
SET content = regexp_replace(content, '^\s*<p><img src="/images/insights/greek-tech-talent-pipeline-featured\.jpg"[^>]*/></p>\s*', '', 'i')
WHERE insights_id = (SELECT id FROM public.insights WHERE slug='greek-tech-talent-shortage-pipeline-broken-2026')
  AND language_id = 1;