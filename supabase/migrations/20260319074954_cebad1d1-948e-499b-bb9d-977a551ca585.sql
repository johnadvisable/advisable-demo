
DO $$
DECLARE faq_id uuid;
  sid uuid := 'c4cfce55-1324-48c8-8f4a-34a592c0fe8b';
BEGIN
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What is B2B marketing?', 'B2B marketing targets businesses and decision-makers through strategies like account-based marketing, LinkedIn campaigns, content marketing, and lead nurturing to drive qualified pipeline.'),
    (faq_id, 5, 'Τι είναι το B2B marketing;', 'Το B2B marketing στοχεύει επιχειρήσεις και decision-makers μέσω account-based marketing, LinkedIn campaigns, content marketing και lead nurturing για qualified pipeline.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How long is the typical B2B sales cycle?', 'B2B sales cycles range from 1-12 months depending on deal size. We design multi-touch campaigns that nurture prospects through every stage of the buying journey.'),
    (faq_id, 5, 'Πόσο διαρκεί ο τυπικός κύκλος B2B πωλήσεων;', 'Οι κύκλοι B2B πωλήσεων κυμαίνονται 1-12 μήνες. Σχεδιάζουμε multi-touch campaigns που nurture prospects σε κάθε στάδιο.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What B2B channels do you specialize in?', 'We specialize in LinkedIn, Google Ads, content marketing, email automation, webinars, ABM platforms, and strategic partnerships for B2B growth.'),
    (faq_id, 5, 'Σε ποια B2B κανάλια εξειδικεύεστε;', 'Εξειδικευόμαστε σε LinkedIn, Google Ads, content marketing, email automation, webinars, ABM platforms και strategic partnerships.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you offer account-based marketing (ABM)?', 'Yes. We design and execute ABM programs that target high-value accounts with personalized messaging across multiple touchpoints.'),
    (faq_id, 5, 'Προσφέρετε account-based marketing (ABM);', 'Ναι. Σχεδιάζουμε και υλοποιούμε ABM programs που στοχεύουν high-value λογαριασμούς με personalized μηνύματα σε πολλαπλά touchpoints.');
END $$;
