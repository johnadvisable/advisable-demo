
-- Create job_listings table
CREATE TABLE public.job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  city text NOT NULL,
  department text NOT NULL,
  employment_type text NOT NULL DEFAULT 'full-time',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to job_listings" ON public.job_listings FOR SELECT USING (true);
CREATE POLICY "Only admins can insert job_listings" ON public.job_listings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update job_listings" ON public.job_listings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete job_listings" ON public.job_listings FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create job_listing_translations table
CREATE TABLE public.job_listing_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_listing_id uuid NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  language_id integer NOT NULL REFERENCES public.languages(id),
  title text NOT NULL,
  short_description text,
  full_description text,
  requirements text,
  benefits text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(job_listing_id, language_id)
);

ALTER TABLE public.job_listing_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to job_listing_translations" ON public.job_listing_translations FOR SELECT USING (true);
CREATE POLICY "Only admins can insert job_listing_translations" ON public.job_listing_translations FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update job_listing_translations" ON public.job_listing_translations FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete job_listing_translations" ON public.job_listing_translations FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create job_applications table
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_listing_id uuid NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  cover_letter text,
  linkedin_url text,
  portfolio_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert job_applications" ON public.job_applications FOR INSERT WITH CHECK (true);

-- Trigger for updated_at on job_listings
CREATE TRIGGER update_job_listings_updated_at
BEFORE UPDATE ON public.job_listings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on job_listing_translations
CREATE TRIGGER update_job_listing_translations_updated_at
BEFORE UPDATE ON public.job_listing_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data: 5 job listings
INSERT INTO public.job_listings (id, slug, city, department, employment_type, display_order) VALUES
  ('a1000001-0000-0000-0000-000000000001', 'digital-marketing-specialist', 'athens', 'marketing', 'full-time', 1),
  ('a1000001-0000-0000-0000-000000000002', 'senior-frontend-developer', 'athens', 'development', 'full-time', 2),
  ('a1000001-0000-0000-0000-000000000003', 'graphic-designer', 'patras', 'graphics', 'full-time', 3),
  ('a1000001-0000-0000-0000-000000000004', 'backend-developer', 'patras', 'development', 'full-time', 4),
  ('a1000001-0000-0000-0000-000000000005', 'social-media-manager', 'athens', 'marketing', 'part-time', 5);

-- Seed English translations (language_id = 1)
INSERT INTO public.job_listing_translations (job_listing_id, language_id, title, short_description, full_description, requirements, benefits) VALUES
(
  'a1000001-0000-0000-0000-000000000001', 1,
  'Digital Marketing Specialist',
  'Join our marketing team and drive digital growth strategies for our diverse client portfolio.',
  '<h2>About the Role</h2><p>We are looking for a passionate Digital Marketing Specialist to join our Athens office. You will be responsible for planning, executing, and optimizing digital marketing campaigns across multiple channels including Google Ads, Meta Ads, and programmatic advertising.</p><h2>Responsibilities</h2><ul><li>Plan and execute digital marketing campaigns across paid search, social, and display channels</li><li>Analyze campaign performance and provide data-driven optimization recommendations</li><li>Manage client budgets and ensure optimal ROI</li><li>Create detailed performance reports and present insights to clients</li><li>Stay up-to-date with the latest digital marketing trends and platform updates</li><li>Collaborate with the creative team to develop compelling ad creatives</li></ul>',
  '<ul><li>2+ years of experience in digital marketing</li><li>Google Ads and Meta Ads certification preferred</li><li>Strong analytical skills and proficiency with Google Analytics</li><li>Excellent communication skills in English and Greek</li><li>Experience with marketing automation tools</li><li>Bachelor''s degree in Marketing, Business, or related field</li></ul>',
  '<ul><li>Competitive salary and performance bonuses</li><li>Flexible working hours and hybrid work model</li><li>Professional development budget</li><li>Health insurance</li><li>Modern office in central Athens</li><li>Team building events and company retreats</li></ul>'
),
(
  'a1000001-0000-0000-0000-000000000002', 1,
  'Senior Frontend Developer',
  'Build cutting-edge web applications using React, TypeScript, and modern frontend technologies.',
  '<h2>About the Role</h2><p>We are seeking an experienced Senior Frontend Developer to join our engineering team in Athens. You will lead the development of high-performance web applications for our clients and internal products, working with the latest technologies in the React ecosystem.</p><h2>Responsibilities</h2><ul><li>Architect and develop complex frontend applications using React and TypeScript</li><li>Mentor junior developers and conduct code reviews</li><li>Collaborate with designers to implement pixel-perfect UI/UX</li><li>Optimize application performance and ensure accessibility standards</li><li>Contribute to our component library and design system</li><li>Participate in technical planning and architecture decisions</li></ul>',
  '<ul><li>5+ years of frontend development experience</li><li>Expert knowledge of React, TypeScript, and modern CSS</li><li>Experience with state management (React Query, Zustand, or Redux)</li><li>Strong understanding of web performance optimization</li><li>Experience with testing frameworks (Jest, Cypress, or Playwright)</li><li>Familiarity with CI/CD pipelines and Git workflows</li></ul>',
  '<ul><li>Competitive salary package</li><li>Remote-first work culture</li><li>Latest MacBook Pro and peripherals</li><li>Conference attendance budget</li><li>Health and dental insurance</li><li>Stock options for senior roles</li></ul>'
),
(
  'a1000001-0000-0000-0000-000000000003', 1,
  'Graphic Designer',
  'Create stunning visual designs for digital campaigns, branding projects, and web interfaces.',
  '<h2>About the Role</h2><p>We are looking for a talented Graphic Designer to join our creative team in Patras. You will work on a variety of projects ranging from brand identity design to digital campaign creatives, collaborating closely with our marketing and development teams.</p><h2>Responsibilities</h2><ul><li>Design visual assets for digital marketing campaigns across social media, display, and email</li><li>Create brand identity systems including logos, color palettes, and brand guidelines</li><li>Design UI elements and marketing landing pages</li><li>Produce motion graphics and video content for social media</li><li>Maintain brand consistency across all client deliverables</li><li>Present design concepts to clients and incorporate feedback</li></ul>',
  '<ul><li>3+ years of professional graphic design experience</li><li>Expert proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign)</li><li>Experience with Figma or Sketch for UI design</li><li>Strong portfolio demonstrating versatility in digital and print design</li><li>Understanding of typography, color theory, and layout principles</li><li>Motion graphics skills (After Effects) are a plus</li></ul>',
  '<ul><li>Competitive salary</li><li>Creative and inspiring work environment</li><li>Professional development opportunities</li><li>Flexible schedule</li><li>Health insurance</li><li>Access to premium design tools and resources</li></ul>'
),
(
  'a1000001-0000-0000-0000-000000000004', 1,
  'Backend Developer',
  'Design and build scalable backend systems and APIs using Node.js, PostgreSQL, and cloud services.',
  '<h2>About the Role</h2><p>We are looking for a skilled Backend Developer to join our Patras engineering team. You will be responsible for designing, building, and maintaining server-side applications, APIs, and database architectures that power our products and client solutions.</p><h2>Responsibilities</h2><ul><li>Design and implement RESTful APIs and microservices</li><li>Build and optimize database schemas and queries</li><li>Implement authentication, authorization, and security best practices</li><li>Deploy and manage applications on cloud platforms (AWS, GCP, or Supabase)</li><li>Write comprehensive tests and documentation</li><li>Participate in code reviews and architectural discussions</li></ul>',
  '<ul><li>3+ years of backend development experience</li><li>Proficiency in Node.js/TypeScript or Python</li><li>Strong knowledge of PostgreSQL and database design</li><li>Experience with cloud services (AWS, GCP, or similar)</li><li>Understanding of RESTful API design principles</li><li>Familiarity with Docker and containerization</li></ul>',
  '<ul><li>Competitive compensation</li><li>Remote work flexibility</li><li>Learning and development budget</li><li>Health insurance coverage</li><li>Modern equipment provided</li><li>Collaborative team culture</li></ul>'
),
(
  'a1000001-0000-0000-0000-000000000005', 1,
  'Social Media Manager',
  'Manage and grow social media presence for our clients across Instagram, TikTok, LinkedIn, and more.',
  '<h2>About the Role</h2><p>We are seeking a creative and data-driven Social Media Manager to join our marketing team in Athens on a part-time basis. You will manage social media accounts for multiple clients, creating engaging content and building online communities.</p><h2>Responsibilities</h2><ul><li>Develop and execute social media strategies for multiple client accounts</li><li>Create and curate engaging content for Instagram, TikTok, LinkedIn, and Facebook</li><li>Monitor social media trends and identify opportunities for client engagement</li><li>Analyze performance metrics and create monthly reports</li><li>Manage community interactions and respond to comments/messages</li><li>Collaborate with the design team to create visual content</li></ul>',
  '<ul><li>2+ years of social media management experience</li><li>Proven track record of growing social media audiences</li><li>Proficiency with social media management tools (Hootsuite, Buffer, or similar)</li><li>Excellent copywriting skills in English and Greek</li><li>Understanding of social media analytics and KPIs</li><li>Experience with short-form video content creation</li></ul>',
  '<ul><li>Competitive hourly rate</li><li>Flexible part-time schedule (20 hours/week)</li><li>Work from home options</li><li>Professional networking opportunities</li><li>Access to premium social media tools</li></ul>'
);
