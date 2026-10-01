UPDATE public.services SET display_order = 3 WHERE slug = 'cloud-infrastructure-k8s';

WITH new_service AS (
  INSERT INTO public.services (category_id, slug, emoji, display_order, icon_name, featured_image, is_parent, is_seo_only, keywords)
  VALUES ('7ab92ece-8e9c-495b-b1fb-dfe5cb62aec1', 'fractional-chief-ai-officer', '🧠', 2, 'BrainCircuit', '/images/services/venture-product-development.jpg', true, false, ARRAY['fractional chief ai officer','fractional caio','ai leadership','ai strategy consulting','ai transformation']::text[])
  RETURNING id
)
INSERT INTO public.service_translations (service_id, language_id, title, short_description, long_description)
SELECT id, 1,
'Fractional Chief AI Officer',
'Senior AI leadership on demand. A Fractional Chief AI Officer who sets your AI strategy, governs the risk and turns pilots into production, without a full-time executive hire.',
$HTML$<section style="padding:80px 24px;background:linear-gradient(180deg,#0a0a1a 0%,#141432 100%);color:#fff;text-align:center;border-radius:24px;margin-bottom:48px;">
    <p style="text-transform:uppercase;letter-spacing:2px;font-size:13px;color:#a78bfa;margin-bottom:16px;">Fractional Chief AI Officer</p>
    <h1 style="font-size:clamp(36px,5vw,64px);font-weight:800;line-height:1.05;margin:0 0 20px;">Executive AI leadership,<br/>without the full-time hire.</h1>
    <p style="font-size:18px;max-width:720px;margin:0 auto 32px;color:#cbd5e1;">A Fractional Chief AI Officer who owns your AI strategy, governance and roadmap: prioritising the use cases that pay back, killing the ones that do not, and getting real systems into production.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="/contact" style="background:#a78bfa;color:#0a0a1a;padding:14px 28px;border-radius:999px;font-weight:600;text-decoration:none;">Book a discovery call</a>
      <a href="#engagement" style="border:1px solid rgba(255,255,255,0.3);color:#fff;padding:14px 28px;border-radius:999px;font-weight:600;text-decoration:none;">See how it works</a>
    </div>
  </section>

  <section style="margin-bottom:64px;">
    <h2 style="font-size:32px;font-weight:700;text-align:center;margin-bottom:12px;">Sound familiar?</h2>
    <p style="text-align:center;color:#64748b;max-width:680px;margin:0 auto 40px;">Most organisations do not have an AI problem. They have an AI leadership gap.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;">
      <div style="padding:28px;border:1px solid #e2e8f0;border-radius:16px;background:#fff;"><div style="font-size:26px;margin-bottom:12px;">🧪</div><h3 style="font-size:18px;font-weight:700;margin:0 0 8px;">Pilots that never ship</h3><p style="color:#475569;margin:0;">Impressive demos, promising POCs, and nothing running in production six months later.</p></div>
      <div style="padding:28px;border:1px solid #e2e8f0;border-radius:16px;background:#fff;"><div style="font-size:26px;margin-bottom:12px;">🧭</div><h3 style="font-size:18px;font-weight:700;margin:0 0 8px;">No clear priority</h3><p style="color:#475569;margin:0;">Every department wants AI. Nobody can say which use case creates value first.</p></div>
      <div style="padding:28px;border:1px solid #e2e8f0;border-radius:16px;background:#fff;"><div style="font-size:26px;margin-bottom:12px;">⚖️</div><h3 style="font-size:18px;font-weight:700;margin:0 0 8px;">Governance anxiety</h3><p style="color:#475569;margin:0;">Legal, security and the board are asking about the EU AI Act, data and model risk.</p></div>
      <div style="padding:28px;border:1px solid #e2e8f0;border-radius:16px;background:#fff;"><div style="font-size:26px;margin-bottom:12px;">🛒</div><h3 style="font-size:18px;font-weight:700;margin:0 0 8px;">Vendor overload</h3><p style="color:#475569;margin:0;">Overlapping tools, licences and consultants, with no architecture holding them together.</p></div>
    </div>
  </section>

  <section style="margin-bottom:64px;">
    <h2 style="font-size:32px;font-weight:700;text-align:center;margin-bottom:12px;">What your Fractional CAIO owns</h2>
    <p style="text-align:center;color:#64748b;max-width:680px;margin:0 auto 40px;">One accountable senior leader across strategy, delivery and governance.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
      <div style="padding:28px;border-radius:16px;background:linear-gradient(180deg,#fff,#f8fafc);border:1px solid #e2e8f0;"><h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">AI strategy &amp; roadmap</h3><p style="color:#475569;margin:0;">A ranked portfolio of use cases with business cases, owners and a realistic delivery sequence.</p></div>
      <div style="padding:28px;border-radius:16px;background:linear-gradient(180deg,#fff,#f8fafc);border:1px solid #e2e8f0;"><h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Governance &amp; compliance</h3><p style="color:#475569;margin:0;">AI policy, risk register, human-in-the-loop rules and EU AI Act and GDPR alignment.</p></div>
      <div style="padding:28px;border-radius:16px;background:linear-gradient(180deg,#fff,#f8fafc);border:1px solid #e2e8f0;"><h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Architecture &amp; vendor strategy</h3><p style="color:#475569;margin:0;">Build vs buy decisions, model and platform selection, data foundations, exit paths.</p></div>
      <div style="padding:28px;border-radius:16px;background:linear-gradient(180deg,#fff,#f8fafc);border:1px solid #e2e8f0;"><h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Delivery oversight</h3><p style="color:#475569;margin:0;">Steering internal teams and partners from pilot to production, with quality gates that hold.</p></div>
      <div style="padding:28px;border-radius:16px;background:linear-gradient(180deg,#fff,#f8fafc);border:1px solid #e2e8f0;"><h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Team enablement</h3><p style="color:#475569;margin:0;">Upskilling leaders and practitioners, hiring plans, and operating rhythms that survive handover.</p></div>
      <div style="padding:28px;border-radius:16px;background:linear-gradient(180deg,#fff,#f8fafc);border:1px solid #e2e8f0;"><h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Board-level reporting</h3><p style="color:#475569;margin:0;">Plain-language updates on value delivered, risk posture and what happens next.</p></div>
    </div>
  </section>

  <section id="engagement" style="margin-bottom:64px;">
    <h2 style="font-size:32px;font-weight:700;text-align:center;margin-bottom:40px;">Engagement models</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;">
      <div style="padding:32px;border-radius:20px;border:1px solid #e2e8f0;background:#fff;display:flex;flex-direction:column;">
        <p style="text-transform:uppercase;letter-spacing:1.5px;font-size:12px;color:#a78bfa;margin:0 0 10px;">Advisory</p>
        <h3 style="font-size:22px;font-weight:700;margin:0 0 10px;">AI Sounding Board</h3>
        <p style="color:#475569;margin:0 0 18px;">For leadership teams that need senior judgement, not another workstream.</p>
        <ul style="color:#475569;padding-left:18px;margin:0;line-height:1.9;"><li>Monthly strategy sessions</li><li>Use case triage and prioritisation</li><li>Vendor and proposal reviews</li><li>On-call executive guidance</li></ul>
      </div>
      <div style="padding:32px;border-radius:20px;border:2px solid #a78bfa;background:linear-gradient(180deg,#faf7ff,#fff);display:flex;flex-direction:column;">
        <p style="text-transform:uppercase;letter-spacing:1.5px;font-size:12px;color:#a78bfa;margin:0 0 10px;">Most chosen</p>
        <h3 style="font-size:22px;font-weight:700;margin:0 0 10px;">Embedded Fractional CAIO</h3>
        <p style="color:#475569;margin:0 0 18px;">Part-time, in your organisation, owning the AI agenda end to end.</p>
        <ul style="color:#475569;padding-left:18px;margin:0;line-height:1.9;"><li>Fixed days per week with your teams</li><li>Roadmap, governance and delivery ownership</li><li>Steering of internal and external squads</li><li>Board and executive reporting</li></ul>
      </div>
      <div style="padding:32px;border-radius:20px;border:1px solid #e2e8f0;background:#fff;display:flex;flex-direction:column;">
        <p style="text-transform:uppercase;letter-spacing:1.5px;font-size:12px;color:#a78bfa;margin:0 0 10px;">Transformation</p>
        <h3 style="font-size:22px;font-weight:700;margin:0 0 10px;">AI Function Build-Out</h3>
        <p style="color:#475569;margin:0 0 18px;">Stand up an internal AI capability, then hand it over.</p>
        <ul style="color:#475569;padding-left:18px;margin:0;line-height:1.9;"><li>Operating model and team design</li><li>Hiring and onboarding support</li><li>Platform and tooling foundations</li><li>Structured handover to your permanent leader</li></ul>
      </div>
    </div>
  </section>

  <section style="margin-bottom:64px;padding:48px 32px;border-radius:24px;background:linear-gradient(135deg,#0a0a1a,#241a4d);color:#fff;text-align:center;">
    <h2 style="font-size:30px;font-weight:700;margin:0 0 12px;">Ready to put someone in charge of AI?</h2>
    <p style="color:#cbd5e1;max-width:640px;margin:0 auto 28px;">Start with a discovery call. We will map where you are, what is worth doing next, and whether a Fractional Chief AI Officer is the right answer for you.</p>
    <a href="/contact" style="background:#a78bfa;color:#0a0a1a;padding:14px 30px;border-radius:999px;font-weight:600;text-decoration:none;">Talk to Advisable</a>
  </section>$HTML$
FROM new_service;

WITH s AS (SELECT id FROM public.services WHERE slug = 'fractional-chief-ai-officer'),
ins AS (
  INSERT INTO public.service_faqs (service_id, display_order, is_active)
  SELECT s.id, o, true FROM s, generate_series(1,6) AS o
  RETURNING id, display_order
)
INSERT INTO public.service_faq_translations (faq_id, language_id, question, answer)
SELECT ins.id, 1, q.question, q.answer
FROM ins
JOIN (VALUES
 (1,'What is a Fractional Chief AI Officer?','A Fractional Chief AI Officer is a senior AI executive who works with your company part-time. You get the strategic judgement, governance discipline and delivery oversight of a CAIO for a fraction of the cost and commitment of a full-time hire.'),
 (2,'How is this different from AI consulting?','Consultants deliver reports and projects. A Fractional CAIO carries accountability: they own the roadmap, make the build versus buy calls, steer the teams doing the work and report outcomes to your board.'),
 (3,'How much of their time do we get?','Engagements typically run from a couple of days per month for advisory work up to several days per week for embedded leadership. We size the commitment around your roadmap, not a fixed template.'),
 (4,'Do we need a data team before we start?','No. Part of the role is assessing your data foundations honestly and sequencing the work so early use cases deliver value while the underlying data and platform maturity catches up.'),
 (5,'How do you handle AI governance and the EU AI Act?','We set up an AI policy, a risk register and clear human oversight rules, classify your use cases by risk, and align documentation and controls with the EU AI Act and GDPR requirements that apply to you.'),
 (6,'What happens at the end of the engagement?','Everything transfers to you: roadmap, governance artefacts, architecture decisions and documentation. Where you are hiring a permanent AI leader, we support the search and run a structured handover.')
) AS q(ord, question, answer) ON q.ord = ins.display_order;