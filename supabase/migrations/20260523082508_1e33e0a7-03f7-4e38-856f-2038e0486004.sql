UPDATE public.team_member_translations
SET name = REPLACE(REPLACE(name, 'Kollaras', 'Kallaras'), 'Κολλάρας', 'Καλλάρας'),
    bio = REPLACE(REPLACE(COALESCE(bio,''), 'Kollaras', 'Kallaras'), 'Κολλάρας', 'Καλλάρας')
WHERE team_member_id = '41ec84d2-4fec-4d74-bd66-5f6260b23f51';