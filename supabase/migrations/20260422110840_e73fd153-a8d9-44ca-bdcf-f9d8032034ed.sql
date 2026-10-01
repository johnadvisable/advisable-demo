UPDATE public.insights_translations
SET content = 
  REPLACE(
  REPLACE(
  REPLACE(
  REPLACE(
  REPLACE(
  REPLACE(
    content,
    '<figure><img src="/images/insights/5-person-team-ai-native-featured.jpg" alt="The output of a 20-person company powered by 5 people and AI across Growth, Product, Operations, Customer and Revenue Systems" loading="lazy" style="width:100%;height:auto;border-radius:8px;margin:2rem 0" /></figure>

',
    ''),
    '<em>Outcomes owned: What gets built, when, at what quality.</em>',
    '<strong><em>Outcomes owned: What gets built, when, at what quality.</em></strong>'),
    '<em>Outcomes owned: Awareness, acquisition, and conversion.</em>',
    '<strong><em>Outcomes owned: Awareness, acquisition, and conversion.</em></strong>'),
    '<em>Outcomes owned: Retention, satisfaction, and expansion revenue.</em>',
    '<strong><em>Outcomes owned: Retention, satisfaction, and expansion revenue.</em></strong>'),
    '<em>Outcomes owned: New business, proposals, and commercial relationships.</em>',
    '<strong><em>Outcomes owned: New business, proposals, and commercial relationships.</em></strong>'),
    '<em>Outcomes owned: Direction, decisions, and organizational learning.</em>',
    '<strong><em>Outcomes owned: Direction, decisions, and organizational learning.</em></strong>')
WHERE insights_id = '6162fbfc-d15f-460a-8b2e-f844eaa86004' AND language_id = 1;