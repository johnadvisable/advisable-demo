CREATE TABLE IF NOT EXISTS public.seminars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  description text,
  instructor text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  start_time time,
  end_time time,
  sessions_label text,
  seats integer NOT NULL DEFAULT 20,
  price_onsite numeric NOT NULL,
  price_online numeric GENERATED ALWAYS AS (round(price_onsite * 2 / 3.0)) STORED,
  currency text NOT NULL DEFAULT 'EUR',
  allows_onsite boolean NOT NULL DEFAULT true,
  allows_online boolean NOT NULL DEFAULT true,
  venue_name text,
  venue_address text,
  language text NOT NULL DEFAULT 'el',
  status text NOT NULL DEFAULT 'open',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.seminars TO anon;
GRANT SELECT ON public.seminars TO authenticated;
GRANT ALL ON public.seminars TO service_role;
ALTER TABLE public.seminars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seminars are publicly viewable" ON public.seminars FOR SELECT USING (true);
CREATE POLICY "Admins manage seminars" ON public.seminars FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_seminars_updated_at BEFORE UPDATE ON public.seminars
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.seminar_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminar_id uuid NOT NULL REFERENCES public.seminars(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  attendance_mode text NOT NULL DEFAULT 'onsite',
  price numeric,
  needs_invoice boolean NOT NULL DEFAULT false,
  vat_number text,
  legal_name text,
  activity text,
  notes text,
  language text,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_reference text,
  paid_at timestamptz,
  registration_status text NOT NULL DEFAULT 'registered',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.seminar_participants TO anon;
GRANT INSERT, SELECT, UPDATE, DELETE ON public.seminar_participants TO authenticated;
GRANT ALL ON public.seminar_participants TO service_role;
ALTER TABLE public.seminar_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for a seminar" ON public.seminar_participants FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view seminar participants" ON public.seminar_participants FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update seminar participants" ON public.seminar_participants FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete seminar participants" ON public.seminar_participants FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_seminar_participants_seminar ON public.seminar_participants(seminar_id);

CREATE TRIGGER update_seminar_participants_updated_at BEFORE UPDATE ON public.seminar_participants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.seminars (slug, title, subtitle, description, instructor, start_date, end_date, start_time, end_time, sessions_label, seats, price_onsite, allows_onsite, allows_online, venue_name, venue_address, language, status, display_order)
VALUES (
  'claude',
  'Claude Essentials for Business',
  'Claude, Cowork, Skills and MCP connectors',
  'A two-day introductory Claude seminar: everyday use, Claude Cowork, Claude Skills and MCP connectors. No technical background required.',
  'Βασίλης Καλλάρας',
  '2026-09-24', '2026-09-25', '15:00', '19:00',
  'Two four-hour sessions',
  20, 499, true, true,
  'Κεντρικά γραφεία Advisable',
  'Ηρώς 4, Κολωνός, 104 42 Αθήνα',
  'el', 'open', 1
) ON CONFLICT (slug) DO NOTHING;