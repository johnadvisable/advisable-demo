-- Update display order for existing credentials
UPDATE credentials SET display_order = 4, updated_at = now() WHERE id = 'e6ea2eef-ff54-48f8-9e78-f6112810a6de';
UPDATE credentials SET display_order = 3, updated_at = now() WHERE id = '1cc602a9-983f-4cd7-87d4-93fd2f2fd097';

-- Insert new Meta Business Partner credential
INSERT INTO credentials (id, icon_name, display_order, image_url, created_at, updated_at)
VALUES (
  'a1b2c3d4-5678-90ab-cdef-123456789abc',
  'Handshake',
  2,
  '/images/meta-business-partner.png',
  now(),
  now()
);

-- Insert translations for all 6 languages with English text
INSERT INTO credential_translations (credential_id, language_id, title, description, created_at, updated_at)
VALUES 
  ('a1b2c3d4-5678-90ab-cdef-123456789abc', 1, 'Meta Business Partner', 'Certified Meta Business Partner for advertising excellence on Facebook and Instagram', now(), now()),
  ('a1b2c3d4-5678-90ab-cdef-123456789abc', 2, 'Meta Business Partner', 'Certified Meta Business Partner for advertising excellence on Facebook and Instagram', now(), now()),
  ('a1b2c3d4-5678-90ab-cdef-123456789abc', 3, 'Meta Business Partner', 'Certified Meta Business Partner for advertising excellence on Facebook and Instagram', now(), now()),
  ('a1b2c3d4-5678-90ab-cdef-123456789abc', 4, 'Meta Business Partner', 'Certified Meta Business Partner for advertising excellence on Facebook and Instagram', now(), now()),
  ('a1b2c3d4-5678-90ab-cdef-123456789abc', 5, 'Meta Business Partner', 'Certified Meta Business Partner for advertising excellence on Facebook and Instagram', now(), now()),
  ('a1b2c3d4-5678-90ab-cdef-123456789abc', 10, 'Meta Business Partner', 'Certified Meta Business Partner for advertising excellence on Facebook and Instagram', now(), now());