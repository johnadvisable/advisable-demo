-- Fix Elevate Greece Greek translation
UPDATE credential_translations 
SET title = 'Elevate Greece', 
    description = 'Μέλος του Elevate Greece, υποστηρίζοντας το ελληνικό οικοσύστημα startups.',
    updated_at = now()
WHERE credential_id = '1cc602a9-983f-4cd7-87d4-93fd2f2fd097' 
AND language_id = 5;

-- Fix Awards Winner Greek translation
UPDATE credential_translations 
SET title = 'Βραβευμένη Εταιρεία', 
    description = 'Πολυβραβευμένο ψηφιακό agency που αναγνωρίζεται για την εξαιρετική απόδοσή του.',
    updated_at = now()
WHERE credential_id = 'e6ea2eef-ff54-48f8-9e78-f6112810a6de' 
AND language_id = 5;