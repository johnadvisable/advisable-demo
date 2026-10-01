-- Update the featured_image for the vibe-coding article (data update via DO block)
UPDATE public.insights 
SET featured_image = '/images/insights/vibe-coding-to-agentic-engineering.png',
    updated_at = now()
WHERE slug = 'from-vibe-coding-to-agentic-engineering';
