-- Add new team member: Giota Chrysanthakopoulou
INSERT INTO team_members (id, image_url, display_order, is_leadership)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '/images/team/giota-chrysanthakopoulou.png',
  33,
  false
);

-- Add translations for all languages
-- English (id: 1)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  1,
  'Giota Chrysanthakopoulou',
  'Marketing Specialist',
  NULL
);

-- Greek (id: 2)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  2,
  'Γιώτα Χρυσανθακοπούλου',
  'Marketing Specialist',
  NULL
);

-- Spanish (id: 3)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  3,
  'Giota Chrysanthakopoulou',
  'Marketing Specialist',
  NULL
);

-- French (id: 4)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  4,
  'Giota Chrysanthakopoulou',
  'Marketing Specialist',
  NULL
);

-- Italian (id: 5)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  5,
  'Giota Chrysanthakopoulou',
  'Marketing Specialist',
  NULL
);

-- German (id: 10)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  10,
  'Giota Chrysanthakopoulou',
  'Marketing Specialist',
  NULL
);