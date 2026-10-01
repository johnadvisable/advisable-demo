UPDATE insights_translations 
SET content = REPLACE(
  content, 
  '<h2>How AI Search Engines Choose Sources (Practically)</h2>', 
  '<h2>How AI Search Engines Choose Sources (Practically)</h2>

<figure style="margin: 2rem 0; text-align: center;">
  <img src="/images/insights/ai-search-sources-flow-2026.png" alt="How AI Search Selects Sources (2026) - User Query, Fan-out Retrieval, Chunking & Ranking, Trust & Evidence Checks, Answer Synthesis, Citations & Links" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" loading="lazy" />
  <figcaption style="margin-top: 1rem; font-size: 0.9rem; color: #666; font-style: italic;">The 6-step process of how AI search engines select and cite sources in 2026</figcaption>
</figure>'
)
WHERE insights_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';