UPDATE insights_translations 
SET content = REPLACE(
  content, 
  'It''s good advice — but', 
  'It''s good advice,' || CHR(160) || 'but'
) 
WHERE id = '1043c717-1d0b-4032-912e-8594f182ec54';

UPDATE insights_translations 
SET excerpt = REPLACE(
  excerpt, 
  'It''s good advice — but', 
  'It''s good advice,' || CHR(160) || 'but'
) 
WHERE id = '1043c717-1d0b-4032-912e-8594f182ec54';