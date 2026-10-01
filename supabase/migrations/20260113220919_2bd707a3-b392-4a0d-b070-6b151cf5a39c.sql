INSERT INTO hero_content_translations (hero_content_id, language_id, heading, subheading)
VALUES ('ec26f7be-ae65-45b1-8af8-efa4cd6630e6', 10, 'Rule the AI-first world.', 'Soluzioni digitali all''avanguardia per aziende moderne, guidando la crescita attraverso innovazione ed expertise.')
ON CONFLICT (hero_content_id, language_id) DO UPDATE SET heading = 'Rule the AI-first world.';