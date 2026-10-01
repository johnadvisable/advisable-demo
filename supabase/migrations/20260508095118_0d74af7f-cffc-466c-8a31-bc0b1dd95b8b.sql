UPDATE public.route_seo_config
SET title = 'Advisable | AI-First Digital Agency & Venture Studio',
    description = 'Η #1 AI-first εταιρεία στην Ελλάδα για branding, SEO, performance, AI creative, web/app development και start up support, με λύσεις που κάνουν την επιχείρησή σας να ξεχωρίζει.',
    updated_at = now()
WHERE route_path = '/' AND language_code = 'el';