
DO $$
DECLARE
  v_product_id uuid;
BEGIN
  INSERT INTO products (slug, website_url, display_order, page_background_color, highlight_color, features, stats, testimonials)
  VALUES (
    'findloom',
    'https://findloom.com',
    5,
    '#0A0F1C',
    '#6366F1',
    '[{"icon":"Globe","title":"Multi-Domain Support","description":"Manage search across multiple storefronts from a single dashboard with unified analytics."},{"icon":"FileCode","title":"XML Feed Integration","description":"Connect your product XML feeds in minutes. Automatic sync keeps your search index always up to date."},{"icon":"Zap","title":"Lightning Fast Search","description":"Sub-50ms search responses across millions of products with edge-deployed infrastructure."},{"icon":"Brain","title":"Smart Search","description":"Typo tolerance, synonym matching, and faceted filtering deliver the right results every time."},{"icon":"Shield","title":"Enterprise Security","description":"SOC 2 compliant infrastructure with encrypted data at rest and in transit."},{"icon":"BarChart3","title":"Analytics & Insights","description":"Real-time search analytics, click tracking, and conversion attribution to optimize your catalog."}]'::jsonb,
    '[{"value":"<50ms","label":"Avg Response Time"},{"value":"10M+","label":"Products Indexed"},{"value":"99.9%","label":"Uptime SLA"}]'::jsonb,
    '[]'::jsonb
  )
  RETURNING id INTO v_product_id;

  INSERT INTO product_translations (product_id, language_id, title, description, page_title, page_subtitle, page_description, cta_section_title, cta_section_description, cta_button_text)
  VALUES (
    v_product_id,
    1,
    'Findloom',
    'Enterprise-grade search infrastructure for e-commerce. Connect your XML feeds, power your store with blazing-fast sub-50ms search. Setup in minutes, scale to millions of products.',
    'Findloom | Lightning-Fast eCommerce Search Infrastructure',
    'Connect your XML feeds, power your store with blazing-fast search',
    'Findloom is an enterprise-grade e-commerce search infrastructure SaaS that enables online stores to connect XML product feeds and deliver sub-50ms search results across millions of products. With multi-domain support, typo tolerance, faceted search, real-time analytics, and SOC 2 compliant security, Findloom transforms how shoppers discover products.',
    'Ready to Transform Your Store Search?',
    'Connect your XML feeds and start delivering lightning-fast search results to your customers in minutes.',
    'Get Started Free'
  );
END $$;
