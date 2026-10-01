ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'video_learner';

CREATE OR REPLACE FUNCTION public.vl_touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.learner_profiles (
  user_id uuid PRIMARY KEY,
  email text,
  full_name text,
  phone text,
  company text,
  job_title text,
  billing_company text,
  vat_number text,
  tax_office text,
  billing_address text,
  billing_city text,
  billing_postcode text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.learner_profiles TO authenticated;
GRANT ALL ON public.learner_profiles TO service_role;
ALTER TABLE public.learner_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile read" ON public.learner_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Own profile insert" ON public.learner_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own profile update" ON public.learner_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER learner_profiles_updated BEFORE UPDATE ON public.learner_profiles FOR EACH ROW EXECUTE FUNCTION public.vl_touch_updated_at();

CREATE TABLE public.video_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  language_code text NOT NULL DEFAULT 'el',
  price_eur numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'hidden' CHECK (status IN ('live','coming_soon','hidden')),
  cover_image text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.video_courses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_courses TO authenticated;
GRANT ALL ON public.video_courses TO service_role;
ALTER TABLE public.video_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible courses" ON public.video_courses FOR SELECT USING (status <> 'hidden' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage courses" ON public.video_courses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER video_courses_updated BEFORE UPDATE ON public.video_courses FOR EACH ROW EXECUTE FUNCTION public.vl_touch_updated_at();

CREATE TABLE public.video_course_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.video_courses(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
  amount_eur numeric(10,2) NOT NULL DEFAULT 0,
  provider text,
  provider_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_course_purchases TO authenticated;
GRANT ALL ON public.video_course_purchases TO service_role;
ALTER TABLE public.video_course_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own purchases read" ON public.video_course_purchases FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Own pending purchase insert" ON public.video_course_purchases FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'pending' AND provider_ref IS NULL);
CREATE POLICY "Admins update purchases" ON public.video_course_purchases FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete purchases" ON public.video_course_purchases FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER video_course_purchases_updated BEFORE UPDATE ON public.video_course_purchases FOR EACH ROW EXECUTE FUNCTION public.vl_touch_updated_at();

CREATE OR REPLACE FUNCTION public.vl_handle_new_learner() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.learner_profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'))
  ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'video_learner'::public.app_role)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.vl_handle_new_learner() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_created_learner AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.vl_handle_new_learner();

INSERT INTO public.video_courses (slug, title, description, language_code, status, display_order) VALUES
 ('claude-ai-for-business', 'Claude: AI for Business', 'Video μαθήματα για το Claude στην καθημερινή δουλειά.', 'el', 'coming_soon', 1),
 ('chatgpt-ai-for-business', 'ChatGPT: AI for Business', 'Video μαθήματα για το ChatGPT στην καθημερινή δουλειά.', 'el', 'coming_soon', 2),
 ('on-demand-lessons', 'On Demand Lessons', 'Μεμονωμένα μαθήματα, όποτε θέλεις.', 'el', 'coming_soon', 3);