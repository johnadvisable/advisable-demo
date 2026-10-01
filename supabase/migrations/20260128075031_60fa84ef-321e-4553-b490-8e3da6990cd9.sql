-- Add new team member: Diamianos Roussos
INSERT INTO team_members (id, image_url, display_order, is_leadership)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  '/images/team/diamianos-roussos.png',
  34,
  false
);

-- Add translations for all languages
-- English (id: 1)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  1,
  'Diamianos Roussos',
  'Marketing Specialist',
  NULL
);

-- Greek (id: 2)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  2,
  'Διαμιανός Ρούσσος',
  'Marketing Specialist',
  NULL
);

-- Spanish (id: 3)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  3,
  'Diamianos Roussos',
  'Marketing Specialist',
  NULL
);

-- French (id: 4)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  4,
  'Diamianos Roussos',
  'Marketing Specialist',
  NULL
);

-- Italian (id: 5)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  5,
  'Diamianos Roussos',
  'Marketing Specialist',
  NULL
);

-- German (id: 10)
INSERT INTO team_member_translations (team_member_id, language_id, name, job_title, bio)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  10,
  'Diamianos Roussos',
  'Marketing Specialist',
  NULL
);