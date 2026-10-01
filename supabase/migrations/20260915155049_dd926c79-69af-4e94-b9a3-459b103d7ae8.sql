UPDATE public.service_categories
SET name = 'Cybersecurity',
    seo_title = replace(seo_title, 'Cyber Security', 'Cybersecurity')
WHERE slug = 'cyber-security';