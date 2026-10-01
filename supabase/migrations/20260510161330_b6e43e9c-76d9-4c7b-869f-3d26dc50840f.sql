
-- Instructors table
CREATE TABLE public.course_instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text,
  bio text,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.course_instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read course_instructors"
  ON public.course_instructors FOR SELECT
  USING (true);

-- Courses table
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  description text,
  cover_image_url text,
  mode text NOT NULL DEFAULT 'physical' CHECK (mode IN ('digital','physical','hybrid')),
  topic text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  location text,
  coordinator_id uuid REFERENCES public.course_instructors(id) ON DELETE SET NULL,
  is_published boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read courses"
  ON public.courses FOR SELECT
  USING (true);

CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_courses_published ON public.courses(is_published);

-- Lessons table
CREATE TABLE public.course_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  day_number int NOT NULL DEFAULT 1,
  day_label text,
  lesson_date date,
  start_time time,
  end_time time,
  title text NOT NULL,
  description text,
  bullets jsonb DEFAULT '[]'::jsonb,
  instructor_id uuid REFERENCES public.course_instructors(id) ON DELETE SET NULL,
  instructor_name_override text,
  is_break boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read course_lessons"
  ON public.course_lessons FOR SELECT
  USING (true);

CREATE INDEX idx_course_lessons_course ON public.course_lessons(course_id);

-- updated_at triggers (reuse existing function)
CREATE TRIGGER trg_courses_updated
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_course_instructors_updated
  BEFORE UPDATE ON public.course_instructors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_course_lessons_updated
  BEFORE UPDATE ON public.course_lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed instructors
INSERT INTO public.course_instructors (id, name, title) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Erik Sitter', 'Founder, Advisable'),
  ('11111111-1111-1111-1111-111111111102', 'Vasilis Kallaras', 'Business Strategy Lead'),
  ('11111111-1111-1111-1111-111111111103', 'Panos Kallaras', 'AI & Engineering Lead');

-- Seed course
INSERT INTO public.courses (id, slug, title, subtitle, description, mode, topic, start_date, end_date, location, coordinator_id, display_order)
VALUES (
  '22222222-2222-2222-2222-222222222201',
  'startup-ai-bootcamp',
  'Startup AI Bootcamp',
  'Two days. Build the foundation. Execute and scale.',
  'A two-day intensive masterclass for founders. Day 1 covers the foundation: pitch decks, business strategy, UI/UX, growth and AI. Day 2 focuses on execution: MVPs, fundraising, systems and product psychology.',
  'physical',
  'Startups',
  '2026-06-18',
  '2026-06-19',
  'Athens, Greece',
  '11111111-1111-1111-1111-111111111101',
  1
);

-- Seed lessons - Day 1
INSERT INTO public.course_lessons (course_id, day_number, day_label, lesson_date, start_time, end_time, title, instructor_id, instructor_name_override, is_break, bullets, display_order) VALUES
('22222222-2222-2222-2222-222222222201', 1, 'DAY 1 — BUILD THE FOUNDATION', '2026-06-18', '10:00', '11:00', 'Build Your Pitch Deck', '11111111-1111-1111-1111-111111111101', NULL, false,
  '["The perfect investor structure","Storytelling that sells","Pitching like a world-class founder","Real startup deck examples"]'::jsonb, 1),
('22222222-2222-2222-2222-222222222201', 1, 'DAY 1 — BUILD THE FOUNDATION', '2026-06-18', '11:15', '12:15', 'Business: How to Craft It', '11111111-1111-1111-1111-111111111102', NULL, false,
  '["Product-market fit","Business model strategy","Startup validation","Positioning against competitors"]'::jsonb, 2),
('22222222-2222-2222-2222-222222222201', 1, 'DAY 1 — BUILD THE FOUNDATION', '2026-06-18', '12:15', '13:00', 'Networking & Coffee Break', NULL, NULL, true, '[]'::jsonb, 3),
('22222222-2222-2222-2222-222222222201', 1, 'DAY 1 — BUILD THE FOUNDATION', '2026-06-18', '13:00', '14:00', 'UI/UX for Startups', '11111111-1111-1111-1111-111111111101', NULL, false,
  '["Design psychology","Building products users love","Conversion-first UI","UX mistakes startups make"]'::jsonb, 4),
('22222222-2222-2222-2222-222222222201', 1, 'DAY 1 — BUILD THE FOUNDATION', '2026-06-18', '14:15', '15:15', 'Growth Hacking & Viral Marketing', NULL, 'TBD', false,
  '["TikTok growth","Organic acquisition","Startup content strategy","Building attention in 2026"]'::jsonb, 5),
('22222222-2222-2222-2222-222222222201', 1, 'DAY 1 — BUILD THE FOUNDATION', '2026-06-18', '15:30', '16:30', 'AI for Startups', '11111111-1111-1111-1111-111111111103', NULL, false,
  '["AI agents","GPT workflows","Automations","Building AI-native companies"]'::jsonb, 6);

-- Seed lessons - Day 2
INSERT INTO public.course_lessons (course_id, day_number, day_label, lesson_date, start_time, end_time, title, instructor_id, instructor_name_override, is_break, bullets, display_order) VALUES
('22222222-2222-2222-2222-222222222201', 2, 'DAY 2 — EXECUTION & SCALING', '2026-06-19', '10:00', '11:00', 'Build an MVP', '11111111-1111-1111-1111-111111111103', NULL, false,
  '["Launching fast","No-code & AI tools","MVP architecture","From idea to product in days"]'::jsonb, 1),
('22222222-2222-2222-2222-222222222201', 2, 'DAY 2 — EXECUTION & SCALING', '2026-06-19', '11:15', '12:15', 'How to Raise Funding in 2026', NULL, 'TBD', false,
  '["VC expectations","Angel investors","Fundraising strategy","What investors REALLY want"]'::jsonb, 2),
('22222222-2222-2222-2222-222222222201', 2, 'DAY 2 — EXECUTION & SCALING', '2026-06-19', '12:15', '13:00', 'Networking & Coffee Break', NULL, NULL, true, '[]'::jsonb, 3),
('22222222-2222-2222-2222-222222222201', 2, 'DAY 2 — EXECUTION & SCALING', '2026-06-19', '13:00', '14:00', 'Startup Execution Systems', '11111111-1111-1111-1111-111111111102', NULL, false,
  '["Productivity systems","Team workflows","Founder execution","Scaling operations"]'::jsonb, 4),
('22222222-2222-2222-2222-222222222201', 2, 'DAY 2 — EXECUTION & SCALING', '2026-06-19', '14:15', '15:15', 'Design Thinking & Product Psychology', '11111111-1111-1111-1111-111111111101', NULL, false,
  '["Why users buy","Behavioral design","Product psychology","Retention & engagement"]'::jsonb, 5),
('22222222-2222-2222-2222-222222222201', 2, 'DAY 2 — EXECUTION & SCALING', '2026-06-19', '15:30', '16:30', 'Closing Session: The Future of AI Startups', '11111111-1111-1111-1111-111111111103', NULL, false,
  '["The next billion-dollar opportunities","AI-native startups","What founders should build next","Live Q&A"]'::jsonb, 6);
