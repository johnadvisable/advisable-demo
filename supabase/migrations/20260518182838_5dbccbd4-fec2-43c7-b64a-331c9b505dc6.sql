
DO $$
DECLARE
  v_cat_id uuid;
  v_service_id uuid;
BEGIN
  SELECT id INTO v_cat_id FROM public.service_categories WHERE slug='technology' LIMIT 1;

  INSERT INTO public.services (category_id, slug, display_order, is_parent, emoji, icon_name)
  VALUES (v_cat_id, 'ai-automations-and-ai-integrations', 0, true, '🤖', 'Bot')
  RETURNING id INTO v_service_id;

  UPDATE public.services SET display_order = 1 WHERE slug='cloud-infrastructure-k8s';

  INSERT INTO public.service_translations (service_id, language_id, title, short_description, long_description, seo_title, meta_description)
  VALUES (
    v_service_id, 1,
    'AI automations & AI Integration services',
    'Practical AI automations and integrations that connect your tools, automate workflows and ship measurable business outcomes.',
    '<section><h2>AI automations & AI Integration services</h2><p>We design and ship practical AI automations and integrations for teams that want measurable outcomes. From workflow automation to LLM-powered features inside your existing stack, we build the glue that makes AI useful in production.</p></section>',
    'AI Automations & AI Integration Services',
    'Practical AI automations and integrations that connect your tools, automate workflows and ship measurable business outcomes.'
  );
END $$;
