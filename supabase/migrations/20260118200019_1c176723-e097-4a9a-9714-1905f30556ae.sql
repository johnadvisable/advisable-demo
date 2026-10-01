-- Populate service_uvps for all parent services with 3 UVPs each
-- Using AI-curated content for each service

-- 1. AI Creative Studio
INSERT INTO service_uvps (service_id, icon_name, metric_value, display_order) VALUES
('930de264-dede-433b-a99b-a6ec7d5281db', 'Zap', '10x', 1),
('930de264-dede-433b-a99b-a6ec7d5281db', 'Clock', '48h', 2),
('930de264-dede-433b-a99b-a6ec7d5281db', 'TrendingUp', '300%', 3);

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Faster Production', 'AI-powered creative production speed'
FROM service_uvps WHERE service_id = '930de264-dede-433b-a99b-a6ec7d5281db' AND display_order = 1;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Delivery Time', 'Average campaign turnaround'
FROM service_uvps WHERE service_id = '930de264-dede-433b-a99b-a6ec7d5281db' AND display_order = 2;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Creative Output', 'More variations per campaign'
FROM service_uvps WHERE service_id = '930de264-dede-433b-a99b-a6ec7d5281db' AND display_order = 3;

-- 2. AI Web & App Development
INSERT INTO service_uvps (service_id, icon_name, metric_value, display_order) VALUES
('bd0df4a0-63c9-4646-aac2-28a96ce15a89', 'Rocket', '3x', 1),
('bd0df4a0-63c9-4646-aac2-28a96ce15a89', 'Shield', '99.9%', 2),
('bd0df4a0-63c9-4646-aac2-28a96ce15a89', 'Code', '50%', 3);

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Faster Development', 'AI-accelerated coding speed'
FROM service_uvps WHERE service_id = 'bd0df4a0-63c9-4646-aac2-28a96ce15a89' AND display_order = 1;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Uptime SLA', 'Enterprise-grade reliability'
FROM service_uvps WHERE service_id = 'bd0df4a0-63c9-4646-aac2-28a96ce15a89' AND display_order = 2;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Cost Reduction', 'Lower development costs'
FROM service_uvps WHERE service_id = 'bd0df4a0-63c9-4646-aac2-28a96ce15a89' AND display_order = 3;

-- 3. Brand & Strategy
INSERT INTO service_uvps (service_id, icon_name, metric_value, display_order) VALUES
('372cf029-6dd5-4149-9e84-8241093c8206', 'Target', '85%', 1),
('372cf029-6dd5-4149-9e84-8241093c8206', 'Award', '40+', 2),
('372cf029-6dd5-4149-9e84-8241093c8206', 'Users', '2M+', 3);

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Brand Recall', 'Improved brand recognition'
FROM service_uvps WHERE service_id = '372cf029-6dd5-4149-9e84-8241093c8206' AND display_order = 1;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Brands Built', 'Successful brand launches'
FROM service_uvps WHERE service_id = '372cf029-6dd5-4149-9e84-8241093c8206' AND display_order = 2;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Users Reached', 'Total audience exposure'
FROM service_uvps WHERE service_id = '372cf029-6dd5-4149-9e84-8241093c8206' AND display_order = 3;

-- 4. Conversion & Revenue Optimization
INSERT INTO service_uvps (service_id, icon_name, metric_value, display_order) VALUES
('dca1b07c-081b-4b9f-afac-1de85843c529', 'TrendingUp', '156%', 1),
('dca1b07c-081b-4b9f-afac-1de85843c529', 'DollarSign', '€50M+', 2),
('dca1b07c-081b-4b9f-afac-1de85843c529', 'BarChart', '4.2x', 3);

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Avg. CVR Lift', 'Conversion rate improvement'
FROM service_uvps WHERE service_id = 'dca1b07c-081b-4b9f-afac-1de85843c529' AND display_order = 1;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Revenue Generated', 'Incremental revenue driven'
FROM service_uvps WHERE service_id = 'dca1b07c-081b-4b9f-afac-1de85843c529' AND display_order = 2;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'ROAS Improvement', 'Return on ad spend boost'
FROM service_uvps WHERE service_id = 'dca1b07c-081b-4b9f-afac-1de85843c529' AND display_order = 3;

-- 5. Engineering & Platform
INSERT INTO service_uvps (service_id, icon_name, metric_value, display_order) VALUES
('f299cd06-3f82-4e0f-a424-2edaadfc74d1', 'Server', '99.99%', 1),
('f299cd06-3f82-4e0f-a424-2edaadfc74d1', 'Gauge', '<100ms', 2),
('f299cd06-3f82-4e0f-a424-2edaadfc74d1', 'Scale', '10M+', 3);

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Platform Uptime', 'Guaranteed availability'
FROM service_uvps WHERE service_id = 'f299cd06-3f82-4e0f-a424-2edaadfc74d1' AND display_order = 1;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Response Time', 'API latency target'
FROM service_uvps WHERE service_id = 'f299cd06-3f82-4e0f-a424-2edaadfc74d1' AND display_order = 2;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Users Scaled', 'Platform capacity proven'
FROM service_uvps WHERE service_id = 'f299cd06-3f82-4e0f-a424-2edaadfc74d1' AND display_order = 3;

-- 6. Fundraising & Venture Readiness
INSERT INTO service_uvps (service_id, icon_name, metric_value, display_order) VALUES
('0c09cd5e-fe86-4b7f-8d64-8576d97370cf', 'Banknote', '€25M+', 1),
('0c09cd5e-fe86-4b7f-8d64-8576d97370cf', 'CheckCircle', '85%', 2),
('0c09cd5e-fe86-4b7f-8d64-8576d97370cf', 'Building', '30+', 3);

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Capital Raised', 'Total funding secured'
FROM service_uvps WHERE service_id = '0c09cd5e-fe86-4b7f-8d64-8576d97370cf' AND display_order = 1;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Success Rate', 'Funded ventures ratio'
FROM service_uvps WHERE service_id = '0c09cd5e-fe86-4b7f-8d64-8576d97370cf' AND display_order = 2;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'VC Partners', 'Investor network access'
FROM service_uvps WHERE service_id = '0c09cd5e-fe86-4b7f-8d64-8576d97370cf' AND display_order = 3;

-- 7. Go-to-Market & Growth
INSERT INTO service_uvps (service_id, icon_name, metric_value, display_order) VALUES
('0a2dc7e9-1db5-4e54-9766-e2077f08e37e', 'Rocket', '6 weeks', 1),
('0a2dc7e9-1db5-4e54-9766-e2077f08e37e', 'TrendingUp', '250%', 2),
('0a2dc7e9-1db5-4e54-9766-e2077f08e37e', 'Globe', '15+', 3);

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Launch Time', 'Average go-to-market speed'
FROM service_uvps WHERE service_id = '0a2dc7e9-1db5-4e54-9766-e2077f08e37e' AND display_order = 1;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Growth Rate', 'First-year customer growth'
FROM service_uvps WHERE service_id = '0a2dc7e9-1db5-4e54-9766-e2077f08e37e' AND display_order = 2;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Markets Entered', 'Geographic expansion'
FROM service_uvps WHERE service_id = '0a2dc7e9-1db5-4e54-9766-e2077f08e37e' AND display_order = 3;

-- 8. Ideation & Venture Thesis
INSERT INTO service_uvps (service_id, icon_name, metric_value, display_order) VALUES
('4bd0144d-92c8-467b-94d9-e45c34133298', 'Lightbulb', '100+', 1),
('4bd0144d-92c8-467b-94d9-e45c34133298', 'Target', '72%', 2),
('4bd0144d-92c8-467b-94d9-e45c34133298', 'Clock', '4 weeks', 3);

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Ideas Validated', 'Concepts tested to date'
FROM service_uvps WHERE service_id = '4bd0144d-92c8-467b-94d9-e45c34133298' AND display_order = 1;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Viability Rate', 'Ideas that reached MVP'
FROM service_uvps WHERE service_id = '4bd0144d-92c8-467b-94d9-e45c34133298' AND display_order = 2;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Thesis Sprint', 'Ideation process duration'
FROM service_uvps WHERE service_id = '4bd0144d-92c8-467b-94d9-e45c34133298' AND display_order = 3;

-- 9. Paid Growth Systems
INSERT INTO service_uvps (service_id, icon_name, metric_value, display_order) VALUES
('05d09560-7de0-49a0-9cd5-ea99f11ce5a3', 'DollarSign', '4.8x', 1),
('05d09560-7de0-49a0-9cd5-ea99f11ce5a3', 'TrendingDown', '-35%', 2),
('05d09560-7de0-49a0-9cd5-ea99f11ce5a3', 'Coins', '€80M+', 3);

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Avg. ROAS', 'Return on ad spend'
FROM service_uvps WHERE service_id = '05d09560-7de0-49a0-9cd5-ea99f11ce5a3' AND display_order = 1;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'CPA Reduction', 'Cost per acquisition savings'
FROM service_uvps WHERE service_id = '05d09560-7de0-49a0-9cd5-ea99f11ce5a3' AND display_order = 2;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Ad Spend Managed', 'Total budget optimized'
FROM service_uvps WHERE service_id = '05d09560-7de0-49a0-9cd5-ea99f11ce5a3' AND display_order = 3;

-- 10. SEO & AI Visibility
INSERT INTO service_uvps (service_id, icon_name, metric_value, display_order) VALUES
('2dcfdc71-1688-487d-a3f6-806c81d80abb', 'Search', '500%', 1),
('2dcfdc71-1688-487d-a3f6-806c81d80abb', 'ArrowUp', 'Top 3', 2),
('2dcfdc71-1688-487d-a3f6-806c81d80abb', 'Eye', '10M+', 3);

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Traffic Growth', 'Organic traffic increase'
FROM service_uvps WHERE service_id = '2dcfdc71-1688-487d-a3f6-806c81d80abb' AND display_order = 1;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Ranking Target', 'Keywords in top positions'
FROM service_uvps WHERE service_id = '2dcfdc71-1688-487d-a3f6-806c81d80abb' AND display_order = 2;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Impressions', 'Monthly search visibility'
FROM service_uvps WHERE service_id = '2dcfdc71-1688-487d-a3f6-806c81d80abb' AND display_order = 3;

-- 11. Validation & Market Proof
INSERT INTO service_uvps (service_id, icon_name, metric_value, display_order) VALUES
('7a8485bf-3f1d-4c3c-a773-360288c3f9c0', 'FlaskConical', '200+', 1),
('7a8485bf-3f1d-4c3c-a773-360288c3f9c0', 'Users', '50K+', 2),
('7a8485bf-3f1d-4c3c-a773-360288c3f9c0', 'Timer', '8 weeks', 3);

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Tests Run', 'Experiments conducted'
FROM service_uvps WHERE service_id = '7a8485bf-3f1d-4c3c-a773-360288c3f9c0' AND display_order = 1;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Users Tested', 'Beta participants engaged'
FROM service_uvps WHERE service_id = '7a8485bf-3f1d-4c3c-a773-360288c3f9c0' AND display_order = 2;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Validation Time', 'Full market proof cycle'
FROM service_uvps WHERE service_id = '7a8485bf-3f1d-4c3c-a773-360288c3f9c0' AND display_order = 3;

-- 12. Venture Product Development
INSERT INTO service_uvps (service_id, icon_name, metric_value, display_order) VALUES
('2201c320-1dcf-4c99-bfea-2f8ae88ae5fd', 'Package', '25+', 1),
('2201c320-1dcf-4c99-bfea-2f8ae88ae5fd', 'Clock', '12 weeks', 2),
('2201c320-1dcf-4c99-bfea-2f8ae88ae5fd', 'Percent', '90%', 3);

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Products Built', 'Ventures launched'
FROM service_uvps WHERE service_id = '2201c320-1dcf-4c99-bfea-2f8ae88ae5fd' AND display_order = 1;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'MVP Timeline', 'Idea to launch speed'
FROM service_uvps WHERE service_id = '2201c320-1dcf-4c99-bfea-2f8ae88ae5fd' AND display_order = 2;

INSERT INTO service_uvp_translations (uvp_id, language_id, label, description) 
SELECT id, 1, 'Retention Rate', 'Products still active'
FROM service_uvps WHERE service_id = '2201c320-1dcf-4c99-bfea-2f8ae88ae5fd' AND display_order = 3;