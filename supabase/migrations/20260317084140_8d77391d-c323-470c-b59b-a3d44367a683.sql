INSERT INTO services (id, category_id, slug, emoji, icon_name, display_order, parent_service_id, is_parent, featured_image)
VALUES (
  gen_random_uuid(),
  '164b114a-ccb9-4900-8777-70fb9dcb5108',
  'adobe-experience-manager-agency',
  '🏢',
  'Layers',
  9,
  'bd0df4a0-63c9-4646-aac2-28a96ce15a89',
  false,
  NULL
);

INSERT INTO service_translations (service_id, language_id, title, short_description, long_description, seo_title, meta_description)
SELECT s.id, 1, 'Adobe Experience Manager Agency', 'Expert Adobe Experience Manager (AEM) agency providing enterprise-grade digital experience solutions, content management, and digital asset management.', NULL, 'Adobe Experience Manager Agency | AEM Solutions & Services', 'Professional Adobe Experience Manager agency delivering enterprise CMS solutions, digital asset management, and personalized digital experiences.'
FROM services s WHERE s.slug = 'adobe-experience-manager-agency' AND s.parent_service_id = 'bd0df4a0-63c9-4646-aac2-28a96ce15a89';

INSERT INTO service_translations (service_id, language_id, title, short_description)
SELECT s.id, 2, 'Agencia Adobe Experience Manager', 'Agencia experta en Adobe Experience Manager (AEM) que ofrece soluciones de experiencia digital empresarial, gestión de contenidos y gestión de activos digitales.'
FROM services s WHERE s.slug = 'adobe-experience-manager-agency' AND s.parent_service_id = 'bd0df4a0-63c9-4646-aac2-28a96ce15a89';

INSERT INTO service_translations (service_id, language_id, title, short_description)
SELECT s.id, 3, 'Agence Adobe Experience Manager', 'Agence experte Adobe Experience Manager (AEM) fournissant des solutions d''expérience digitale d''entreprise, de gestion de contenu et de gestion des actifs numériques.'
FROM services s WHERE s.slug = 'adobe-experience-manager-agency' AND s.parent_service_id = 'bd0df4a0-63c9-4646-aac2-28a96ce15a89';

INSERT INTO service_translations (service_id, language_id, title, short_description)
SELECT s.id, 4, 'Adobe Experience Manager Agentur', 'Experte Adobe Experience Manager (AEM) Agentur für Enterprise-Digital-Experience-Lösungen, Content-Management und Digital-Asset-Management.'
FROM services s WHERE s.slug = 'adobe-experience-manager-agency' AND s.parent_service_id = 'bd0df4a0-63c9-4646-aac2-28a96ce15a89';

INSERT INTO service_translations (service_id, language_id, title, short_description)
SELECT s.id, 5, 'Adobe Experience Manager Agency', 'Εξειδικευμένη υπηρεσία Adobe Experience Manager (AEM) που παρέχει λύσεις ψηφιακής εμπειρίας επιχειρηματικού επιπέδου, διαχείριση περιεχομένου και διαχείριση ψηφιακών πόρων.'
FROM services s WHERE s.slug = 'adobe-experience-manager-agency' AND s.parent_service_id = 'bd0df4a0-63c9-4646-aac2-28a96ce15a89';

INSERT INTO service_translations (service_id, language_id, title, short_description)
SELECT s.id, 10, 'Agenzia Adobe Experience Manager', 'Agenzia esperta Adobe Experience Manager (AEM) che fornisce soluzioni di esperienza digitale enterprise, gestione dei contenuti e gestione delle risorse digitali.'
FROM services s WHERE s.slug = 'adobe-experience-manager-agency' AND s.parent_service_id = 'bd0df4a0-63c9-4646-aac2-28a96ce15a89';