-- Delete service translations that have placeholder titles (like "Digitaler Service", "Servicio Digital", etc.)
DELETE FROM service_translations
WHERE language_id IN (2, 3, 4, 5, 10) -- es, fr, de, el, it
AND (
  title LIKE '%Digitaler Service%'
  OR title LIKE '%Digital Service%'
  OR title LIKE '%Servicio Digital%'
  OR title LIKE '%Service Numérique%'
  OR title LIKE '%Servizio Digitale%'
  OR title LIKE '%Ψηφιακή Υπηρεσία%'
  OR title = 'Service'
  OR title = 'Dienst'
  OR title = 'Servicio'
  OR title = 'Υπηρεσία'
  OR title = 'Servizio'
);