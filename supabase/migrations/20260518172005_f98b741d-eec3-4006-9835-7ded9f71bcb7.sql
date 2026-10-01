
INSERT INTO public.service_categories (slug, name, description, icon_name, seo_title, seo_description)
VALUES (
  'technology',
  'Technology',
  'Cloud infrastructure, Kubernetes, AI and integrations engineering services.',
  'Cpu',
  'Technology Services | Cloud, Kubernetes & AI',
  'Advisable Technology services: Cloud Infrastructure & Kubernetes, plus AI engineering and integrations for modern businesses.'
)
ON CONFLICT (slug) DO NOTHING;
