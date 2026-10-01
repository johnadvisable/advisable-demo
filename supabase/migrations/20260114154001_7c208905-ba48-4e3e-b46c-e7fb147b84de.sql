-- Fix Awards Winner Greek translation with correct description
UPDATE credential_translations 
SET description = 'Περισσότερα από 50x βραβεία Digital agency σε Evolution Awards, Peak Awards, Loyalty Awards, UI/UX Awards',
    updated_at = now()
WHERE credential_id = 'e6ea2eef-ff54-48f8-9e78-f6112810a6de' 
AND language_id = 5;

-- Fix Elevate Greece Greek translation with correct description
UPDATE credential_translations 
SET description = 'Μέλος του Εθνικού Μητρώου Νεοφυών Επιχειρήσεων',
    updated_at = now()
WHERE credential_id = '1cc602a9-983f-4cd7-87d4-93fd2f2fd097' 
AND language_id = 5;