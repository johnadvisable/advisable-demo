
-- Delete existing Venture Studio service translations first
DELETE FROM service_translations 
WHERE service_id IN (
  SELECT id FROM services WHERE category_id = '54d5b665-a721-4b1d-8c3f-517c402125de'
);

-- Delete existing Venture Studio services  
DELETE FROM services WHERE category_id = '54d5b665-a721-4b1d-8c3f-517c402125de';

-- Create the new Venture Studio parent services (include emoji)
INSERT INTO services (slug, category_id, emoji, icon_name, featured_image, display_order, is_parent, parent_service_id)
VALUES 
  ('ideation-venture-thesis', '54d5b665-a721-4b1d-8c3f-517c402125de', '💡', 'Lightbulb', '/images/services/ideation.jpg', 1, true, NULL),
  ('validation-market-proof', '54d5b665-a721-4b1d-8c3f-517c402125de', '🎯', 'Target', '/images/services/validation.jpg', 2, true, NULL),
  ('venture-product-dev-parent', '54d5b665-a721-4b1d-8c3f-517c402125de', '📦', 'Package', '/images/services/product-dev.jpg', 3, true, NULL),
  ('engineering-platform', '54d5b665-a721-4b1d-8c3f-517c402125de', '🖥️', 'Cpu', '/images/services/engineering.jpg', 4, true, NULL),
  ('go-to-market-growth', '54d5b665-a721-4b1d-8c3f-517c402125de', '🚀', 'Rocket', '/images/services/growth.jpg', 5, true, NULL),
  ('fundraising-venture-readiness', '54d5b665-a721-4b1d-8c3f-517c402125de', '📈', 'TrendingUp', '/images/services/fundraising.jpg', 6, true, NULL);

-- Get parent IDs and create children
DO $$
DECLARE
  v_ideation_id UUID;
  v_validation_id UUID;
  v_product_dev_id UUID;
  v_engineering_id UUID;
  v_growth_id UUID;
  v_fundraising_id UUID;
  v_category_id UUID := '54d5b665-a721-4b1d-8c3f-517c402125de';
BEGIN
  SELECT id INTO v_ideation_id FROM services WHERE slug = 'ideation-venture-thesis';
  SELECT id INTO v_validation_id FROM services WHERE slug = 'validation-market-proof';
  SELECT id INTO v_product_dev_id FROM services WHERE slug = 'venture-product-dev-parent';
  SELECT id INTO v_engineering_id FROM services WHERE slug = 'engineering-platform';
  SELECT id INTO v_growth_id FROM services WHERE slug = 'go-to-market-growth';
  SELECT id INTO v_fundraising_id FROM services WHERE slug = 'fundraising-venture-readiness';

  -- Children for Ideation & Venture Thesis
  INSERT INTO services (slug, category_id, emoji, icon_name, display_order, is_parent, parent_service_id)
  VALUES 
    ('venture-thesis-design', v_category_id, '📄', 'FileText', 1, false, v_ideation_id),
    ('opportunity-sourcing', v_category_id, '🔍', 'Search', 2, false, v_ideation_id),
    ('moat-differentiation-framework', v_category_id, '🛡️', 'Shield', 3, false, v_ideation_id),
    ('founder-mentorship', v_category_id, '👥', 'Users', 4, false, v_ideation_id);

  -- Children for Validation & Market Proof
  INSERT INTO services (slug, category_id, emoji, icon_name, display_order, is_parent, parent_service_id)
  VALUES 
    ('market-research-sprint', v_category_id, '📊', 'BarChart', 1, false, v_validation_id),
    ('problem-validation', v_category_id, '✅', 'CheckCircle', 2, false, v_validation_id),
    ('business-model-design', v_category_id, '📚', 'Layers', 3, false, v_validation_id),
    ('pricing-packaging-test', v_category_id, '🏷️', 'Tag', 4, false, v_validation_id);

  -- Children for Venture Product Development
  INSERT INTO services (slug, category_id, emoji, icon_name, display_order, is_parent, parent_service_id)
  VALUES 
    ('mvp-launch-sprint', v_category_id, '⚡', 'Zap', 1, false, v_product_dev_id),
    ('product-development', v_category_id, '📦', 'Box', 2, false, v_product_dev_id),
    ('venture-product-development', v_category_id, '🎁', 'Package', 3, false, v_product_dev_id),
    ('product-design-ux', v_category_id, '🎨', 'Palette', 4, false, v_product_dev_id);

  -- Children for Engineering & Platform
  INSERT INTO services (slug, category_id, emoji, icon_name, display_order, is_parent, parent_service_id)
  VALUES 
    ('software-development', v_category_id, '💻', 'Code', 1, false, v_engineering_id),
    ('technology-services', v_category_id, '🖥️', 'Server', 2, false, v_engineering_id),
    ('integrations-automation', v_category_id, '🔗', 'GitMerge', 3, false, v_engineering_id),
    ('data-analytics-foundations', v_category_id, '🗄️', 'Database', 4, false, v_engineering_id);

  -- Children for Go-to-Market & Growth
  INSERT INTO services (slug, category_id, emoji, icon_name, display_order, is_parent, parent_service_id)
  VALUES 
    ('startup-growth-acceleration', v_category_id, '📈', 'TrendingUp', 1, false, v_growth_id),
    ('launch-strategy', v_category_id, '🚩', 'Flag', 2, false, v_growth_id),
    ('sales-enablement', v_category_id, '💰', 'DollarSign', 3, false, v_growth_id),
    ('partnerships-distribution', v_category_id, '🤝', 'Share2', 4, false, v_growth_id);

  -- Children for Fundraising & Venture Readiness
  INSERT INTO services (slug, category_id, emoji, icon_name, display_order, is_parent, parent_service_id)
  VALUES 
    ('venture-strategic-advisory', v_category_id, '🧭', 'Compass', 1, false, v_fundraising_id),
    ('strategic-consulting', v_category_id, '💼', 'Briefcase', 2, false, v_fundraising_id),
    ('investor-narrative-pitch', v_category_id, '📽️', 'Presentation', 3, false, v_fundraising_id),
    ('financial-model-data-room', v_category_id, '📑', 'FileSpreadsheet', 4, false, v_fundraising_id);
END $$;

-- Add English translations for all new services
INSERT INTO service_translations (service_id, language_id, title, short_description)
SELECT s.id, 1, 
  CASE s.slug
    WHEN 'ideation-venture-thesis' THEN 'Ideation & Venture Thesis'
    WHEN 'validation-market-proof' THEN 'Validation & Market Proof'
    WHEN 'venture-product-dev-parent' THEN 'Venture Product Development'
    WHEN 'engineering-platform' THEN 'Engineering & Platform'
    WHEN 'go-to-market-growth' THEN 'Go-to-Market & Growth'
    WHEN 'fundraising-venture-readiness' THEN 'Fundraising & Venture Readiness'
    WHEN 'venture-thesis-design' THEN 'Venture Thesis Design'
    WHEN 'opportunity-sourcing' THEN 'Opportunity Sourcing'
    WHEN 'moat-differentiation-framework' THEN 'Moat & Differentiation Framework'
    WHEN 'founder-mentorship' THEN 'Founder Mentorship'
    WHEN 'market-research-sprint' THEN 'Market Research Sprint'
    WHEN 'problem-validation' THEN 'Problem Validation'
    WHEN 'business-model-design' THEN 'Business Model Design'
    WHEN 'pricing-packaging-test' THEN 'Pricing & Packaging Test'
    WHEN 'mvp-launch-sprint' THEN 'MVP Launch Sprint'
    WHEN 'product-development' THEN 'Product Development'
    WHEN 'venture-product-development' THEN 'Venture Product Development'
    WHEN 'product-design-ux' THEN 'Product Design & UX'
    WHEN 'software-development' THEN 'Software Development'
    WHEN 'technology-services' THEN 'Technology Services'
    WHEN 'integrations-automation' THEN 'Integrations & Automation'
    WHEN 'data-analytics-foundations' THEN 'Data & Analytics Foundations'
    WHEN 'startup-growth-acceleration' THEN 'Startup Growth Acceleration'
    WHEN 'launch-strategy' THEN 'Launch Strategy'
    WHEN 'sales-enablement' THEN 'Sales Enablement'
    WHEN 'partnerships-distribution' THEN 'Partnerships & Distribution'
    WHEN 'venture-strategic-advisory' THEN 'Venture Strategic Advisory'
    WHEN 'strategic-consulting' THEN 'Strategic Consulting'
    WHEN 'investor-narrative-pitch' THEN 'Investor Narrative & Pitch'
    WHEN 'financial-model-data-room' THEN 'Financial Model & Data Room Setup'
  END,
  CASE s.slug
    WHEN 'ideation-venture-thesis' THEN 'Define your venture vision and strategic thesis'
    WHEN 'validation-market-proof' THEN 'Validate your market opportunity and business model'
    WHEN 'venture-product-dev-parent' THEN 'Build and launch your minimum viable product'
    WHEN 'engineering-platform' THEN 'Scalable technology infrastructure and development'
    WHEN 'go-to-market-growth' THEN 'Launch strategy and growth acceleration'
    WHEN 'fundraising-venture-readiness' THEN 'Prepare for fundraising and investor engagement'
    WHEN 'venture-thesis-design' THEN 'Craft a compelling venture thesis that guides strategic decisions'
    WHEN 'opportunity-sourcing' THEN 'Identify and evaluate market opportunities systematically'
    WHEN 'moat-differentiation-framework' THEN 'Build sustainable competitive advantages'
    WHEN 'founder-mentorship' THEN 'Expert guidance for founder growth and leadership'
    WHEN 'market-research-sprint' THEN 'Rapid market analysis and competitive intelligence'
    WHEN 'problem-validation' THEN 'Validate customer problems before building solutions'
    WHEN 'business-model-design' THEN 'Design scalable and profitable business models'
    WHEN 'pricing-packaging-test' THEN 'Optimize pricing strategy through market testing'
    WHEN 'mvp-launch-sprint' THEN 'Rapid MVP development and launch in weeks'
    WHEN 'product-development' THEN 'Full-cycle product development and iteration'
    WHEN 'venture-product-development' THEN 'Product development tailored for venture-backed startups'
    WHEN 'product-design-ux' THEN 'User-centered design and exceptional experiences'
    WHEN 'software-development' THEN 'Custom software development and engineering'
    WHEN 'technology-services' THEN 'Technology consulting and implementation'
    WHEN 'integrations-automation' THEN 'Connect systems and automate workflows'
    WHEN 'data-analytics-foundations' THEN 'Build data infrastructure for insights and growth'
    WHEN 'startup-growth-acceleration' THEN 'Accelerate growth with proven strategies'
    WHEN 'launch-strategy' THEN 'Strategic launch planning and execution'
    WHEN 'sales-enablement' THEN 'Empower sales teams with tools and processes'
    WHEN 'partnerships-distribution' THEN 'Build strategic partnerships and distribution channels'
    WHEN 'venture-strategic-advisory' THEN 'Strategic advisory for venture-backed companies'
    WHEN 'strategic-consulting' THEN 'High-level strategic consulting and planning'
    WHEN 'investor-narrative-pitch' THEN 'Craft compelling investor narratives and pitch decks'
    WHEN 'financial-model-data-room' THEN 'Build financial models and investor data rooms'
  END
FROM services s
WHERE s.category_id = '54d5b665-a721-4b1d-8c3f-517c402125de';
