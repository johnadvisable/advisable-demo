-- Update English
UPDATE credential_translations 
SET title = '53 Awards', 
    description = 'Award-winning digital agency recognized for outstanding performance on Paid Advertising, SEO, UI/UX.'
WHERE credential_id = 'e6ea2eef-ff54-48f8-9e78-f6112810a6de' 
AND language_id = (SELECT id FROM languages WHERE code = 'en');

-- Update Greek
UPDATE credential_translations 
SET title = '53 Βραβεία', 
    description = 'Βραβευμένη ψηφιακή εταιρεία με διακρίσεις σε Paid Advertising, SEO, UI/UX - Evolution Awards, Peak Awards, Loyalty Awards.'
WHERE credential_id = 'e6ea2eef-ff54-48f8-9e78-f6112810a6de' 
AND language_id = (SELECT id FROM languages WHERE code = 'el');

-- Update Spanish
UPDATE credential_translations 
SET title = '53 Premios', 
    description = 'Agencia digital galardonada reconocida por su rendimiento excepcional en Publicidad de Pago, SEO, UI/UX.'
WHERE credential_id = 'e6ea2eef-ff54-48f8-9e78-f6112810a6de' 
AND language_id = (SELECT id FROM languages WHERE code = 'es');

-- Update French
UPDATE credential_translations 
SET title = '53 Prix', 
    description = 'Agence digitale primée reconnue pour ses performances exceptionnelles en Publicité Payante, SEO, UI/UX.'
WHERE credential_id = 'e6ea2eef-ff54-48f8-9e78-f6112810a6de' 
AND language_id = (SELECT id FROM languages WHERE code = 'fr');

-- Update German
UPDATE credential_translations 
SET title = '53 Auszeichnungen', 
    description = 'Preisgekrönte Digitalagentur ausgezeichnet für herausragende Leistungen in Paid Advertising, SEO, UI/UX.'
WHERE credential_id = 'e6ea2eef-ff54-48f8-9e78-f6112810a6de' 
AND language_id = (SELECT id FROM languages WHERE code = 'de');

-- Update Italian
UPDATE credential_translations 
SET title = '53 Premi', 
    description = 'Agenzia digitale pluripremiata riconosciuta per le prestazioni eccezionali in Paid Advertising, SEO, UI/UX.'
WHERE credential_id = 'e6ea2eef-ff54-48f8-9e78-f6112810a6de' 
AND language_id = (SELECT id FROM languages WHERE code = 'it');