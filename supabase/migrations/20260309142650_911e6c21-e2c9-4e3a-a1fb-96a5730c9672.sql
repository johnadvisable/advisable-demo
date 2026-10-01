
UPDATE public.insights_translations
SET content = REPLACE(
  content,
  '<h2>The Sectors Leading the Charge</h2>',
  '<figure><img src="/images/insights/athens-startup-sectors.png" alt="Greek startup sectors: AI, Biotech, Fintech, Agritech, Robotics, and ClimateTech" width="1200" height="630" loading="lazy" style="width:100%;height:auto;border-radius:0.5rem" /></figure>

<h2>The Sectors Leading the Charge</h2>'
)
WHERE id = '7c08361d-4e9a-4092-96bd-2129a7b51b4f';
