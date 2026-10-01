-- Populate child_services_intro for all parent services in English (language_id = 1)

-- AI Creative Studio
UPDATE service_translations 
SET child_services_intro = 'From concept to campaign—explore our AI-powered creative production capabilities.'
WHERE service_id = '930de264-dede-433b-a99b-a6ec7d5281db' AND language_id = 1;

-- AI Web & App Development
UPDATE service_translations 
SET child_services_intro = 'Build smarter, ship faster—discover our full-stack AI development services.'
WHERE service_id = 'bd0df4a0-63c9-4646-aac2-28a96ce15a89' AND language_id = 1;

-- Brand & Strategy
UPDATE service_translations 
SET child_services_intro = 'Shape perception and drive preference—our strategic brand-building services.'
WHERE service_id = '372cf029-6dd5-4149-9e84-8241093c8206' AND language_id = 1;

-- Conversion & Revenue Optimization
UPDATE service_translations 
SET child_services_intro = 'Turn traffic into revenue—explore our conversion and growth optimization services.'
WHERE service_id = 'dca1b07c-081b-4b9f-afac-1de85843c529' AND language_id = 1;

-- Engineering & Platform
UPDATE service_translations 
SET child_services_intro = 'Scalable infrastructure, seamless execution—our engineering and platform services.'
WHERE service_id = 'f299cd06-3f82-4e0f-a424-2edaadfc74d1' AND language_id = 1;

-- Fundraising & Venture Readiness
UPDATE service_translations 
SET child_services_intro = 'Get investor-ready—explore our fundraising and venture preparation services.'
WHERE service_id = '0c09cd5e-fe86-4b7f-8d64-8576d97370cf' AND language_id = 1;

-- Go-to-Market & Growth
UPDATE service_translations 
SET child_services_intro = 'Launch, scale, and dominate—our go-to-market and growth acceleration services.'
WHERE service_id = '0a2dc7e9-1db5-4e54-9766-e2077f08e37e' AND language_id = 1;

-- Ideation & Venture Thesis
UPDATE service_translations 
SET child_services_intro = 'From idea to investment thesis—explore our venture ideation services.'
WHERE service_id = '4bd0144d-92c8-467b-94d9-e45c34133298' AND language_id = 1;

-- Paid Growth Systems
UPDATE service_translations 
SET child_services_intro = 'Maximize ROI, minimize CAC—our paid acquisition and growth marketing services.'
WHERE service_id = '05d09560-7de0-49a0-9cd5-ea99f11ce5a3' AND language_id = 1;

-- SEO & AI Visibility
UPDATE service_translations 
SET child_services_intro = 'Be found by the right audience—our organic search and AI visibility services.'
WHERE service_id = '2dcfdc71-1688-487d-a3f6-806c81d80abb' AND language_id = 1;

-- Validation & Market Proof
UPDATE service_translations 
SET child_services_intro = 'De-risk your venture—our validation and market proof services.'
WHERE service_id = '7a8485bf-3f1d-4c3c-a773-360288c3f9c0' AND language_id = 1;

-- Venture Product Development
UPDATE service_translations 
SET child_services_intro = 'From concept to market fit—our venture product development services.'
WHERE service_id = '2201c320-1dcf-4c99-bfea-2f8ae88ae5fd' AND language_id = 1;