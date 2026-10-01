
-- Insert image before the "Struggled/Failed" h2 heading in all language versions

UPDATE insights_translations 
SET content = replace(
  content, 
  '<h2>The Sectors Where AI Creative Has Struggled, or Failed Outright</h2>',
  '<img src="/images/insights/ai-creative-studios-ad-production-failures.png" alt="AI creative production failures and struggles" style="width:100%;border-radius:8px;margin:2rem 0" />' || chr(10) || '<h2>The Sectors Where AI Creative Has Struggled, or Failed Outright</h2>'
),
updated_at = now()
WHERE id = '6d285c27-8d5f-425c-9a91-c49446a45fc5';

UPDATE insights_translations 
SET content = replace(
  content, 
  '<h2>Los sectores donde la creatividad de la IA ha tenido dificultades o ha fracasado por completo</h2>',
  '<img src="/images/insights/ai-creative-studios-ad-production-failures.png" alt="Los fracasos de la producción creativa con IA" style="width:100%;border-radius:8px;margin:2rem 0" />' || chr(10) || '<h2>Los sectores donde la creatividad de la IA ha tenido dificultades o ha fracasado por completo</h2>'
),
updated_at = now()
WHERE id = 'e7268ac5-2c3b-4e67-ab74-8991b9d96970';

UPDATE insights_translations 
SET content = replace(
  content, 
  E'<h2>Les secteurs où l''IA créative a eu du mal, ou a carrément échoué</h2>',
  E'<img src="/images/insights/ai-creative-studios-ad-production-failures.png" alt="Les échecs de la production créative IA" style="width:100%;border-radius:8px;margin:2rem 0" />\n<h2>Les secteurs où l''IA créative a eu du mal, ou a carrément échoué</h2>'
),
updated_at = now()
WHERE id = 'f6a42b3d-2aed-4040-9775-3e11982a6d22';

UPDATE insights_translations 
SET content = replace(
  content, 
  '<h2>Οι Τομείς στους Οποίους η Δημιουργική AI Έχει Αντιμετωπίσει Δυσκολίες ή Έχει Αποτύχει Πλήρως</h2>',
  '<img src="/images/insights/ai-creative-studios-ad-production-failures.png" alt="Αποτυχίες δημιουργικής παραγωγής AI" style="width:100%;border-radius:8px;margin:2rem 0" />' || chr(10) || '<h2>Οι Τομείς στους Οποίους η Δημιουργική AI Έχει Αντιμετωπίσει Δυσκολίες ή Έχει Αποτύχει Πλήρως</h2>'
),
updated_at = now()
WHERE id = 'a76218b0-fc36-4a98-87c3-9e66f7cc5906';

UPDATE insights_translations 
SET content = replace(
  content, 
  E'<h2>I settori in cui l''AI creativa ha faticato o fallito completamente</h2>',
  E'<img src="/images/insights/ai-creative-studios-ad-production-failures.png" alt="Fallimenti della produzione creativa AI" style="width:100%;border-radius:8px;margin:2rem 0" />\n<h2>I settori in cui l''AI creativa ha faticato o fallito completamente</h2>'
),
updated_at = now()
WHERE id = 'b9964354-f9eb-4245-8647-ddaed7b1d315';
