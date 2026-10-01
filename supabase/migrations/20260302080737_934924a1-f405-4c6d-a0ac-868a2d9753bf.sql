
-- Insert 6 FAQs for Ecommercen Development
INSERT INTO service_faqs (id, service_id, display_order, is_active) VALUES
  ('f1a1b1c1-0001-4000-a000-000000000001', '0836308a-e860-4460-a978-65e0a24c6090', 1, true),
  ('f1a1b1c1-0002-4000-a000-000000000002', '0836308a-e860-4460-a978-65e0a24c6090', 2, true),
  ('f1a1b1c1-0003-4000-a000-000000000003', '0836308a-e860-4460-a978-65e0a24c6090', 3, true),
  ('f1a1b1c1-0004-4000-a000-000000000004', '0836308a-e860-4460-a978-65e0a24c6090', 4, true),
  ('f1a1b1c1-0005-4000-a000-000000000005', '0836308a-e860-4460-a978-65e0a24c6090', 5, true),
  ('f1a1b1c1-0006-4000-a000-000000000006', '0836308a-e860-4460-a978-65e0a24c6090', 6, true);

-- Insert English translations
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
  ('f1a1b1c1-0001-4000-a000-000000000001', 1,
   'What is Ecommercen and how is it different from other eCommerce platforms?',
   'Ecommercen is a modular, cloud-native eCommerce platform designed for mid-to-large businesses. Unlike generic solutions, it offers built-in multi-language and multi-currency support, AI-powered product recommendations, automated pricing, and native omnichannel integrations with ERP systems, marketplaces, and social commerce — all from a single platform.'),

  ('f1a1b1c1-0002-4000-a000-000000000002', 1,
   'Which industries does Ecommercen support?',
   'Ecommercen provides specialized solutions for Pharmacy & FMCG, Fashion & Apparel, Electronics & Technology, Books & Publishing, and fully custom builds for niche markets. Each industry vertical includes tailored features such as compliance workflows, size guides, product comparisons, and large-catalog management.'),

  ('f1a1b1c1-0003-4000-a000-000000000003', 1,
   'Can Ecommercen handle international sales with multiple languages and currencies?',
   'Yes. Ecommercen natively supports multi-language storefronts and multi-currency checkout, enabling you to sell across 3+ countries with localized shopping experiences. Prices, taxes, and shipping rules can be configured per region.'),

  ('f1a1b1c1-0004-4000-a000-000000000004', 1,
   'How does the AI-powered commerce feature work?',
   'Ecommercen uses artificial intelligence to analyze customer behavior in real time. This powers personalized product recommendations, dynamic automated pricing, and intelligent search — all designed to increase conversion rates and average order value without manual intervention.'),

  ('f1a1b1c1-0005-4000-a000-000000000005', 1,
   'What kind of uptime and security does Ecommercen offer?',
   'The platform guarantees 99.9% uptime with enterprise-grade infrastructure, 100% data encryption, SSL, DDoS protection, and PCI compliance. 24/7 monitoring and dedicated technical support ensure your store stays online and secure at all times.'),

  ('f1a1b1c1-0006-4000-a000-000000000006', 1,
   'How long does it take to launch an Ecommercen store?',
   'Timeline depends on complexity. A standard store with the Starter or Professional plan can launch in 4–8 weeks. Enterprise-level custom builds with advanced integrations typically take 8–16 weeks. Advisable manages the entire process from design to go-live.');
