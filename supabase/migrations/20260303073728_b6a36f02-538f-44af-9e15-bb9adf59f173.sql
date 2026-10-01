
UPDATE service_translations SET
  title = REPLACE(title, 'Ανάπτυξη', 'Κατασκευή'),
  seo_title = REPLACE(seo_title, 'Ανάπτυξη', 'Κατασκευή'),
  meta_description = REPLACE(REPLACE(REPLACE(meta_description, 'ανάπτυξης', 'κατασκευής'), 'ανάπτυξη', 'κατασκευή'), 'Ανάπτυξη', 'Κατασκευή')
WHERE language_id = 5
AND id IN (
  '4e7d54bf-06d3-496e-aa61-5e1d652ab2bb',
  'bef17312-c2dc-4475-8895-46a96a98cdc1',
  'b5628f63-20d0-4bbc-8868-1d35ce20ef0d',
  '00e24e25-2b93-46e2-aa3f-c427bab8f1f4',
  '3291158b-5139-4f9b-9698-04be19fad0a9',
  '1594903b-c6fb-4834-82d2-e829dae73d05',
  '2e991b5b-7afe-4798-a547-0f53d4d865f1'
);
