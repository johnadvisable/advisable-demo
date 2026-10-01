-- Add new service: Custom AI Solutions for Enterprises under Technology category
-- Position it between AI Automations (display_order=0) and Kubernetes (display_order=1)

-- Bump kubernetes to display_order=2
UPDATE public.services SET display_order = 2 WHERE slug = 'cloud-infrastructure-k8s';

INSERT INTO public.services (
  slug, category_id, display_order, emoji, icon_name, is_parent, is_seo_only,
  canonical_url, og_url, twitter_url
) VALUES (
  'custom-ai-solutions-for-enterprises',
  '7ab92ece-8e9c-495b-b1fb-dfe5cb62aec1',
  1,
  '🧠',
  'Sparkles',
  true,
  false,
  'https://www.advisable.com/services/custom-ai-solutions-for-enterprises',
  'https://www.advisable.com/services/custom-ai-solutions-for-enterprises',
  'https://www.advisable.com/services/custom-ai-solutions-for-enterprises'
);

-- English translation (language_id = 1)
INSERT INTO public.service_translations (
  service_id, language_id, title, short_description, long_description,
  seo_title, meta_description, seo_h2_title
)
SELECT
  s.id,
  1,
  'Custom AI Solutions for Enterprises',
  'Bespoke AI systems engineered for enterprise scale, security and compliance — from strategy to production.',
  '<section style="padding:80px 24px;background:linear-gradient(180deg,#0a0a1a 0%,#141432 100%);color:#fff;text-align:center;border-radius:24px;margin-bottom:48px;">
    <p style="text-transform:uppercase;letter-spacing:2px;font-size:13px;color:#a78bfa;margin-bottom:16px;">Custom AI Solutions for Enterprises</p>
    <h1 style="font-size:clamp(36px,5vw,64px);font-weight:800;line-height:1.05;margin:0 0 20px;">Enterprise-grade AI,<br/>built around your business.</h1>
    <p style="font-size:18px;max-width:720px;margin:0 auto 32px;color:#cbd5e1;">From RAG and copilots to autonomous agents and predictive systems — custom AI solutions designed, built and operated for the security, compliance and scale enterprises demand.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="/contact" style="background:#a78bfa;color:#0a0a1a;padding:14px 28px;border-radius:999px;font-weight:600;text-decoration:none;">Book a discovery call</a>
      <a href="#solutions" style="border:1px solid rgba(255,255,255,0.3);color:#fff;padding:14px 28px;border-radius:999px;font-weight:600;text-decoration:none;">Explore solutions</a>
    </div>
  </section>

  <section style="margin-bottom:64px;">
    <h2 style="font-size:32px;font-weight:700;text-align:center;margin-bottom:12px;">Why enterprises choose custom AI</h2>
    <p style="text-align:center;color:#64748b;max-width:680px;margin:0 auto 40px;">Off-the-shelf tools rarely fit complex workflows, regulated data or proprietary IP. We build AI that does.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;">
      <div style="padding:28px;border:1px solid #e2e8f0;border-radius:16px;background:#fff;"><div style="font-size:28px;margin-bottom:12px;">🔒</div><h3 style="font-size:18px;font-weight:700;margin:0 0 8px;">Security &amp; compliance first</h3><p style="color:#475569;margin:0;">GDPR, ISO and SOC-aligned designs. Private deployments, EU data residency, audit trails.</p></div>
      <div style="padding:28px;border:1px solid #e2e8f0;border-radius:16px;background:#fff;"><div style="font-size:28px;margin-bottom:12px;">🧩</div><h3 style="font-size:18px;font-weight:700;margin:0 0 8px;">Built around your stack</h3><p style="color:#475569;margin:0;">Native integrations with your ERP, CRM, data warehouse and internal systems.</p></div>
      <div style="padding:28px;border:1px solid #e2e8f0;border-radius:16px;background:#fff;"><div style="font-size:28px;margin-bottom:12px;">📈</div><h3 style="font-size:18px;font-weight:700;margin:0 0 8px;">Measurable outcomes</h3><p style="color:#475569;margin:0;">We ship to KPIs, not demos. Every project tied to a business metric.</p></div>
      <div style="padding:28px;border:1px solid #e2e8f0;border-radius:16px;background:#fff;"><div style="font-size:28px;margin-bottom:12px;">⚙️</div><h3 style="font-size:18px;font-weight:700;margin:0 0 8px;">Owned by you</h3><p style="color:#475569;margin:0;">No vendor lock-in. Full code, models and documentation transferred.</p></div>
    </div>
  </section>

  <section id="solutions" style="margin-bottom:64px;">
    <h2 style="font-size:32px;font-weight:700;text-align:center;margin-bottom:40px;">Our custom AI solutions</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
      <div style="padding:28px;border-radius:16px;background:linear-gradient(180deg,#fff,#f8fafc);border:1px solid #e2e8f0;"><h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Enterprise RAG &amp; Knowledge AI</h3><p style="color:#475569;margin:0;">Secure retrieval-augmented assistants over your internal documents, wikis, contracts and tickets.</p></div>
      <div style="padding:28px;border-radius:16px;background:linear-gradient(180deg,#fff,#f8fafc);border:1px solid #e2e8f0;"><h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Domain Copilots</h3><p style="color:#475569;margin:0;">Role-specific copilots for sales, support, legal, finance and operations teams.</p></div>
      <div style="padding:28px;border-radius:16px;background:linear-gradient(180deg,#fff,#f8fafc);border:1px solid #e2e8f0;"><h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Autonomous Agents</h3><p style="color:#475569;margin:0;">Multi-step agents that execute workflows across your tools with human-in-the-loop controls.</p></div>
      <div style="padding:28px;border-radius:16px;background:linear-gradient(180deg,#fff,#f8fafc);border:1px solid #e2e8f0;"><h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Predictive &amp; Decision AI</h3><p style="color:#475569;margin:0;">Forecasting, scoring, churn, demand and risk models trained on your proprietary data.</p></div>
      <div style="padding:28px;border-radius:16px;background:linear-gradient(180deg,#fff,#f8fafc);border:1px solid #e2e8f0;"><h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Document &amp; Vision AI</h3><p style="color:#475569;margin:0;">OCR, intelligent document processing, classification and computer vision pipelines.</p></div>
      <div style="padding:28px;border-radius:16px;background:linear-gradient(180deg,#fff,#f8fafc);border:1px solid #e2e8f0;"><h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">AI Platform &amp; MLOps</h3><p style="color:#475569;margin:0;">Private model gateways, evals, observability and governance to run AI safely at scale.</p></div>
    </div>
  </section>

  <section style="margin-bottom:64px;padding:48px;background:#0f172a;color:#fff;border-radius:24px;">
    <h2 style="font-size:28px;font-weight:700;text-align:center;margin:0 0 32px;">Engagement model</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;">
      <div><div style="color:#a78bfa;font-weight:700;margin-bottom:8px;">01 — Discover</div><p style="color:#cbd5e1;margin:0;">Workshops, opportunity mapping, feasibility and ROI modeling.</p></div>
      <div><div style="color:#a78bfa;font-weight:700;margin-bottom:8px;">02 — Design</div><p style="color:#cbd5e1;margin:0;">Architecture, model selection, data &amp; security design.</p></div>
      <div><div style="color:#a78bfa;font-weight:700;margin-bottom:8px;">03 — Build</div><p style="color:#cbd5e1;margin:0;">Iterative delivery with evals, guardrails and integrations.</p></div>
      <div><div style="color:#a78bfa;font-weight:700;margin-bottom:8px;">04 — Operate</div><p style="color:#cbd5e1;margin:0;">Managed ops, monitoring and continuous improvement.</p></div>
    </div>
  </section>

  <section style="margin-bottom:64px;">
    <h2 style="font-size:32px;font-weight:700;text-align:center;margin-bottom:24px;">Frequently asked questions</h2>
    <div style="max-width:820px;margin:0 auto;display:flex;flex-direction:column;gap:12px;">
      <details style="padding:18px 22px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;"><summary style="font-weight:600;cursor:pointer;">Do you use our data to train models?</summary><p style="margin:12px 0 0;color:#475569;">No. Your data stays in your environment and is never used to train shared models.</p></details>
      <details style="padding:18px 22px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;"><summary style="font-weight:600;cursor:pointer;">Which models and providers do you support?</summary><p style="margin:12px 0 0;color:#475569;">OpenAI, Anthropic, Google, Mistral, open-source models, plus private/self-hosted deployments depending on your compliance needs.</p></details>
      <details style="padding:18px 22px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;"><summary style="font-weight:600;cursor:pointer;">How do you handle compliance?</summary><p style="margin:12px 0 0;color:#475569;">GDPR-native designs, role-based access, encryption, audit logging and EU data residency where required.</p></details>
      <details style="padding:18px 22px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;"><summary style="font-weight:600;cursor:pointer;">Do we own the solution?</summary><p style="margin:12px 0 0;color:#475569;">Yes. Source code, models, prompts and documentation are fully transferred. No vendor lock-in.</p></details>
    </div>
  </section>

  <section style="text-align:center;padding:64px 32px;background:linear-gradient(135deg,#a78bfa,#4f46e5);color:#fff;border-radius:24px;">
    <h2 style="font-size:32px;font-weight:800;margin:0 0 12px;">Ready to build your custom AI?</h2>
    <p style="margin:0 0 24px;opacity:0.9;">Let''s scope your highest-impact AI opportunity in a 30-minute call.</p>
    <a href="/contact" style="display:inline-block;background:#fff;color:#4f46e5;padding:14px 32px;border-radius:999px;font-weight:700;text-decoration:none;">Book a discovery call</a>
  </section>',
  'Custom AI Solutions for Enterprises | Bespoke AI Development & Consulting',
  'Custom AI solutions for enterprises: RAG, copilots, autonomous agents and predictive AI built for security, compliance and scale. GDPR-native, EU-based.',
  'Custom Enterprise AI Development, RAG, Copilots, Agents &amp; MLOps'
FROM public.services s WHERE s.slug = 'custom-ai-solutions-for-enterprises';