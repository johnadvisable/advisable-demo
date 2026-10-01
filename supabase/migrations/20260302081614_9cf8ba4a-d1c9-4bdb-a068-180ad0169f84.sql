
-- Update X-Shop Development long_description, SEO title, and meta description
UPDATE service_translations 
SET long_description = '<p><strong>X-Shop</strong> is an AI-powered eCommerce platform that lets you create, customize, and launch a fully functional online store in seconds. Simply describe your idea or paste a link — X-Shop generates everything from product pages to checkout flows, with zero coding required.</p>

<h2>Key Platform Features</h2>

<h3>AI-Powered Store Creation</h3>
<p>Build your eShop instantly by describing your vision in natural language. X-Shop''s intelligent engine generates a complete, ready-to-sell online store — including design, layout, and product structure — in seconds.</p>

<h3>Fully Automated Backend</h3>
<p>Everything works out of the box. X-Shop automatically handles <strong>user accounts</strong>, <strong>inventory management</strong>, <strong>shopping carts</strong>, <strong>order processing</strong>, <strong>permissions</strong>, and <strong>third-party integrations</strong> — no manual configuration needed.</p>

<h3>One-Click Publishing</h3>
<p>Your store is <strong>SEO-optimized</strong>, lightning-fast, and hosted automatically. Connect your custom domain, hit Publish, and start selling immediately with built-in analytics for revenue, orders, traffic, and conversion tracking.</p>

<h3>Smart Commerce Tools</h3>
<p>X-Shop includes intelligent features that streamline your operations:</p>
<ul>
<li><strong>Automated payment gateway</strong> connections</li>
<li><strong>Dynamic shipping rules</strong> generation</li>
<li><strong>Product import</strong> from existing catalogs or URLs</li>
<li><strong>Database, API, and permissions</strong> management built in</li>
</ul>

<h2>Who Is X-Shop For?</h2>
<p>Whether you''re a solo entrepreneur launching your first store or an established business looking to modernize, X-Shop removes traditional barriers to eCommerce. No tech skills, no middlemen — just you and your store.</p>

<h2>Get Started with X-Shop</h2>
<p>Ready to launch your online store? <strong>Advisable</strong> provides expert X-Shop development services — from initial setup and customization to ongoing optimization. <a href="/en/contact">Contact us</a> to build your AI-powered eCommerce store today.</p>',
seo_title = 'X-Shop Development | AI-Powered eCommerce Stores | Advisable',
meta_description = 'Build your online store in seconds with X-Shop. AI-powered eCommerce platform with automated backend, one-click publishing, and smart commerce tools. Expert development by Advisable.',
updated_at = now()
WHERE id = '51929744-d533-48be-ae41-56b5bf22309c';

-- Insert 6 FAQs for X-Shop Development
INSERT INTO service_faqs (id, service_id, display_order, is_active) VALUES
  ('a2b2c2d2-0001-4000-b000-000000000001', '1c0d7371-01be-432e-b01f-64263fe8b7ec', 1, true),
  ('a2b2c2d2-0002-4000-b000-000000000002', '1c0d7371-01be-432e-b01f-64263fe8b7ec', 2, true),
  ('a2b2c2d2-0003-4000-b000-000000000003', '1c0d7371-01be-432e-b01f-64263fe8b7ec', 3, true),
  ('a2b2c2d2-0004-4000-b000-000000000004', '1c0d7371-01be-432e-b01f-64263fe8b7ec', 4, true),
  ('a2b2c2d2-0005-4000-b000-000000000005', '1c0d7371-01be-432e-b01f-64263fe8b7ec', 5, true),
  ('a2b2c2d2-0006-4000-b000-000000000006', '1c0d7371-01be-432e-b01f-64263fe8b7ec', 6, true);

-- Insert English FAQ translations
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
  ('a2b2c2d2-0001-4000-b000-000000000001', 1,
   'What is X-Shop and how does it work?',
   'X-Shop is an AI-powered eCommerce platform that creates fully functional online stores in seconds. You simply describe your store idea in natural language or paste a product link, and X-Shop automatically generates the entire store — including design, product pages, checkout, and backend systems.'),

  ('a2b2c2d2-0002-4000-b000-000000000002', 1,
   'Do I need technical skills to use X-Shop?',
   'No. X-Shop is designed for everyone, from solo entrepreneurs to established businesses. There is no coding required — the platform handles all technical aspects including user accounts, inventory, payments, shipping rules, and hosting automatically.'),

  ('a2b2c2d2-0003-4000-b000-000000000003', 1,
   'What backend features does X-Shop include?',
   'X-Shop includes a fully automated backend with user account management, inventory tracking, shopping cart functionality, order processing, permissions control, payment gateway integration, and API access — all configured automatically when your store is created.'),

  ('a2b2c2d2-0004-4000-b000-000000000004', 1,
   'Is my X-Shop store SEO-optimized?',
   'Yes. Every X-Shop store is built with SEO best practices out of the box. Stores are fast-loading, mobile-responsive, and include proper meta tags, structured data, and clean URLs. You can also connect your own custom domain for better brand visibility.'),

  ('a2b2c2d2-0005-4000-b000-000000000005', 1,
   'Can I import my existing products into X-Shop?',
   'Absolutely. X-Shop supports product import from existing catalogs or external URLs. You can migrate your product data seamlessly and have your store ready to sell without manually re-entering product information.'),

  ('a2b2c2d2-0006-4000-b000-000000000006', 1,
   'How can Advisable help with my X-Shop store?',
   'Advisable provides end-to-end X-Shop development services including custom store setup, design customization, product catalog migration, payment and shipping configuration, SEO optimization, and ongoing support. We ensure your AI-powered store is tailored to your brand and business goals.');
