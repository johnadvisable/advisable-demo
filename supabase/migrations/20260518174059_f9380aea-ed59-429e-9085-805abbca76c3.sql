UPDATE service_translations
SET long_description = $LD$<p><strong>Managed Kubernetes services for scale-up companies that have outgrown simple hosting,&nbsp;but don't need (or want) a full-time DevOps team.</strong></p>

<h2>Sound familiar?</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;margin:1.5rem 0 2rem;">
  <div style="border:1px solid hsl(var(--border));border-radius:1rem;padding:1.5rem;background:hsl(var(--card));transition:transform .2s;">
    <div style="font-size:2rem;line-height:1;margin-bottom:0.75rem;">📈</div>
    <h4 style="font-size:1.05rem;font-weight:600;color:hsl(var(--foreground));margin:0 0 0.5rem;">You've outgrown Heroku or VPS</h4>
    <p style="color:hsl(var(--muted-foreground));font-size:0.95rem;line-height:1.55;margin:0;">Your infrastructure can no longer keep up with the traffic.</p>
  </div>
  <div style="border:1px solid hsl(var(--border));border-radius:1rem;padding:1.5rem;background:hsl(var(--card));">
    <div style="font-size:2rem;line-height:1;margin-bottom:0.75rem;">💸</div>
    <h4 style="font-size:1.05rem;font-weight:600;color:hsl(var(--foreground));margin:0 0 0.5rem;">Cloud bills are out of control</h4>
    <p style="color:hsl(var(--muted-foreground));font-size:0.95rem;line-height:1.55;margin:0;">You are paying for resources you do not actually use.</p>
  </div>
  <div style="border:1px solid hsl(var(--border));border-radius:1rem;padding:1.5rem;background:hsl(var(--card));">
    <div style="font-size:2rem;line-height:1;margin-bottom:0.75rem;">🐢</div>
    <h4 style="font-size:1.05rem;font-weight:600;color:hsl(var(--foreground));margin:0 0 0.5rem;">Deployments are slow and risky</h4>
    <p style="color:hsl(var(--muted-foreground));font-size:0.95rem;line-height:1.55;margin:0;">Every release takes hours and causes downtime.</p>
  </div>
  <div style="border:1px solid hsl(var(--border));border-radius:1rem;padding:1.5rem;background:hsl(var(--card));">
    <div style="font-size:2rem;line-height:1;margin-bottom:0.75rem;">👥</div>
    <h4 style="font-size:1.05rem;font-weight:600;color:hsl(var(--foreground));margin:0 0 0.5rem;">Hiring DevOps doesn't pencil out</h4>
    <p style="color:hsl(var(--muted-foreground));font-size:0.95rem;line-height:1.55;margin:0;">It is a role that is rarely full-time for a scale-up.</p>
  </div>
</div>

<h2>Service tiers</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;margin:1.5rem 0 2rem;">

  <div style="border:1px solid hsl(var(--border));border-radius:1.25rem;padding:1.75rem;background:hsl(var(--card));display:flex;flex-direction:column;box-shadow:0 1px 3px hsl(var(--foreground)/0.04);">
    <span style="display:inline-flex;align-items:center;padding:0.3rem 0.75rem;background:hsl(var(--primary)/0.1);color:hsl(var(--primary));border-radius:9999px;font-size:0.7rem;font-weight:700;letter-spacing:0.05em;margin-bottom:1rem;width:fit-content;">SETUP PROJECT</span>
    <h3 style="font-size:1.5rem;font-weight:700;color:hsl(var(--foreground));margin:0 0 0.5rem;">K8s Launch</h3>
    <p style="color:hsl(var(--muted-foreground));margin:0 0 1.25rem;line-height:1.55;">We design and build your cluster from scratch. Containerization, CI/CD pipelines, monitoring, and full documentation.</p>
    <ul style="list-style:none;padding:0;margin:0 0 1.5rem;display:flex;flex-direction:column;gap:0.5rem;">
      <li style="display:flex;gap:0.5rem;color:hsl(var(--foreground));font-size:0.95rem;"><span style="color:hsl(var(--primary));font-weight:700;">✓</span><span>Cluster architecture &amp; setup (AWS / GCP)</span></li>
      <li style="display:flex;gap:0.5rem;color:hsl(var(--foreground));font-size:0.95rem;"><span style="color:hsl(var(--primary));font-weight:700;">✓</span><span>Containerization of existing applications</span></li>
      <li style="display:flex;gap:0.5rem;color:hsl(var(--foreground));font-size:0.95rem;"><span style="color:hsl(var(--primary));font-weight:700;">✓</span><span>CI/CD pipeline setup (GitHub Actions / GitLab)</span></li>
      <li style="display:flex;gap:0.5rem;color:hsl(var(--foreground));font-size:0.95rem;"><span style="color:hsl(var(--primary));font-weight:700;">✓</span><span>Monitoring &amp; alerting (Prometheus / Grafana)</span></li>
      <li style="display:flex;gap:0.5rem;color:hsl(var(--foreground));font-size:0.95rem;"><span style="color:hsl(var(--primary));font-weight:700;">✓</span><span>Knowledge transfer &amp; runbooks</span></li>
    </ul>
    <div style="margin-top:auto;padding-top:1rem;border-top:1px solid hsl(var(--border));font-size:0.85rem;color:hsl(var(--muted-foreground));font-style:italic;">One-time project · Pricing upon assessment</div>
  </div>

  <div style="border:2px solid hsl(var(--primary));border-radius:1.25rem;padding:1.75rem;background:hsl(var(--card));display:flex;flex-direction:column;box-shadow:0 8px 24px hsl(var(--primary)/0.12);position:relative;">
    <span style="position:absolute;top:-0.75rem;right:1.5rem;padding:0.25rem 0.75rem;background:hsl(var(--primary));color:hsl(var(--primary-foreground));border-radius:9999px;font-size:0.7rem;font-weight:700;letter-spacing:0.05em;">MOST POPULAR</span>
    <span style="display:inline-flex;align-items:center;padding:0.3rem 0.75rem;background:hsl(var(--primary)/0.1);color:hsl(var(--primary));border-radius:9999px;font-size:0.7rem;font-weight:700;letter-spacing:0.05em;margin-bottom:1rem;width:fit-content;">MANAGED RETAINER</span>
    <h3 style="font-size:1.5rem;font-weight:700;color:hsl(var(--foreground));margin:0 0 0.5rem;">K8s Operate</h3>
    <p style="color:hsl(var(--muted-foreground));margin:0 0 1.25rem;line-height:1.55;">We run your cluster end-to-end. Monitoring, patching, scaling, and incident response,&nbsp;so you stay focused on the product.</p>
    <ul style="list-style:none;padding:0;margin:0 0 1.5rem;display:flex;flex-direction:column;gap:0.5rem;">
      <li style="display:flex;gap:0.5rem;color:hsl(var(--foreground));font-size:0.95rem;"><span style="color:hsl(var(--primary));font-weight:700;">✓</span><span>Monitoring &amp; on-call</span></li>
      <li style="display:flex;gap:0.5rem;color:hsl(var(--foreground));font-size:0.95rem;"><span style="color:hsl(var(--primary));font-weight:700;">✓</span><span>Security patching &amp; version upgrades</span></li>
      <li style="display:flex;gap:0.5rem;color:hsl(var(--foreground));font-size:0.95rem;"><span style="color:hsl(var(--primary));font-weight:700;">✓</span><span>Auto-scaling configuration &amp; tuning</span></li>
      <li style="display:flex;gap:0.5rem;color:hsl(var(--foreground));font-size:0.95rem;"><span style="color:hsl(var(--primary));font-weight:700;">✓</span><span>Performance reporting</span></li>
    </ul>
    <div style="margin-top:auto;padding-top:1rem;border-top:1px solid hsl(var(--border));font-size:0.85rem;color:hsl(var(--muted-foreground));font-style:italic;">Monthly retainer</div>
  </div>

  <div style="border:1px solid hsl(var(--border));border-radius:1.25rem;padding:1.75rem;background:hsl(var(--card));display:flex;flex-direction:column;box-shadow:0 1px 3px hsl(var(--foreground)/0.04);">
    <span style="display:inline-flex;align-items:center;padding:0.3rem 0.75rem;background:hsl(var(--primary)/0.1);color:hsl(var(--primary));border-radius:9999px;font-size:0.7rem;font-weight:700;letter-spacing:0.05em;margin-bottom:1rem;width:fit-content;">FINOPS ENGAGEMENT</span>
    <h3 style="font-size:1.5rem;font-weight:700;color:hsl(var(--foreground));margin:0 0 0.5rem;">K8s Optimize</h3>
    <p style="color:hsl(var(--muted-foreground));margin:0 0 1.25rem;line-height:1.55;">Cost audit, right-sizing, autoscaling tuning, and security hardening to reduce your cloud spend.</p>
    <ul style="list-style:none;padding:0;margin:0 0 1.5rem;display:flex;flex-direction:column;gap:0.5rem;">
      <li style="display:flex;gap:0.5rem;color:hsl(var(--foreground));font-size:0.95rem;"><span style="color:hsl(var(--primary));font-weight:700;">✓</span><span>Cloud cost audit &amp; recommendations</span></li>
      <li style="display:flex;gap:0.5rem;color:hsl(var(--foreground));font-size:0.95rem;"><span style="color:hsl(var(--primary));font-weight:700;">✓</span><span>Resource right-sizing</span></li>
      <li style="display:flex;gap:0.5rem;color:hsl(var(--foreground));font-size:0.95rem;"><span style="color:hsl(var(--primary));font-weight:700;">✓</span><span>Security hardening (CIS Benchmarks)</span></li>
      <li style="display:flex;gap:0.5rem;color:hsl(var(--foreground));font-size:0.95rem;"><span style="color:hsl(var(--primary));font-weight:700;">✓</span><span>Performance benchmarking report</span></li>
    </ul>
    <div style="margin-top:auto;padding-top:1rem;border-top:1px solid hsl(var(--border));font-size:0.85rem;color:hsl(var(--muted-foreground));font-style:italic;">Quarterly engagement</div>
  </div>

</div>

<h2>Tech stack</h2>
<div style="display:flex;flex-wrap:wrap;gap:0.6rem;margin:1.5rem 0 0.5rem;">
  <span style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border:1px solid hsl(var(--border));border-radius:9999px;background:hsl(var(--card));font-weight:500;color:hsl(var(--foreground));font-size:0.9rem;"><img src="https://cdn.simpleicons.org/kubernetes/326CE5" alt="" width="18" height="18" />Kubernetes</span>
  <span style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border:1px solid hsl(var(--border));border-radius:9999px;background:hsl(var(--card));font-weight:500;color:hsl(var(--foreground));font-size:0.9rem;"><img src="https://cdn.simpleicons.org/amazonwebservices/FF9900" alt="" width="18" height="18" />AWS EKS</span>
  <span style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border:1px solid hsl(var(--border));border-radius:9999px;background:hsl(var(--card));font-weight:500;color:hsl(var(--foreground));font-size:0.9rem;"><img src="https://cdn.simpleicons.org/googlecloud/4285F4" alt="" width="18" height="18" />GKE</span>
  <span style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border:1px solid hsl(var(--border));border-radius:9999px;background:hsl(var(--card));font-weight:500;color:hsl(var(--foreground));font-size:0.9rem;"><img src="https://cdn.simpleicons.org/helm/0F1689" alt="" width="18" height="18" />Helm</span>
  <span style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border:1px solid hsl(var(--border));border-radius:9999px;background:hsl(var(--card));font-weight:500;color:hsl(var(--foreground));font-size:0.9rem;"><img src="https://cdn.simpleicons.org/prometheus/E6522C" alt="" width="18" height="18" />Prometheus</span>
  <span style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border:1px solid hsl(var(--border));border-radius:9999px;background:hsl(var(--card));font-weight:500;color:hsl(var(--foreground));font-size:0.9rem;"><img src="https://cdn.simpleicons.org/grafana/F46800" alt="" width="18" height="18" />Grafana</span>
  <span style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border:1px solid hsl(var(--border));border-radius:9999px;background:hsl(var(--card));font-weight:500;color:hsl(var(--foreground));font-size:0.9rem;"><img src="https://cdn.simpleicons.org/istio/466BB0" alt="" width="18" height="18" />Istio</span>
  <span style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border:1px solid hsl(var(--border));border-radius:9999px;background:hsl(var(--card));font-weight:500;color:hsl(var(--foreground));font-size:0.9rem;"><img src="https://cdn.simpleicons.org/argo/EF7B4D" alt="" width="18" height="18" />ArgoCD</span>
  <span style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border:1px solid hsl(var(--border));border-radius:9999px;background:hsl(var(--card));font-weight:500;color:hsl(var(--foreground));font-size:0.9rem;"><img src="https://cdn.simpleicons.org/vault/FFEC6E" alt="" width="18" height="18" />Vault</span>
  <span style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border:1px solid hsl(var(--border));border-radius:9999px;background:hsl(var(--card));font-weight:500;color:hsl(var(--foreground));font-size:0.9rem;"><img src="https://cdn.simpleicons.org/terraform/7B42BC" alt="" width="18" height="18" />Terraform</span>
  <span style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border:1px solid hsl(var(--border));border-radius:9999px;background:hsl(var(--card));font-weight:500;color:hsl(var(--foreground));font-size:0.9rem;"><img src="https://cdn.simpleicons.org/githubactions/2088FF" alt="" width="18" height="18" />GitHub Actions</span>
</div>$LD$
WHERE language_id = 1
  AND service_id = (SELECT id FROM services WHERE slug = 'cloud-infrastructure-k8s');