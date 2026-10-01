
-- Insert new service category: Adobe Experience Manager Agency
INSERT INTO service_categories (id, name, slug, description, seo_title, seo_description, icon_name)
VALUES (
  gen_random_uuid(),
  'Adobe Experience Manager Agency',
  'adobe-experience-manager-agency',
  'Expert Adobe Experience Manager (AEM) agency providing enterprise-grade digital experience solutions, content management, and digital asset management.',
  'Adobe Experience Manager Agency | AEM Solutions & Services',
  'Professional Adobe Experience Manager agency delivering enterprise CMS solutions, digital asset management, and personalized digital experiences.',
  'Layers'
);

-- Insert translations for all active languages
-- English (language_id: 1)
INSERT INTO service_category_translations (id, category_id, language_id, name, description)
SELECT gen_random_uuid(), sc.id, 1,
  'Adobe Experience Manager Agency',
  'Expert Adobe Experience Manager (AEM) agency providing enterprise-grade digital experience solutions, content management, and digital asset management.'
FROM service_categories sc WHERE sc.slug = 'adobe-experience-manager-agency';

-- Spanish (language_id: 2)
INSERT INTO service_category_translations (id, category_id, language_id, name, description)
SELECT gen_random_uuid(), sc.id, 2,
  'Agencia Adobe Experience Manager',
  'Agencia experta en Adobe Experience Manager (AEM) que ofrece soluciones de experiencia digital empresarial, gestión de contenidos y gestión de activos digitales.'
FROM service_categories sc WHERE sc.slug = 'adobe-experience-manager-agency';

-- French (language_id: 3)
INSERT INTO service_category_translations (id, category_id, language_id, name, description)
SELECT gen_random_uuid(), sc.id, 3,
  'Agence Adobe Experience Manager',
  'Agence experte Adobe Experience Manager (AEM) fournissant des solutions d''expérience digitale d''entreprise, de gestion de contenu et de gestion des actifs numériques.'
FROM service_categories sc WHERE sc.slug = 'adobe-experience-manager-agency';

-- German (language_id: 4)
INSERT INTO service_category_translations (id, category_id, language_id, name, description)
SELECT gen_random_uuid(), sc.id, 4,
  'Adobe Experience Manager Agentur',
  'Experte Adobe Experience Manager (AEM) Agentur für Enterprise-Digital-Experience-Lösungen, Content-Management und Digital-Asset-Management.'
FROM service_categories sc WHERE sc.slug = 'adobe-experience-manager-agency';

-- Greek (language_id: 5)
INSERT INTO service_category_translations (id, category_id, language_id, name, description)
SELECT gen_random_uuid(), sc.id, 5,
  'Adobe Experience Manager Agency',
  'Εξειδικευμένη υπηρεσία Adobe Experience Manager (AEM) που παρέχει λύσεις ψηφιακής εμπειρίας επιχειρηματικού επιπέδου, διαχείριση περιεχομένου και διαχείριση ψηφιακών πόρων.'
FROM service_categories sc WHERE sc.slug = 'adobe-experience-manager-agency';

-- Italian (language_id: 10)
INSERT INTO service_category_translations (id, category_id, language_id, name, description)
SELECT gen_random_uuid(), sc.id, 10,
  'Agenzia Adobe Experience Manager',
  'Agenzia esperta Adobe Experience Manager (AEM) che fornisce soluzioni di esperienza digitale enterprise, gestione dei contenuti e gestione delle risorse digitali.'
FROM service_categories sc WHERE sc.slug = 'adobe-experience-manager-agency';
