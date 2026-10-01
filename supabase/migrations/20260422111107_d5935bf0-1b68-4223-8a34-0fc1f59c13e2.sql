UPDATE public.insights_translations
SET content = 
  REPLACE(
  REPLACE(
  REPLACE(
  REPLACE(
  REPLACE(
    content,
    '<h3>Product System <strong><em>Outcomes owned: What gets built, when, at what quality.</em></strong></h3>',
    '<h3>Product System</h3>
<p><strong><em>Outcomes owned: What gets built, when, at what quality.</em></strong></p>'),
    '<h3>Growth System <strong><em>Outcomes owned: Awareness, acquisition, and conversion.</em></strong></h3>',
    '<h3>Growth System</h3>
<p><strong><em>Outcomes owned: Awareness, acquisition, and conversion.</em></strong></p>'),
    '<h3>Customer System <strong><em>Outcomes owned: Retention, satisfaction, and expansion revenue.</em></strong></h3>',
    '<h3>Customer System</h3>
<p><strong><em>Outcomes owned: Retention, satisfaction, and expansion revenue.</em></strong></p>'),
    '<h3>Revenue System <strong><em>Outcomes owned: New business, proposals, and commercial relationships.</em></strong></h3>',
    '<h3>Revenue System</h3>
<p><strong><em>Outcomes owned: New business, proposals, and commercial relationships.</em></strong></p>'),
    '<h3>Strategy System <strong><em>Outcomes owned: Direction, decisions, and organizational learning.</em></strong></h3>',
    '<h3>Strategy System</h3>
<p><strong><em>Outcomes owned: Direction, decisions, and organizational learning.</em></strong></p>')
WHERE insights_id = '6162fbfc-d15f-460a-8b2e-f844eaa86004' AND language_id = 1;