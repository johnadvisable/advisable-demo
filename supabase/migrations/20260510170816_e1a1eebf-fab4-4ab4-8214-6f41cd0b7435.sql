ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_mode_check;
ALTER TABLE public.courses ADD COLUMN mode_new text[];
UPDATE public.courses SET mode_new = CASE
  WHEN mode = 'hybrid' THEN ARRAY['digital','physical']
  WHEN mode IS NOT NULL THEN ARRAY[mode]
  ELSE ARRAY['physical']
END;
ALTER TABLE public.courses DROP COLUMN mode;
ALTER TABLE public.courses RENAME COLUMN mode_new TO mode;
ALTER TABLE public.courses ALTER COLUMN mode SET NOT NULL;
ALTER TABLE public.courses ALTER COLUMN mode SET DEFAULT ARRAY['physical']::text[];
ALTER TABLE public.courses ADD CONSTRAINT courses_mode_check CHECK (
  array_length(mode, 1) >= 1 AND mode <@ ARRAY['digital','physical']
);
UPDATE public.courses SET mode = ARRAY['digital','physical'] WHERE slug = 'startup-ai-bootcamp';