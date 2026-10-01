-- First, let's populate the team_member_translations table with sample translated data
-- Get the language IDs first
DO $$
DECLARE
  en_lang_id INTEGER;
  gr_lang_id INTEGER;
  team_member_record RECORD;
BEGIN
  -- Get language IDs
  SELECT id INTO en_lang_id FROM public.languages WHERE code = 'en' AND is_active = true;
  SELECT id INTO gr_lang_id FROM public.languages WHERE code = 'el' AND is_active = true;
  
  -- If Greek language doesn't exist, create it
  IF gr_lang_id IS NULL THEN
    INSERT INTO public.languages (code, name, is_active, is_default) 
    VALUES ('el', 'Greek', true, false)
    RETURNING id INTO gr_lang_id;
  END IF;
  
  -- Populate translations for key team members
  -- Vasilis Kallaras (CEO)
  INSERT INTO public.team_member_translations (team_member_id, language_id, name, job_title, bio, role_description)
  SELECT 
    'f301934e-5501-4c2e-819d-9c310e66953d'::uuid,
    gr_lang_id,
    'Βασίλης Καλλαράς',
    'Συνιδρυτής & Διευθύνων Σύμβουλος',
    'Είναι ο εμψυχωτής και συνιδρυτής της Advisable Digital Agency, την οποία δημιούργησε το 2015. Έχοντας πάνω από 15 χρόνια εμπειρίας στον τομέα των υπολογιστών και του Ηλεκτρονικού Εμπορίου, σχεδίασε, με τη βοήθεια της ομάδας Advisable, την βραβευμένη πλατφόρμα E-commercen, μέσω της οποίας δίνεται η δυνατότητα πλήρους ελέγχου και λειτουργίας ενός ηλεκτρονικού καταστήματος.',
    'Συνιδρυτής & Διευθύνων Σύμβουλος'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.team_member_translations 
    WHERE team_member_id = 'f301934e-5501-4c2e-819d-9c310e66953d'::uuid 
    AND language_id = gr_lang_id
  );

  -- Panos Kollaras (Co-founder)
  INSERT INTO public.team_member_translations (team_member_id, language_id, name, job_title, bio, role_description)
  SELECT 
    '41ec84d2-4fec-4d74-bd66-5f6260b23f51'::uuid,
    gr_lang_id,
    'Πάνος Κολλαράς',
    'Συνιδρυτής',
    'Ο Παναγιώτης Κολλαράς είναι συνιδρυτής της Advisable Agency και έχει κατάρτιση στην Ηλεκτρολογία και Μηχανικών Υπολογιστών από το Τμήμα Ηλεκτρολόγων Μηχανικών και Τεχνολογίας Υπολογιστών (ΗΜΤΥ) του Πανεπιστημίου Πατρών. Είναι αφοσιωμένος στο να βοηθά τις επιχειρήσεις να πετύχουν στον ψηφιακό κόσμο.',
    'Συνιδρυτής'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.team_member_translations 
    WHERE team_member_id = '41ec84d2-4fec-4d74-bd66-5f6260b23f51'::uuid 
    AND language_id = gr_lang_id
  );

  -- Alexander Theodosiou
  INSERT INTO public.team_member_translations (team_member_id, language_id, name, job_title, bio, role_description)
  SELECT 
    '59d02912-e172-460e-865c-b3fbbc3e5f89'::uuid,
    gr_lang_id,
    'Αλέξανδρος Θεοδοσίου',
    'Μέλος Ομάδας',
    'Έμπειρος προγραμματιστής με εξειδίκευση στην ανάπτυξη web εφαρμογών και τη διαχείριση βάσεων δεδομένων.',
    'Προγραμματιστής'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.team_member_translations 
    WHERE team_member_id = '59d02912-e172-460e-865c-b3fbbc3e5f89'::uuid 
    AND language_id = gr_lang_id
  );

  -- Add more generic translations for other team members
  FOR team_member_record IN 
    SELECT id, name, position, bio FROM public.team_members 
    WHERE id NOT IN (
      'f301934e-5501-4c2e-819d-9c310e66953d'::uuid,
      '41ec84d2-4fec-4d74-bd66-5f6260b23f51'::uuid,
      '59d02912-e172-460e-865c-b3fbbc3e5f89'::uuid
    )
    LIMIT 10 -- Just do a few examples
  LOOP
    INSERT INTO public.team_member_translations (team_member_id, language_id, name, job_title, bio, role_description)
    SELECT 
      team_member_record.id,
      gr_lang_id,
      team_member_record.name || ' (GR)', -- Simple Greek version
      CASE 
        WHEN team_member_record.position LIKE '%Developer%' THEN 'Προγραμματιστής'
        WHEN team_member_record.position LIKE '%Designer%' THEN 'Σχεδιαστής'
        WHEN team_member_record.position LIKE '%Manager%' THEN 'Διευθυντής'
        ELSE 'Μέλος Ομάδας'
      END,
      COALESCE(team_member_record.bio, '') || ' (Ελληνική έκδοση)',
      CASE 
        WHEN team_member_record.position LIKE '%Developer%' THEN 'Προγραμματιστής'
        WHEN team_member_record.position LIKE '%Designer%' THEN 'Σχεδιαστής'
        WHEN team_member_record.position LIKE '%Manager%' THEN 'Διευθυντής'
        ELSE 'Μέλος Ομάδας'
      END
    WHERE NOT EXISTS (
      SELECT 1 FROM public.team_member_translations 
      WHERE team_member_id = team_member_record.id 
      AND language_id = gr_lang_id
    );
  END LOOP;

END $$;