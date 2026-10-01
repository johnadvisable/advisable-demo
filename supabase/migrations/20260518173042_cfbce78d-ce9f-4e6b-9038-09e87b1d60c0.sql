
DO $$
DECLARE
  v_category_id uuid;
  v_service_id uuid := gen_random_uuid();
  v_long_desc text;
  v_faq1_id uuid := gen_random_uuid();
  v_faq2_id uuid := gen_random_uuid();
  v_faq3_id uuid := gen_random_uuid();
BEGIN
  SELECT id INTO v_category_id FROM public.service_categories WHERE slug = 'technology';

  -- Skip if already created
  IF EXISTS (SELECT 1 FROM public.services WHERE slug = 'cloud-infrastructure-k8s') THEN
    RETURN;
  END IF;

  INSERT INTO public.services (id, category_id, slug, emoji, icon_name, display_order, is_parent, parent_service_id, is_seo_only)
  VALUES (v_service_id, v_category_id, 'cloud-infrastructure-k8s', '☁️', 'Cloud', 1, true, NULL, false);

  v_long_desc :=
'<p><strong>Managed Kubernetes services for scale-up companies that have outgrown simple hosting,&nbsp;but don''t need (or want) a full-time DevOps team.</strong></p>'
|| '<h2>Sound familiar?</h2>'
|| '<ul>'
|| '<li><strong>You''ve outgrown Heroku or VPS</strong> - Your infrastructure can no longer keep up with the traffic.</li>'
|| '<li><strong>Cloud bills are out of control</strong> - You are paying for resources you do not actually use.</li>'
|| '<li><strong>Deployments are slow and risky</strong> - Every release takes hours and causes downtime.</li>'
|| '<li><strong>Hiring DevOps doesn''t pencil out</strong> - It is a role that is rarely full-time for a scale-up.</li>'
|| '</ul>'
|| '<h2>Service tiers</h2>'
|| '<h3>K8s Launch - Setup project</h3>'
|| '<p>We design and build your cluster from scratch. Containerization, CI/CD pipelines, monitoring, and full documentation.</p>'
|| '<ul>'
|| '<li>Cluster architecture &amp; setup (AWS / GCP)</li>'
|| '<li>Containerization of existing applications</li>'
|| '<li>CI/CD pipeline setup (GitHub Actions / GitLab)</li>'
|| '<li>Monitoring &amp; alerting (Prometheus / Grafana)</li>'
|| '<li>Knowledge transfer &amp; runbooks</li>'
|| '</ul>'
|| '<p><em>One-time project &middot; Pricing upon assessment</em></p>'
|| '<h3>K8s Operate - Managed retainer</h3>'
|| '<p>We run your cluster end-to-end. Monitoring, patching, scaling, and incident response,&nbsp;so you stay focused on the product.</p>'
|| '<ul>'
|| '<li>Monitoring &amp; on-call</li>'
|| '<li>Security patching &amp; version upgrades</li>'
|| '<li>Auto-scaling configuration &amp; tuning</li>'
|| '<li>Performance reporting</li>'
|| '</ul>'
|| '<p><em>Monthly retainer</em></p>'
|| '<h3>K8s Optimize - FinOps engagement</h3>'
|| '<p>Cost audit, right-sizing, autoscaling tuning, and security hardening to reduce your cloud spend.</p>'
|| '<ul>'
|| '<li>Cloud cost audit &amp; recommendations</li>'
|| '<li>Resource right-sizing</li>'
|| '<li>Security hardening (CIS Benchmarks)</li>'
|| '<li>Performance benchmarking report</li>'
|| '</ul>'
|| '<p><em>Quarterly engagement</em></p>'
|| '<h2>Tech stack</h2>'
|| '<p>Kubernetes, AWS EKS, GKE, Helm, Prometheus, Grafana, Istio, ArgoCD, Vault, Terraform, GitHub Actions.</p>'
|| '<h2>How it works</h2>'
|| '<ol>'
|| '<li><strong>Free discovery call</strong> - We learn about your current setup, goals, and pain points. No commitment.</li>'
|| '<li><strong>Infrastructure audit</strong> - We assess your existing infrastructure and deliver a written report with clear recommendations.</li>'
|| '<li><strong>Proposal &amp; roadmap</strong> - We propose the right tier and a detailed implementation timeline tailored to your team.</li>'
|| '<li><strong>Implementation</strong> - Setup, migration, or optimization, depending on your package. Zero-downtime approach throughout.</li>'
|| '<li><strong>Handover or ongoing ops</strong> - Full knowledge transfer to your team, or a smooth transition to a managed retainer.</li>'
|| '</ol>';

  INSERT INTO public.service_translations (service_id, language_id, title, short_description, long_description, seo_title, meta_description, seo_h2_title)
  VALUES (
    v_service_id, 1,
    'Cloud Infrastructure & K8s',
    'Scale your infrastructure. Not your headcount. Managed Kubernetes for scale-up teams that have outgrown simple hosting,&nbsp;but don''t need a full-time DevOps team.',
    v_long_desc,
    'Cloud Infrastructure & Kubernetes Services',
    'Managed Kubernetes and cloud infrastructure for scale-up companies. Cluster setup, FinOps cost optimization, and managed operations on AWS EKS and GCP GKE.',
    'Managed Kubernetes & Cloud Infrastructure for Scale-Ups'
  );

  -- FAQs
  INSERT INTO public.service_faqs (id, service_id, display_order, is_active) VALUES
    (v_faq1_id, v_service_id, 1, true),
    (v_faq2_id, v_service_id, 2, true),
    (v_faq3_id, v_service_id, 3, true);

  INSERT INTO public.service_faq_translations (faq_id, language_id, question, answer) VALUES
    (v_faq1_id, 1,
      'Do I need to already be using Docker or containers?',
      'Not at all. The K8s Launch package includes containerization of your existing applications as part of the engagement.'),
    (v_faq2_id, 1,
      'Which cloud providers do you support?',
      'AWS (EKS) and Google Cloud (GKE). We recommend the right one based on your existing setup,&nbsp;but there is no partnership lock-in.'),
    (v_faq3_id, 1,
      'What if I want to take back control later?',
      'Every engagement is delivered with complete documentation and runbooks. There is no vendor lock-in,&nbsp;but the infrastructure is always yours.');
END $$;
