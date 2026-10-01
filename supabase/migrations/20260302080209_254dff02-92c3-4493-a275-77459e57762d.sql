
-- 1. Insert parent service
INSERT INTO services (id, slug, category_id, emoji, is_parent, parent_service_id, display_order, icon_name)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'ecommerce-platform-development',
  '164b114a-ccb9-4900-8777-70fb9dcb5108',
  '🛒',
  true,
  null,
  6,
  'ShoppingCart'
);

-- 2. Insert 6 child services
INSERT INTO services (slug, category_id, emoji, is_parent, parent_service_id, display_order, icon_name) VALUES
  ('ecommercen-development', '164b114a-ccb9-4900-8777-70fb9dcb5108', '🛍️', false, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, 'ShoppingBag'),
  ('x-shop-development', '164b114a-ccb9-4900-8777-70fb9dcb5108', '🏪', false, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 2, 'Store'),
  ('shopify-development', '164b114a-ccb9-4900-8777-70fb9dcb5108', '🛒', false, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 3, 'ShoppingCart'),
  ('opencart-development', '164b114a-ccb9-4900-8777-70fb9dcb5108', '📦', false, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 4, 'Package'),
  ('woocommerce-development', '164b114a-ccb9-4900-8777-70fb9dcb5108', '🌐', false, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 5, 'Globe'),
  ('prestashop-development', '164b114a-ccb9-4900-8777-70fb9dcb5108', '📚', false, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 6, 'Layers');

-- 3. Insert English translations
INSERT INTO service_translations (service_id, language_id, title, short_description, seo_title, meta_description)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  1,
  'eCommerce Platform Development',
  'End-to-end eCommerce solutions tailored to your business — from custom builds to platform-specific development.',
  'eCommerce Platform Development | Advisable',
  'Expert eCommerce development services including Shopify, WooCommerce, OpenCart, PrestaShop, X-Shop and custom solutions. Build scalable online stores with Advisable.'
);

INSERT INTO service_translations (service_id, language_id, title, short_description, seo_title, meta_description)
SELECT s.id, 1, t.title, t.short_desc, t.seo, t.meta
FROM (VALUES
  ('ecommercen-development', 'Ecommercen Development', 'Custom eCommerce development with the Ecommercen platform for tailored online store experiences.', 'Ecommercen Development | Advisable', 'Professional Ecommercen development services. Build custom, high-performance online stores with Advisable.'),
  ('x-shop-development', 'X-Shop Development', 'Feature-rich X-Shop store development for modern eCommerce businesses.', 'X-Shop Development | Advisable', 'Expert X-Shop development services. Create powerful, scalable online stores with Advisable.'),
  ('shopify-development', 'Shopify Development', 'Professional Shopify store setup, custom themes, and app integrations for rapid eCommerce growth.', 'Shopify Development | Advisable', 'Professional Shopify development services. Custom themes, apps and store optimization by Advisable.'),
  ('opencart-development', 'OpenCart Development', 'Flexible OpenCart development for feature-rich, open-source eCommerce solutions.', 'OpenCart Development | Advisable', 'Expert OpenCart development services. Build flexible, open-source online stores with Advisable.'),
  ('woocommerce-development', 'WooCommerce Development', 'WordPress-powered WooCommerce stores with custom plugins, themes, and seamless integrations.', 'WooCommerce Development | Advisable', 'Professional WooCommerce development services. Custom WordPress eCommerce solutions by Advisable.'),
  ('prestashop-development', 'PrestaShop Development', 'Scalable PrestaShop eCommerce development with custom modules and multi-language support.', 'PrestaShop Development | Advisable', 'Expert PrestaShop development services. Build scalable, multi-language online stores with Advisable.')
) AS t(slug, title, short_desc, seo, meta)
JOIN services s ON s.slug = t.slug AND s.category_id = '164b114a-ccb9-4900-8777-70fb9dcb5108';
