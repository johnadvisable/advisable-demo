-- Delete translations first (foreign key constraint)
DELETE FROM service_translations WHERE service_id = '1e0892a8-c5a7-435c-835d-af063cc845d0';

-- Delete any FAQs
DELETE FROM service_faqs WHERE service_id = '1e0892a8-c5a7-435c-835d-af063cc845d0';

-- Delete FAQ translations if any exist
DELETE FROM service_faq_translations WHERE faq_id IN (
  SELECT id FROM service_faqs WHERE service_id = '1e0892a8-c5a7-435c-835d-af063cc845d0'
);

-- Delete the service itself
DELETE FROM services WHERE id = '1e0892a8-c5a7-435c-835d-af063cc845d0';