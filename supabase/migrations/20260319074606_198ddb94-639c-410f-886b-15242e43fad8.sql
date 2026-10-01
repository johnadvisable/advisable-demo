
-- FAQs for services batch 2: saas-marketing-agency through marketing-automation-agency (9 services)
DO $$
DECLARE
  faq_id uuid;
  sid uuid;
BEGIN
  -- saas-marketing-agency
  sid := 'e15ebc03-5392-44b8-9ae3-5504ce947d2f';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What is SaaS marketing?', 'SaaS marketing focuses on promoting subscription-based software products through strategies like content marketing, SEO, paid acquisition, and lifecycle email campaigns to drive signups, trials, and long-term retention.'),
    (faq_id, 5, 'Τι είναι το SaaS marketing;', 'Το SaaS marketing εστιάζει στην προώθηση προϊόντων λογισμικού με συνδρομή μέσω στρατηγικών όπως content marketing, SEO, paid acquisition και email campaigns για αύξηση εγγραφών και διατήρηση πελατών.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How can a SaaS marketing agency reduce churn?', 'Through onboarding optimization, lifecycle email sequences, in-app engagement strategies, and data-driven retention campaigns that keep users active and subscribed.'),
    (faq_id, 5, 'Πώς μπορεί ένα SaaS marketing agency να μειώσει το churn;', 'Μέσω βελτιστοποίησης onboarding, email sequences κύκλου ζωής, στρατηγικών in-app engagement και data-driven καμπανιών διατήρησης.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What metrics matter most for SaaS marketing?', 'Key metrics include MRR, CAC, LTV, churn rate, trial-to-paid conversion, and activation rate. We track and optimize all of these.'),
    (faq_id, 5, 'Ποια metrics είναι σημαντικά στο SaaS marketing;', 'Βασικά metrics: MRR, CAC, LTV, churn rate, trial-to-paid conversion και activation rate. Παρακολουθούμε και βελτιστοποιούμε όλα αυτά.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you work with early-stage SaaS startups?', 'Yes. We specialize in helping SaaS companies from pre-launch through scale-up, with strategies tailored to each growth stage.'),
    (faq_id, 5, 'Συνεργάζεστε με early-stage SaaS startups;', 'Ναι. Εξειδικευόμαστε στη βοήθεια SaaS εταιρειών από pre-launch έως scale-up, με στρατηγικές προσαρμοσμένες σε κάθε στάδιο ανάπτυξης.');

  -- lead-generation-agency
  sid := '5175aa21-dabf-47b1-9723-90c17173728f';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What is lead generation?', 'Lead generation is the process of attracting and converting prospects into potential customers through targeted campaigns, content offers, landing pages, and multi-channel outreach.'),
    (faq_id, 5, 'Τι είναι το lead generation;', 'Το lead generation είναι η διαδικασία προσέλκυσης και μετατροπής υποψήφιων πελατών μέσω στοχευμένων καμπανιών, content offers, landing pages και πολυκαναλικής προσέγγισης.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How do you qualify leads?', 'We use lead scoring models based on engagement, demographics, and intent signals to separate marketing-qualified leads (MQLs) from sales-qualified leads (SQLs).'),
    (faq_id, 5, 'Πώς αξιολογείτε τα leads;', 'Χρησιμοποιούμε μοντέλα lead scoring βασισμένα σε engagement, δημογραφικά και intent signals για διαχωρισμό MQLs από SQLs.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What channels do you use for lead generation?', 'We leverage LinkedIn outreach, Google Ads, content marketing, email campaigns, webinars, and retargeting to generate high-quality leads.'),
    (faq_id, 5, 'Ποια κανάλια χρησιμοποιείτε για lead generation;', 'Αξιοποιούμε LinkedIn outreach, Google Ads, content marketing, email campaigns, webinars και retargeting για leads υψηλής ποιότητας.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How quickly can I expect results from lead generation?', 'Paid campaigns can deliver leads within days. Organic strategies like SEO and content marketing typically show results within 2-4 months.'),
    (faq_id, 5, 'Πόσο γρήγορα θα δω αποτελέσματα;', 'Οι paid καμπάνιες μπορούν να φέρουν leads σε μέρες. Organic στρατηγικές όπως SEO και content marketing δείχνουν αποτελέσματα σε 2-4 μήνες.');

  -- amazon-marketing-agency
  sid := 'a5a8cfeb-d375-4558-a9c2-46faf3479df5';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What does an Amazon marketing agency do?', 'An Amazon marketing agency optimizes your product listings, manages PPC campaigns, improves A+ content, and implements strategies to increase visibility and sales on the Amazon marketplace.'),
    (faq_id, 5, 'Τι κάνει ένα Amazon marketing agency;', 'Ένα Amazon marketing agency βελτιστοποιεί τα product listings σας, διαχειρίζεται PPC campaigns, βελτιώνει A+ content και υλοποιεί στρατηγικές αύξησης πωλήσεων στο Amazon.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How do you optimize Amazon product listings?', 'We optimize titles, bullet points, descriptions, backend keywords, images, and A+ content to improve search ranking and conversion rates.'),
    (faq_id, 5, 'Πώς βελτιστοποιείτε τα Amazon product listings;', 'Βελτιστοποιούμε τίτλους, bullet points, περιγραφές, backend keywords, εικόνες και A+ content για καλύτερο ranking και conversion rates.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you manage Amazon PPC campaigns?', 'Yes. We manage Sponsored Products, Sponsored Brands, and Sponsored Display campaigns with continuous optimization for maximum ROAS.'),
    (faq_id, 5, 'Διαχειρίζεστε Amazon PPC campaigns;', 'Ναι. Διαχειριζόμαστε Sponsored Products, Sponsored Brands και Sponsored Display campaigns με συνεχή βελτιστοποίηση για μέγιστο ROAS.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Can you help with Amazon brand registry?', 'Absolutely. We assist with brand registry enrollment, A+ content creation, and brand protection strategies on Amazon.'),
    (faq_id, 5, 'Μπορείτε να βοηθήσετε με το Amazon Brand Registry;', 'Απολύτως. Βοηθάμε με εγγραφή στο Brand Registry, δημιουργία A+ content και στρατηγικές προστασίας brand στο Amazon.');

  -- local-seo-agency
  sid := '00a464fd-f754-466f-acae-dd976f40774e';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What is local SEO?', 'Local SEO optimizes your online presence to attract customers from local searches. It includes Google Business Profile optimization, local citations, reviews management, and localized content.'),
    (faq_id, 5, 'Τι είναι το local SEO;', 'Το local SEO βελτιστοποιεί την online παρουσία σας για τοπικές αναζητήσεις. Περιλαμβάνει βελτιστοποίηση Google Business Profile, τοπικές αναφορές, διαχείριση κριτικών και τοπικοποιημένο περιεχόμενο.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How important is Google Business Profile for local SEO?', 'It is critical. A fully optimized Google Business Profile is the single most important factor for appearing in local pack results and Google Maps.'),
    (faq_id, 5, 'Πόσο σημαντικό είναι το Google Business Profile για local SEO;', 'Είναι κρίσιμο. Ένα πλήρως βελτιστοποιημένο Google Business Profile είναι ο πιο σημαντικός παράγοντας για εμφάνιση στα τοπικά αποτελέσματα.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How long does local SEO take to show results?', 'Most businesses see measurable improvements in local rankings within 3-6 months, with ongoing optimization delivering compounding results.'),
    (faq_id, 5, 'Πόσο χρόνο χρειάζεται το local SEO για αποτελέσματα;', 'Οι περισσότερες επιχειρήσεις βλέπουν βελτιώσεις σε τοπικά rankings σε 3-6 μήνες, με τη συνεχή βελτιστοποίηση να φέρνει σταθερά αποτελέσματα.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you help with review management?', 'Yes. We implement review generation strategies, respond to reviews, and monitor your online reputation across all major platforms.'),
    (faq_id, 5, 'Βοηθάτε με τη διαχείριση κριτικών;', 'Ναι. Υλοποιούμε στρατηγικές δημιουργίας κριτικών, απαντάμε σε κριτικές και παρακολουθούμε τη φήμη σας σε όλες τις πλατφόρμες.');

  -- web-development-agency
  sid := 'f787f1c1-183e-4752-9dd7-bb9d69afc840';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What technologies do you use for web development?', 'We work with React, Next.js, TypeScript, Node.js, and modern headless CMS platforms. We choose the best tech stack based on your project requirements.'),
    (faq_id, 5, 'Ποιες τεχνολογίες χρησιμοποιείτε;', 'Δουλεύουμε με React, Next.js, TypeScript, Node.js και σύγχρονες headless CMS πλατφόρμες. Επιλέγουμε το καλύτερο tech stack ανάλογα τις ανάγκες.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How long does it take to build a website?', 'A typical website project takes 4-12 weeks depending on complexity, features, and integrations. We provide detailed timelines during discovery.'),
    (faq_id, 5, 'Πόσο χρόνο χρειάζεται η κατασκευή ιστοσελίδας;', 'Ένα τυπικό project ιστοσελίδας παίρνει 4-12 εβδομάδες ανάλογα με πολυπλοκότητα, λειτουργίες και integrations.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you provide ongoing website maintenance?', 'Yes. We offer maintenance packages that include security updates, performance optimization, content updates, and technical support.'),
    (faq_id, 5, 'Παρέχετε συντήρηση ιστοσελίδας;', 'Ναι. Προσφέρουμε πακέτα συντήρησης που περιλαμβάνουν ενημερώσεις ασφαλείας, βελτιστοποίηση ταχύτητας, ενημερώσεις περιεχομένου και τεχνική υποστήριξη.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Can you redesign my existing website?', 'Absolutely. We specialize in website redesigns that improve performance, user experience, and conversion rates while preserving your SEO equity.'),
    (faq_id, 5, 'Μπορείτε να ανανεώσετε την υπάρχουσα ιστοσελίδα μου;', 'Απολύτως. Εξειδικευόμαστε σε redesigns που βελτιώνουν ταχύτητα, εμπειρία χρήστη και conversion rates διατηρώντας το SEO equity σας.');

  -- graphic-design-agency
  sid := 'd6f9df10-61f1-4d21-9121-a8ba6a2e27bf';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What graphic design services do you offer?', 'We offer brand identity design, marketing collateral, social media graphics, packaging design, presentation design, and digital advertising creatives.'),
    (faq_id, 5, 'Τι υπηρεσίες graphic design προσφέρετε;', 'Προσφέρουμε σχεδιασμό brand identity, marketing υλικό, social media graphics, packaging design, presentation design και digital advertising creatives.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you create brand guidelines?', 'Yes. We create comprehensive brand guidelines including logo usage, color palettes, typography, imagery style, and application examples.'),
    (faq_id, 5, 'Δημιουργείτε brand guidelines;', 'Ναι. Δημιουργούμε ολοκληρωμένα brand guidelines που περιλαμβάνουν χρήση λογοτύπου, χρωματική παλέτα, τυπογραφία, στυλ εικόνων και παραδείγματα εφαρμογής.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How much does graphic design cost?', 'Costs vary by project scope. We offer both project-based pricing and retainer packages for ongoing design needs. Contact us for a custom quote.'),
    (faq_id, 5, 'Πόσο κοστίζει το graphic design;', 'Το κόστος διαφέρει ανάλογα το project. Προσφέρουμε τιμολόγηση ανά project και retainer πακέτα. Επικοινωνήστε μαζί μας για προσφορά.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Can you work with our existing brand identity?', 'Absolutely. We can work within your existing brand guidelines while elevating your visual communications across all touchpoints.'),
    (faq_id, 5, 'Μπορείτε να δουλέψετε με την υπάρχουσα brand identity μας;', 'Απολύτως. Μπορούμε να δουλέψουμε εντός των brand guidelines σας αναβαθμίζοντας τα visual communications σε όλα τα σημεία επαφής.');

  -- growth-marketing-agency
  sid := 'b6f086a4-15d3-48b9-bed4-6e0b293790a1';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What is growth marketing?', 'Growth marketing is a data-driven approach that focuses on the entire customer lifecycle—from acquisition through retention—using rapid experimentation, A/B testing, and cross-channel optimization.'),
    (faq_id, 5, 'Τι είναι το growth marketing;', 'Το growth marketing είναι μια data-driven προσέγγιση που εστιάζει σε ολόκληρο τον κύκλο ζωής πελάτη—από acquisition έως retention—μέσω experimentation, A/B testing και cross-channel optimization.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How is growth marketing different from traditional marketing?', 'Growth marketing emphasizes experimentation, data analysis, and full-funnel optimization rather than focusing solely on top-of-funnel awareness campaigns.'),
    (faq_id, 5, 'Πώς διαφέρει το growth marketing από το traditional marketing;', 'Το growth marketing δίνει έμφαση σε experimentation, ανάλυση δεδομένων και full-funnel optimization αντί να εστιάζει μόνο σε awareness campaigns.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What growth frameworks do you use?', 'We use frameworks like AARRR (Pirate Metrics), North Star Metric, ICE scoring for experiment prioritization, and OKRs for goal alignment.'),
    (faq_id, 5, 'Τι growth frameworks χρησιμοποιείτε;', 'Χρησιμοποιούμε frameworks όπως AARRR (Pirate Metrics), North Star Metric, ICE scoring για prioritization πειραμάτων και OKRs για ευθυγράμμιση στόχων.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Is growth marketing suitable for my business?', 'Growth marketing works for businesses of all sizes, but is particularly effective for startups, SaaS companies, and e-commerce brands looking to scale efficiently.'),
    (faq_id, 5, 'Είναι κατάλληλο το growth marketing για την επιχείρησή μου;', 'Το growth marketing λειτουργεί για επιχειρήσεις κάθε μεγέθους, αλλά είναι ιδιαίτερα αποτελεσματικό για startups, SaaS εταιρείες και e-commerce brands.');

  -- data-analytics-agency
  sid := 'adcc34b6-3573-459a-97cd-c78ac664f6f7';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What data analytics services do you provide?', 'We provide web analytics setup, custom dashboard creation, conversion tracking, attribution modeling, predictive analytics, and data-driven strategy consulting.'),
    (faq_id, 5, 'Τι υπηρεσίες data analytics παρέχετε;', 'Παρέχουμε web analytics setup, custom dashboards, conversion tracking, attribution modeling, predictive analytics και data-driven strategy consulting.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Which analytics tools do you work with?', 'We work with Google Analytics 4, Looker Studio, Mixpanel, Amplitude, BigQuery, and custom BI solutions tailored to your needs.'),
    (faq_id, 5, 'Με ποια analytics tools δουλεύετε;', 'Δουλεύουμε με Google Analytics 4, Looker Studio, Mixpanel, Amplitude, BigQuery και custom BI solutions προσαρμοσμένα στις ανάγκες σας.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How can data analytics improve my marketing ROI?', 'By identifying which channels, campaigns, and touchpoints drive the most value, we help you allocate budget more effectively and eliminate wasted spend.'),
    (faq_id, 5, 'Πώς μπορεί το data analytics να βελτιώσει το ROI μου;', 'Εντοπίζοντας ποια κανάλια και καμπάνιες φέρνουν τη μεγαλύτερη αξία, σας βοηθάμε να κατανείμετε τον προϋπολογισμό πιο αποτελεσματικά.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you help with GA4 migration and setup?', 'Yes. We handle complete GA4 migration, event tracking setup, custom dimensions, and enhanced e-commerce tracking implementation.'),
    (faq_id, 5, 'Βοηθάτε με GA4 migration και setup;', 'Ναι. Αναλαμβάνουμε πλήρες GA4 migration, event tracking setup, custom dimensions και enhanced e-commerce tracking implementation.');

  -- marketing-automation-agency
  sid := 'cb40ca15-de0d-43b5-9013-1553abb3cf0e';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What is marketing automation?', 'Marketing automation uses software to automate repetitive marketing tasks like email sequences, lead nurturing, social posting, and customer segmentation, improving efficiency and personalization.'),
    (faq_id, 5, 'Τι είναι το marketing automation;', 'Το marketing automation χρησιμοποιεί λογισμικό για αυτοματοποίηση επαναλαμβανόμενων εργασιών marketing όπως email sequences, lead nurturing, social posting και customer segmentation.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Which marketing automation platforms do you support?', 'We work with HubSpot, Mailchimp, ActiveCampaign, Klaviyo, Brevo, and custom automation solutions using Zapier and Make.'),
    (faq_id, 5, 'Ποιες πλατφόρμες marketing automation υποστηρίζετε;', 'Δουλεύουμε με HubSpot, Mailchimp, ActiveCampaign, Klaviyo, Brevo και custom automation solutions μέσω Zapier και Make.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How does marketing automation increase revenue?', 'By delivering the right message at the right time through automated workflows, you increase engagement, nurture leads more effectively, and convert more prospects into customers.'),
    (faq_id, 5, 'Πώς αυξάνει τα έσοδα το marketing automation;', 'Παραδίδοντας το σωστό μήνυμα τη σωστή στιγμή μέσω automated workflows, αυξάνετε engagement, nurture leads πιο αποτελεσματικά και μετατρέπετε περισσότερους prospects σε πελάτες.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Can you integrate marketing automation with our CRM?', 'Yes. We specialize in CRM-marketing automation integrations to ensure seamless data flow between your sales and marketing teams.'),
    (faq_id, 5, 'Μπορείτε να ενσωματώσετε marketing automation με το CRM μας;', 'Ναι. Εξειδικευόμαστε σε CRM-marketing automation integrations για απρόσκοπτη ροή δεδομένων μεταξύ πωλήσεων και marketing.');
END $$;
