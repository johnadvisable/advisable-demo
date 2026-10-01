-- Insert UVPs for Google Ads Campaigns service
INSERT INTO service_uvps (service_id, icon_name, metric_value, display_order, is_active)
SELECT 
  s.id,
  'TrendingUp',
  '19x ROAS',
  1,
  true
FROM services s WHERE s.slug = 'google-ads-campaigns'
UNION ALL
SELECT 
  s.id,
  'Target',
  '-40%',
  2,
  true
FROM services s WHERE s.slug = 'google-ads-campaigns'
UNION ALL
SELECT 
  s.id,
  'Zap',
  '2x',
  3,
  true
FROM services s WHERE s.slug = 'google-ads-campaigns';

-- Insert English translations for these UVPs
INSERT INTO service_uvp_translations (uvp_id, language_id, label, description)
SELECT 
  su.id,
  1,
  'Average ROAS',
  'Our clients achieve exceptional 19x return on ad spend through precision targeting and continuous optimization'
FROM service_uvps su
JOIN services s ON s.id = su.service_id
WHERE s.slug = 'google-ads-campaigns' AND su.metric_value = '19x ROAS';

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description)
SELECT 
  su.id,
  1,
  'Lower CPA',
  'Reduce your cost per acquisition by up to 40% with our data-driven bid strategies and audience segmentation'
FROM service_uvps su
JOIN services s ON s.id = su.service_id
WHERE s.slug = 'google-ads-campaigns' AND su.metric_value = '-40%';

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description)
SELECT 
  su.id,
  1,
  'Conversion Rate',
  'Double your conversion rates with optimized landing pages, compelling ad copy, and smart remarketing'
FROM service_uvps su
JOIN services s ON s.id = su.service_id
WHERE s.slug = 'google-ads-campaigns' AND su.metric_value = '2x';