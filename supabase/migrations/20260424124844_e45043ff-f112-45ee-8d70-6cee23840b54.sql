UPDATE public.insights_translations
SET content = replace(content, '<figcaption>Only the tip: most software features go unused.</figcaption>', ''),
    updated_at = now()
WHERE id = '29e86e4a-385a-45af-b67d-d534932926f7';