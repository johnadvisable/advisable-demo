UPDATE public.insights_translations
SET content = REPLACE(content, 'Clicks: 19,800 — down 38%', 'Clicks: 19,800, down 38%')
WHERE insights_id = (SELECT id FROM public.insights WHERE slug = 'google-new-search-bar-reshaping-seo-geo-2026')
AND language_id = 1;