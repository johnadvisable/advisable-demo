
DO $$
DECLARE
  faq_id uuid;
BEGIN

-- === SEO AGENCY ===
INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('4ad975ec-db36-46ee-933e-c33b5c3b4cc9', 1, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'What does an SEO agency do?', 'An SEO agency optimizes your website to rank higher in search engines like Google. This includes technical SEO audits, keyword research, on-page optimization, link building, and content strategy to drive organic traffic and conversions.'),
(faq_id, 5, 'Τι κάνει ένα SEO agency;', 'Ένα SEO agency βελτιστοποιεί τον ιστότοπό σας για υψηλότερες κατατάξεις στις μηχανές αναζήτησης. Περιλαμβάνει τεχνικό SEO, έρευνα λέξεων-κλειδιών, on-page βελτιστοποίηση, link building και στρατηγική περιεχομένου.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('4ad975ec-db36-46ee-933e-c33b5c3b4cc9', 2, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'How long does it take to see SEO results?', 'SEO is a long-term strategy. Most businesses start seeing measurable improvements within 3-6 months, with significant results typically appearing after 6-12 months of consistent optimization.'),
(faq_id, 5, 'Πόσο χρόνο χρειάζεται για να δω αποτελέσματα SEO;', 'Το SEO είναι μακροπρόθεσμη στρατηγική. Οι περισσότερες επιχειρήσεις βλέπουν βελτιώσεις σε 3-6 μήνες, με σημαντικά αποτελέσματα μετά από 6-12 μήνες.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('4ad975ec-db36-46ee-933e-c33b5c3b4cc9', 3, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'How much does SEO cost?', 'SEO pricing varies based on your industry, competition, and goals. We offer tailored packages starting from monthly retainers, ensuring you get maximum ROI. Contact us for a custom quote.'),
(faq_id, 5, 'Πόσο κοστίζει το SEO;', 'Το κόστος SEO εξαρτάται από τον κλάδο, τον ανταγωνισμό και τους στόχους σας. Προσφέρουμε εξατομικευμένα πακέτα με μηνιαίες συνδρομές για μέγιστο ROI.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('4ad975ec-db36-46ee-933e-c33b5c3b4cc9', 4, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'Do you offer AI-powered SEO services?', 'Yes! We combine traditional SEO expertise with AI-driven tools for keyword analysis, content optimization, and predictive ranking strategies to give you a competitive edge.'),
(faq_id, 5, 'Προσφέρετε SEO υπηρεσίες με AI;', 'Ναι! Συνδυάζουμε παραδοσιακή εμπειρία SEO με εργαλεία AI για ανάλυση λέξεων-κλειδιών, βελτιστοποίηση περιεχομένου και στρατηγικές κατάταξης.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('4ad975ec-db36-46ee-933e-c33b5c3b4cc9', 5, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'What is the difference between SEO and PPC?', 'SEO focuses on earning organic search traffic through optimization, while PPC involves paid advertising. SEO delivers long-term sustainable results, whereas PPC provides immediate visibility but stops when you stop paying.'),
(faq_id, 5, 'Ποια είναι η διαφορά μεταξύ SEO και PPC;', 'Το SEO εστιάζει στην οργανική κίνηση μέσω βελτιστοποίησης, ενώ το PPC περιλαμβάνει πληρωμένη διαφήμιση. Το SEO δίνει μακροπρόθεσμα αποτελέσματα.');

-- === PERFORMANCE MARKETING AGENCY ===
INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('65138138-c27d-4290-9168-79c65f3862a1', 1, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'What is performance marketing?', 'Performance marketing is a data-driven approach where you only pay for measurable results—clicks, conversions, or sales. It includes paid search, social ads, programmatic, and affiliate marketing.'),
(faq_id, 5, 'Τι είναι το performance marketing;', 'Το performance marketing είναι μια data-driven προσέγγιση όπου πληρώνετε μόνο για μετρήσιμα αποτελέσματα—κλικ, μετατροπές ή πωλήσεις.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('65138138-c27d-4290-9168-79c65f3862a1', 2, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'Which platforms do you use for performance marketing?', 'We manage campaigns across Google Ads, Meta (Facebook & Instagram), TikTok, LinkedIn, and programmatic networks based on where your audience is most active.'),
(faq_id, 5, 'Ποιες πλατφόρμες χρησιμοποιείτε;', 'Διαχειριζόμαστε καμπάνιες σε Google Ads, Meta, TikTok, LinkedIn και programmatic δίκτυα, ανάλογα με το κοινό σας.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('65138138-c27d-4290-9168-79c65f3862a1', 3, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'How do you measure performance marketing success?', 'We track KPIs including ROAS, CPA, CTR, conversion rates, and customer lifetime value. You get real-time dashboards and transparent reporting on every euro spent.'),
(faq_id, 5, 'Πώς μετράτε την επιτυχία;', 'Παρακολουθούμε KPIs όπως ROAS, CPA, CTR, ποσοστά μετατροπής και αξία πελάτη με real-time dashboards.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('65138138-c27d-4290-9168-79c65f3862a1', 4, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'What budget do I need for performance marketing?', 'Budgets vary by industry and goals. We work with businesses of all sizes, optimizing spend for maximum impact. We recommend starting with a test budget and scaling based on data.'),
(faq_id, 5, 'Τι budget χρειάζομαι;', 'Τα budgets ποικίλλουν ανά κλάδο. Δουλεύουμε με επιχειρήσεις κάθε μεγέθους, βελτιστοποιώντας τη δαπάνη με βάση τα δεδομένα.');

-- === MARKETING AGENCY ===
INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('e45172d3-85fa-4264-8ca8-675e850b7084', 1, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'What services does a full-service marketing agency offer?', 'A full-service agency provides strategy, branding, digital marketing, SEO, paid ads, social media, content creation, web development, and analytics—all under one roof.'),
(faq_id, 5, 'Τι υπηρεσίες προσφέρει ένα full-service marketing agency;', 'Παρέχει στρατηγική, branding, digital marketing, SEO, πληρωμένες διαφημίσεις, social media, δημιουργία περιεχομένου και web development.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('e45172d3-85fa-4264-8ca8-675e850b7084', 2, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'Why hire a marketing agency instead of an in-house team?', 'An agency gives you access to diverse specialists at a fraction of the cost. You get expertise in multiple disciplines, scalability, and fresh perspectives without the overhead of full-time hires.'),
(faq_id, 5, 'Γιατί να προσλάβω agency αντί για in-house ομάδα;', 'Ένα agency δίνει πρόσβαση σε ειδικούς σε κλάσμα του κόστους, με εξειδίκευση, κλιμάκωση και νέες ιδέες χωρίς overhead.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('e45172d3-85fa-4264-8ca8-675e850b7084', 3, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'How do you develop a marketing strategy?', 'We start with market research, competitor analysis, and audience profiling. Then we create a data-driven strategy aligned with your business goals, including channel selection and KPIs.'),
(faq_id, 5, 'Πώς αναπτύσσετε στρατηγική marketing;', 'Ξεκινάμε με έρευνα αγοράς, ανάλυση ανταγωνισμού και profiling κοινού, δημιουργώντας data-driven στρατηγική ευθυγραμμισμένη με τους στόχους σας.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('e45172d3-85fa-4264-8ca8-675e850b7084', 4, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'Do you work with businesses in Greece and internationally?', 'Yes! Based in Athens, we work with clients across Europe and globally. Our multilingual team executes campaigns in English, Greek, and other European languages.'),
(faq_id, 5, 'Δουλεύετε στην Ελλάδα και διεθνώς;', 'Ναι! Εδρεύουμε στην Αθήνα και δουλεύουμε με πελάτες σε Ευρώπη και παγκοσμίως, σε πολλές γλώσσες.');

-- === EMAIL MARKETING AGENCY ===
INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('4b0b4bcd-6aae-47a1-84e1-b94c56c0d65a', 1, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'What email marketing services do you offer?', 'We provide end-to-end email marketing: strategy, list building, template design, automation workflows, A/B testing, deliverability optimization, and performance analytics.'),
(faq_id, 5, 'Τι υπηρεσίες email marketing προσφέρετε;', 'Παρέχουμε ολοκληρωμένο email marketing: στρατηγική, list building, σχεδιασμό templates, automation, A/B testing και analytics.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('4b0b4bcd-6aae-47a1-84e1-b94c56c0d65a', 2, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'Which email platforms do you work with?', 'We work with Mailchimp, Klaviyo, HubSpot, ActiveCampaign, and Brevo. We recommend the best platform based on your business needs and budget.'),
(faq_id, 5, 'Με ποιες πλατφόρμες email δουλεύετε;', 'Δουλεύουμε με Mailchimp, Klaviyo, HubSpot, ActiveCampaign και Brevo, προτείνοντας την καλύτερη για τις ανάγκες σας.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('4b0b4bcd-6aae-47a1-84e1-b94c56c0d65a', 3, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'How can email marketing increase my revenue?', 'Email marketing delivers an average ROI of $36 for every $1 spent. Through segmentation, personalization, and automated flows we convert subscribers into loyal customers.'),
(faq_id, 5, 'Πώς μπορεί το email marketing να αυξήσει τα έσοδά μου;', 'Το email marketing αποδίδει μέσο ROI $36 ανά $1. Μέσω segmentation, personalization και automated flows μετατρέπουμε subscribers σε πελάτες.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('4b0b4bcd-6aae-47a1-84e1-b94c56c0d65a', 4, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'How do you ensure emails don''t end up in spam?', 'We follow deliverability best practices: proper authentication (SPF, DKIM, DMARC), list hygiene, engagement-based segmentation, and compliant sending to maximize inbox placement.'),
(faq_id, 5, 'Πώς διασφαλίζετε ότι τα emails δεν πάνε στα spam;', 'Ακολουθούμε best practices: authentication (SPF, DKIM, DMARC), καθαρισμό λιστών και segmentation βάσει engagement.');

-- === ECOMMERCE AGENCY ===
INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('934b1dc4-1ec3-420e-ac34-31cb1210a3a6', 1, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'What eCommerce platforms do you work with?', 'We specialize in Shopify, WooCommerce, Magento, and custom headless commerce solutions. We help you choose the right platform based on your catalog size and growth plans.'),
(faq_id, 5, 'Με ποιες eCommerce πλατφόρμες δουλεύετε;', 'Εξειδικευόμαστε σε Shopify, WooCommerce, Magento και custom headless λύσεις, βοηθώντας σας να επιλέξετε την κατάλληλη πλατφόρμα.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('934b1dc4-1ec3-420e-ac34-31cb1210a3a6', 2, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'How can you help increase my online store''s sales?', 'We use CRO, SEO, paid advertising, email marketing, and UX improvements to drive more traffic and convert visitors into customers.'),
(faq_id, 5, 'Πώς μπορείτε να αυξήσετε τις πωλήσεις του eshop μου;', 'Χρησιμοποιούμε CRO, SEO, πληρωμένη διαφήμιση, email marketing και UX βελτιώσεις για περισσότερη κίνηση και μετατροπές.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('934b1dc4-1ec3-420e-ac34-31cb1210a3a6', 3, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'How long does it take to build an eCommerce website?', 'A standard eCommerce store takes 4-8 weeks, while complex custom solutions may take 8-16 weeks depending on features, integrations, and catalog complexity.'),
(faq_id, 5, 'Πόσο χρόνο χρειάζεται η κατασκευή ενός eCommerce site;', 'Ένα τυπικό eshop χρειάζεται 4-8 εβδομάδες, ενώ πολύπλοκες λύσεις 8-16 εβδομάδες ανάλογα τα features.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('934b1dc4-1ec3-420e-ac34-31cb1210a3a6', 4, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'Do you offer ongoing eCommerce support?', 'Yes! We provide ongoing maintenance, performance monitoring, A/B testing, and growth optimization to keep your store fast, secure, and continuously improving.'),
(faq_id, 5, 'Προσφέρετε συνεχή υποστήριξη eCommerce;', 'Ναι! Παρέχουμε συντήρηση, παρακολούθηση απόδοσης, A/B testing και βελτιστοποίηση ανάπτυξης.');

-- === SOCIAL MEDIA AGENCY ===
INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('45f341d1-4a7c-4207-a694-a7fe7930555c', 1, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'What social media platforms do you manage?', 'We manage Instagram, Facebook, TikTok, LinkedIn, X (Twitter), Pinterest, and YouTube—focusing on platforms where your audience is most engaged.'),
(faq_id, 5, 'Ποιες πλατφόρμες social media διαχειρίζεστε;', 'Διαχειριζόμαστε Instagram, Facebook, TikTok, LinkedIn, X, Pinterest και YouTube, εστιάζοντας στο κοινό σας.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('45f341d1-4a7c-4207-a694-a7fe7930555c', 2, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'How often will you post on my social media?', 'Typically 3-5 posts/week on Instagram/Facebook, daily on TikTok, and 2-3/week on LinkedIn. Frequency is tailored to your strategy and goals.'),
(faq_id, 5, 'Πόσο συχνά θα δημοσιεύετε;', 'Συνήθως 3-5 posts/εβδομάδα στο Instagram/Facebook, καθημερινά στο TikTok, 2-3/εβδομάδα στο LinkedIn, προσαρμοσμένα στη στρατηγική σας.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('45f341d1-4a7c-4207-a694-a7fe7930555c', 3, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'Do you create the content or do we need to provide it?', 'We handle everything—strategy, content creation, copywriting, graphic design, video production, and community management. You just approve the monthly content calendar.'),
(faq_id, 5, 'Δημιουργείτε εσείς το περιεχόμενο;', 'Αναλαμβάνουμε τα πάντα—στρατηγική, δημιουργία περιεχομένου, copywriting, σχεδιασμό, video και community management.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('45f341d1-4a7c-4207-a694-a7fe7930555c', 4, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'Can social media generate leads and sales?', 'Absolutely! With the right strategy combining organic content with targeted paid campaigns, social media is a powerful lead generation and sales channel for both B2C and B2B.'),
(faq_id, 5, 'Μπορούν τα social media να φέρουν leads και πωλήσεις;', 'Απολύτως! Με σωστή στρατηγική οργανικού περιεχομένου και στοχευμένων καμπανιών, τα social media είναι ισχυρό κανάλι.');

-- === WEB DESIGN AGENCY ===
INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('b3f1d0ef-767d-44c0-b968-d122153f9b8b', 1, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'How much does a professional website cost?', 'A professional business website ranges from €3,000-€15,000, while complex web applications or eCommerce sites can range from €10,000-€50,000+ depending on features.'),
(faq_id, 5, 'Πόσο κοστίζει μια επαγγελματική ιστοσελίδα;', 'Μια επαγγελματική ιστοσελίδα κυμαίνεται €3.000-€15.000, ενώ πολύπλοκες εφαρμογές ή eshop €10.000-€50.000+.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('b3f1d0ef-767d-44c0-b968-d122153f9b8b', 2, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'How long does it take to build a website?', 'A standard business website takes 4-6 weeks. Complex projects with custom features may take 8-12 weeks. We provide a detailed timeline during discovery.'),
(faq_id, 5, 'Πόσο χρόνο χρειάζεται η κατασκευή ενός website;', 'Ένα τυπικό website χρειάζεται 4-6 εβδομάδες. Πιο πολύπλοκα projects 8-12 εβδομάδες.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('b3f1d0ef-767d-44c0-b968-d122153f9b8b', 3, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'Will my website be mobile-friendly?', 'Every website we build is fully responsive and mobile-first, ensuring optimal performance across all devices—smartphones, tablets, and desktops.'),
(faq_id, 5, 'Θα είναι η ιστοσελίδα μου mobile-friendly;', 'Κάθε website που φτιάχνουμε είναι πλήρως responsive και mobile-first, με βέλτιστη απόδοση σε όλες τις συσκευές.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('b3f1d0ef-767d-44c0-b968-d122153f9b8b', 4, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'Do you offer website maintenance after launch?', 'Yes! We offer maintenance plans including security updates, performance monitoring, content updates, and technical support.'),
(faq_id, 5, 'Προσφέρετε συντήρηση website μετά την κυκλοφορία;', 'Ναι! Προσφέρουμε πλάνα συντήρησης με ενημερώσεις ασφαλείας, παρακολούθηση απόδοσης και τεχνική υποστήριξη.');

-- === PPC AGENCY ===
INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('f00319d9-c1ef-488d-8ef6-1d29098bfbc5', 1, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'What is PPC advertising?', 'PPC (Pay-Per-Click) is a digital advertising model where you pay only when someone clicks your ad. It includes Google Ads, Bing Ads, and social media advertising.'),
(faq_id, 5, 'Τι είναι η PPC διαφήμιση;', 'Το PPC είναι μοντέλο διαφήμισης όπου πληρώνετε μόνο όταν κάποιος κάνει κλικ. Περιλαμβάνει Google Ads, Bing Ads και social media ads.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('f00319d9-c1ef-488d-8ef6-1d29098bfbc5', 2, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'How quickly can PPC deliver results?', 'PPC can start driving traffic within days of launch. Optimization for peak performance typically takes 2-4 weeks as we gather data and refine targeting.'),
(faq_id, 5, 'Πόσο γρήγορα φέρνει αποτελέσματα το PPC;', 'Το PPC αρχίζει να φέρνει traffic μέσα σε ημέρες. Η βελτιστοποίηση χρειάζεται 2-4 εβδομάδες.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('f00319d9-c1ef-488d-8ef6-1d29098bfbc5', 3, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'What is a good ROAS for PPC campaigns?', 'A good ROAS varies by industry. Generally 4:1 is healthy. For eCommerce, we often achieve 5:1 to 10:1 ROAS through strategic optimization.'),
(faq_id, 5, 'Ποιο είναι καλό ROAS για PPC;', 'Το ROAS ποικίλλει ανά κλάδο. Γενικά 4:1 θεωρείται υγιές. Στο eCommerce πετυχαίνουμε 5:1 έως 10:1.');

INSERT INTO service_faqs (service_id, display_order, is_active) VALUES ('f00319d9-c1ef-488d-8ef6-1d29098bfbc5', 4, true) RETURNING id INTO faq_id;
INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
(faq_id, 1, 'Do you manage Google Ads campaigns?', 'Yes! As a certified Google Partner, we manage Search, Display, Shopping, Video, and Performance Max campaigns, optimizing from keywords to landing pages.'),
(faq_id, 5, 'Διαχειρίζεστε Google Ads καμπάνιες;', 'Ναι! Ως certified Google Partner, διαχειριζόμαστε Search, Display, Shopping, Video και Performance Max καμπάνιες.');

END $$;
