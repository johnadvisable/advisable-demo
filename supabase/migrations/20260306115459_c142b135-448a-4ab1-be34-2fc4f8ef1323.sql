
-- Update featured_image on the insights record
UPDATE insights 
SET featured_image = '/images/insights/ai-powered-growth-stack-ecommerce-2026.png',
    og_image = '/images/insights/ai-powered-growth-stack-ecommerce-2026.png',
    twitter_image = '/images/insights/ai-powered-growth-stack-ecommerce-2026.png'
WHERE slug = 'ai-powered-growth-stack-ecommerce-2026';

-- Prepend image before the bold excerpt in the content
UPDATE insights_translations
SET content = '<img src="/images/insights/ai-powered-growth-stack-ecommerce-2026.png" alt="Building an AI-Powered Growth Stack for E-Commerce in 2026" style="width:100%;border-radius:8px;margin-bottom:1.5rem;" />' || content
WHERE insights_id = (SELECT id FROM insights WHERE slug = 'ai-powered-growth-stack-ecommerce-2026')
  AND language_id = 1;
