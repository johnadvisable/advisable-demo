
-- Add Italian language
INSERT INTO languages (code, name, is_active, is_default)
VALUES ('it', 'Italiano', true, false)
ON CONFLICT (code) DO UPDATE SET is_active = true;
