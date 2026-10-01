-- Update Optika Liolios client with case study information
UPDATE clients 
SET 
  featured = true,
  case_study_team_size = '6 Advisable Team Members',
  case_study_timeline = '8 Months Development',
  case_study_results = '[
    {"metric": "Revenue Increase", "value": "+226%", "description": "Significant boost in online sales"},
    {"metric": "Conversion Rate", "value": "+84%", "description": "Improved user experience and checkout process"}, 
    {"metric": "Return Customers", "value": "+51%", "description": "Better customer retention through personalized experience"},
    {"metric": "Online Prescriptions", "value": "+68%", "description": "Enhanced prescription management system"}
  ]'::jsonb
WHERE website LIKE '%optikaliolios%';

-- Add Greek translation for case study content
INSERT INTO clients_translations (
  client_id, 
  language_id, 
  name,
  description,
  case_study_challenge,
  case_study_solution,
  testimonial
) VALUES (
  (SELECT id FROM clients WHERE website LIKE '%optikaliolios%'),
  (SELECT id FROM languages WHERE code = 'el'),
  'Optika Liolios',
  'Η Optika Liolios, μια από τις κορυφαίες αλυσίδες οπτικών στην Ελλάδα, συνεργάστηκε με την Advisable για την ψηφιακή της αναβάθμιση και την ανάπτυξη ενός προηγμένου eCommerce περιβάλλοντος.',
  'Η Optika Liolios, μια από τις κορυφαίες αλυσίδες οπτικών στην Ελλάδα, αναζήτησε λύση για να αναβαθμίσει την online παρουσία της. Χρειαζόταν ένα eCommerce περιβάλλον που θα υποστήριζε online συνταγογράφηση γυαλιών, θα βελτίωνε την εμπειρία χρήστη και τα conversion rates, και θα μπορούσε να διαχειριστεί μεγάλη επισκεψιμότητα και πολυκάναλη παρουσία.',
  'Η ομάδα μας ανέλαβε Redesign & Replatforming του eShop, αξιοποιώντας την πλατφόρμα Ecommercen. Δημιουργήσαμε νέο μοντέρνο σχεδιασμό με έμφαση στη χρηστικότητα, διασυνδέσαμε με ERP, marketplaces, payment gateways και shipping connectors, εφαρμόσαμε Loyalty System και AI Recommendations για εξατομικευμένη εμπειρία, και υποστηρίξαμε Online Prescriptions με εύκολη διαδικασία για τους χρήστες.',
  'Με περισσότερα από 150+ ενεργά έργα, 200M€ ετήσιο παραγόμενο revenue και αναγνωρίσεις ως βραβευμένη eCommerce πλατφόρμα (2020, 2021, 2023, 2024), η Advisable αποτελεί τον ιδανικό συνεργάτη για επιχειρήσεις που θέλουν να αναπτυχθούν ψηφιακά.'
) ON CONFLICT (client_id, language_id) 
DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  case_study_challenge = EXCLUDED.case_study_challenge,
  case_study_solution = EXCLUDED.case_study_solution,
  testimonial = EXCLUDED.testimonial,
  updated_at = now();

-- Add English translation for case study content  
INSERT INTO clients_translations (
  client_id,
  language_id,
  name,
  description,
  case_study_challenge,
  case_study_solution,
  testimonial
) VALUES (
  (SELECT id FROM clients WHERE website LIKE '%optikaliolios%'),
  (SELECT id FROM languages WHERE code = 'en'),
  'Optika Liolios',
  'Optika Liolios, one of Greece''s leading optical chains, partnered with Advisable for their digital transformation and development of an advanced eCommerce environment.',
  'Optika Liolios, one of Greece''s leading optical chains, sought a solution to upgrade their online presence. They needed an eCommerce environment that would support online prescription glasses, improve user experience and conversion rates, and handle high traffic and multi-channel presence.',
  'Our team undertook the Redesign & Replatforming of the eShop, leveraging the Ecommercen platform. We created a new modern design with emphasis on usability, integrated with ERP, marketplaces, payment gateways and shipping connectors, implemented Loyalty System and AI Recommendations for personalized experience, and supported Online Prescriptions with easy process for users.',
  'With more than 150+ active projects, 200M€ annual generated revenue and recognition as an award-winning eCommerce platform (2020, 2021, 2023, 2024), Advisable is the ideal partner for businesses that want to grow digitally.'
) ON CONFLICT (client_id, language_id)
DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  case_study_challenge = EXCLUDED.case_study_challenge,
  case_study_solution = EXCLUDED.case_study_solution,
  testimonial = EXCLUDED.testimonial,
  updated_at = now();