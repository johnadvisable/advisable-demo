-- Update company info translations for Our Story content
-- First, ensure we have a company_info record
INSERT INTO company_info (id, founded_year) 
VALUES (gen_random_uuid(), 2015)
ON CONFLICT DO NOTHING;

-- Update English content (Our Story)
UPDATE company_info_translations 
SET content = 'Advisable was founded in 2015 by Vasilis Kallaras (CEO) and Panos Kallaras (COO). We started as a Digital Agency, aiming to empower eCommerce with innovative solutions. Our first product, Ecommercen, evolved into an award-winning eCommerce platform, helping hundreds of businesses grow online.

Over the years, Advisable transformed into a Technology Provider, focusing on data-driven & AI-powered products such as Advisable.AI Recommendations, MarketData, and Esyntagi.gr.

With offices in Athens and Patras, more than 150 clients, and monitoring over €200M+ in digital revenue annually, we continue to deliver technology solutions that create real impact and measurable value for our partners.'
WHERE language_id = (SELECT id FROM languages WHERE code = 'en');

-- Update Greek content (Our Story)
UPDATE company_info_translations 
SET content = 'Η Advisable ιδρύθηκε το 2015 από τους Βασίλη Καλλάρα (CEO) και Πάνο Καλλάρα (COO). Ξεκινήσαμε ως Digital Agency με στόχο να ενδυναμώσουμε το ηλεκτρονικό εμπόριο μέσα από καινοτόμες λύσεις. Το πρώτο μας προϊόν, το Ecommercen, εξελίχθηκε σε πολυβραβευμένη πλατφόρμα eCommerce, βοηθώντας εκατοντάδες επιχειρήσεις να αναπτυχθούν online.

Στα χρόνια που ακολούθησαν, η Advisable μεταμορφώθηκε σε Technology Provider, δίνοντας έμφαση σε data-driven & AI προϊόντα όπως το Advisable.AI Recommendations, το MarketData και το Esyntagi.gr.

Με γραφεία σε Αθήνα και Πάτρα, πάνω από 150 πελάτες και παρακολούθηση άνω των 200M+ € digital revenue ετησίως, συνεχίζουμε να δημιουργούμε τεχνολογικές λύσεις με πραγματικό αντίκτυπο και αξία για τους συνεργάτες μας.'
WHERE language_id = (SELECT id FROM languages WHERE code = 'el');

-- Update company values translations
-- Innovation First
UPDATE company_value_translations 
SET title = 'Innovation First',
    description = 'Innovation is in our DNA.'
WHERE company_value_id = (SELECT id FROM company_values WHERE icon_name = 'Lightbulb')
AND language_id = (SELECT id FROM languages WHERE code = 'en');

UPDATE company_value_translations 
SET title = 'Innovation First',
    description = 'Η καινοτομία είναι στο DNA μας.'
WHERE company_value_id = (SELECT id FROM company_values WHERE icon_name = 'Lightbulb')
AND language_id = (SELECT id FROM languages WHERE code = 'el');

-- Data-Driven Decisions
UPDATE company_value_translations 
SET title = 'Data-Driven Decisions',
    description = 'We measure success with KPIs and tangible results.'
WHERE company_value_id = (SELECT id FROM company_values WHERE icon_name = 'BarChart3')
AND language_id = (SELECT id FROM languages WHERE code = 'en');

UPDATE company_value_translations 
SET title = 'Data-Driven Decisions',
    description = 'Μετράμε την επιτυχία μας με KPIs και απτά αποτελέσματα.'
WHERE company_value_id = (SELECT id FROM company_values WHERE icon_name = 'BarChart3')
AND language_id = (SELECT id FROM languages WHERE code = 'el');

-- Trust & Collaboration
UPDATE company_value_translations 
SET title = 'Trust & Collaboration',
    description = 'We build long-lasting relationships based on transparency and trust.'
WHERE company_value_id = (SELECT id FROM company_values WHERE icon_name = 'Handshake')
AND language_id = (SELECT id FROM languages WHERE code = 'en');

UPDATE company_value_translations 
SET title = 'Trust & Collaboration',
    description = 'Χτίζουμε διαρκείς σχέσεις εμπιστοσύνης με τους πελάτες μας.'
WHERE company_value_id = (SELECT id FROM company_values WHERE icon_name = 'Handshake')
AND language_id = (SELECT id FROM languages WHERE code = 'el');

-- Excellence in Execution
UPDATE company_value_translations 
SET title = 'Excellence in Execution',
    description = 'We strive for top quality in every project.'
WHERE company_value_id = (SELECT id FROM company_values WHERE icon_name = 'Target')
AND language_id = (SELECT id FROM languages WHERE code = 'en');

UPDATE company_value_translations 
SET title = 'Excellence in Execution',
    description = 'Δίνουμε προσοχή στη λεπτομέρεια σε κάθε project.'
WHERE company_value_id = (SELECT id FROM company_values WHERE icon_name = 'Target')
AND language_id = (SELECT id FROM languages WHERE code = 'el');

-- Growth Mindset
UPDATE company_value_translations 
SET title = 'Growth Mindset',
    description = 'We continuously evolve, investing in new technologies and people.'
WHERE company_value_id = (SELECT id FROM company_values WHERE icon_name = 'TrendingUp')
AND language_id = (SELECT id FROM languages WHERE code = 'en');

UPDATE company_value_translations 
SET title = 'Growth Mindset',
    description = 'Εξελισσόμαστε συνεχώς, επενδύοντας σε νέες τεχνολογίες και ανθρώπους.'
WHERE company_value_id = (SELECT id FROM company_values WHERE icon_name = 'TrendingUp')
AND language_id = (SELECT id FROM languages WHERE code = 'el');