-- Update Google Partner to Google Premier Partner in all languages
UPDATE credential_translations
SET title = 'Google Premier Partner',
    description = 'Certified Google Premier Partner for digital marketing excellence and innovation.'
WHERE title = 'Google Partner';

UPDATE credential_translations
SET title = 'Google Premier Partner',
    description = 'Zertifizierter Google Premier Partner für digitale Marketing-Exzellenz und Innovation.'
WHERE title = 'Google Partner' AND language_id = (SELECT id FROM languages WHERE code = 'de');

UPDATE credential_translations
SET title = 'Συνεργάτης Google Premier',
    description = 'Πιστοποιημένος συνεργάτης Google Premier για αριστεία και καινοτομία στο ψηφιακό μάρκετινγκ.'
WHERE title = 'Συνεργάτης Google';

UPDATE credential_translations
SET title = 'Socio Premier de Google',
    description = 'Socio Premier certificado de Google para la excelencia e innovación en marketing digital.'
WHERE title = 'Socio de Google';

UPDATE credential_translations
SET title = 'Partenaire Google Premier',
    description = 'Partenaire Google Premier certifié pour l''excellence et l''innovation en marketing numérique.'
WHERE title = 'Partenaire Google';