UPDATE insights_translations 
SET content = REPLACE(
  content, 
  '<div class="executive-summary" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 2rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #00d4ff;">
<h2 style="color: #00d4ff; margin-top: 0;">Executive Summary</h2>
<p><strong>AI SEO (Generative Engine Optimization)</strong>', 
  '<div class="executive-summary" style="background: #111; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #00d4ff; color: #fff;">
<h2 style="color: #00d4ff; margin-top: 0;">Executive Summary</h2>
<p style="color: #fff;"><strong style="color: #fff;">AI SEO (Generative Engine Optimization)</strong>'
)
WHERE insights_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';