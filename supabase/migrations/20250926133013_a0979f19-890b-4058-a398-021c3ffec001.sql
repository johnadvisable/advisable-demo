-- Create investments table
CREATE TABLE public.investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  website_url TEXT NOT NULL,
  logo TEXT,
  featured_image TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create investment translations table
CREATE TABLE public.investment_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  investment_id UUID NOT NULL,
  language_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  tagline TEXT,
  cta_primary_text TEXT,
  cta_secondary_text TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  testimonials JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT investment_translations_investment_id_fkey FOREIGN KEY (investment_id) REFERENCES public.investments(id) ON DELETE CASCADE,
  CONSTRAINT investment_translations_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id) ON DELETE CASCADE,
  UNIQUE(investment_id, language_id)
);

-- Enable RLS
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_translations ENABLE ROW LEVEL SECURITY;

-- Create policies for investments
CREATE POLICY "Public read access to investments" 
ON public.investments 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert investments" 
ON public.investments 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update investments" 
ON public.investments 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete investments" 
ON public.investments 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for investment translations
CREATE POLICY "Public read access to investment_translations" 
ON public.investment_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify investment_translations" 
ON public.investment_translations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create function to get all investments with translations
CREATE OR REPLACE FUNCTION public.get_all_investments_with_translation(p_language_code character varying)
RETURNS TABLE(
  id uuid,
  slug text,
  website_url text,
  logo text,
  featured_image text,
  display_order integer,
  is_active boolean,
  title text,
  short_description text,
  description text,
  tagline text,
  cta_primary_text text,
  cta_secondary_text text,
  features jsonb,
  benefits jsonb,
  testimonials jsonb
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  -- Get language ID
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  -- Get default language ID
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    i.id,
    i.slug,
    i.website_url,
    i.logo,
    i.featured_image,
    i.display_order,
    i.is_active,
    COALESCE(
      (SELECT it.title FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.title FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS title,
    COALESCE(
      (SELECT it.short_description FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.short_description FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS short_description,
    COALESCE(
      (SELECT it.description FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.description FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS description,
    COALESCE(
      (SELECT it.tagline FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.tagline FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS tagline,
    COALESCE(
      (SELECT it.cta_primary_text FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.cta_primary_text FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS cta_primary_text,
    COALESCE(
      (SELECT it.cta_secondary_text FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.cta_secondary_text FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS cta_secondary_text,
    COALESCE(
      (SELECT it.features FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.features FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      '[]'::jsonb
    ) AS features,
    COALESCE(
      (SELECT it.benefits FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.benefits FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      '[]'::jsonb
    ) AS benefits,
    COALESCE(
      (SELECT it.testimonials FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.testimonials FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      '[]'::jsonb
    ) AS testimonials
  FROM public.investments i
  WHERE i.is_active = true
  ORDER BY i.display_order, i.created_at;
END;
$function$;

-- Create function to get investment by slug with translation
CREATE OR REPLACE FUNCTION public.get_investment_by_slug_with_translation(p_slug text, p_language_code character varying)
RETURNS TABLE(
  id uuid,
  slug text,
  website_url text,
  logo text,
  featured_image text,
  display_order integer,
  is_active boolean,
  title text,
  short_description text,
  description text,
  tagline text,
  cta_primary_text text,
  cta_secondary_text text,
  features jsonb,
  benefits jsonb,
  testimonials jsonb
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  -- Get language ID
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  -- Get default language ID
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    i.id,
    i.slug,
    i.website_url,
    i.logo,
    i.featured_image,
    i.display_order,
    i.is_active,
    COALESCE(
      (SELECT it.title FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.title FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS title,
    COALESCE(
      (SELECT it.short_description FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.short_description FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS short_description,
    COALESCE(
      (SELECT it.description FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.description FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS description,
    COALESCE(
      (SELECT it.tagline FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.tagline FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS tagline,
    COALESCE(
      (SELECT it.cta_primary_text FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.cta_primary_text FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS cta_primary_text,
    COALESCE(
      (SELECT it.cta_secondary_text FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.cta_secondary_text FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      ''
    ) AS cta_secondary_text,
    COALESCE(
      (SELECT it.features FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.features FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      '[]'::jsonb
    ) AS features,
    COALESCE(
      (SELECT it.benefits FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.benefits FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      '[]'::jsonb
    ) AS benefits,
    COALESCE(
      (SELECT it.testimonials FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_language_id),
      (SELECT it.testimonials FROM public.investment_translations it 
       WHERE it.investment_id = i.id AND it.language_id = v_default_language_id),
      '[]'::jsonb
    ) AS testimonials
  FROM public.investments i
  WHERE i.slug = p_slug AND i.is_active = true
  LIMIT 1;
END;
$function$;

-- Insert sample data for the three investments
INSERT INTO public.investments (slug, website_url, display_order) VALUES
  ('fedra', 'https://fedra.com', 1),
  ('vyne', 'https://vyne.gr', 2),
  ('cardia-care', 'https://cardiacare.gr', 3);

-- Insert English translations
INSERT INTO public.investment_translations (investment_id, language_id, title, short_description, tagline, cta_primary_text, cta_secondary_text, features, benefits) VALUES
  (
    (SELECT id FROM public.investments WHERE slug = 'fedra'),
    (SELECT id FROM public.languages WHERE code = 'en'),
    'Fedra',
    'Cut Google Shopping Costs by 20%',
    'Fedra is a price comparison platform and certified Google CSS Partner that gives you an instant 20% discount on your Google Product Catalog advertising. Now in Greece, Italy & France.',
    'Get Started',
    'Learn More',
    '[
      {"title": "20% Discount on Google Shopping Ads", "description": "Immediately reduce your cost-per-click with our CSS partnership."},
      {"title": "No Change to Your Campaigns or Agency", "description": "Keep your existing setup and team - we integrate seamlessly."},
      {"title": "Fast Setup – Go Live in 24 Hours", "description": "Quick onboarding with minimal effort from your side."},
      {"title": "Full Transparency – You Keep Control", "description": "Maintain complete visibility and authority over your campaigns."},
      {"title": "Works with All eCommerce Platforms", "description": "Compatible with Shopify, WooCommerce, Magento, and custom stores."}
    ]'::jsonb,
    '[
      {"icon": "🇬🇷", "title": "Greece", "description": "Available now"},
      {"icon": "🇮🇹", "title": "Italy", "description": "Available now"},
      {"icon": "🇫🇷", "title": "France", "description": "Available now"},
      {"icon": "⚡", "title": "Live in 24h", "description": "Quick setup"},
      {"icon": "📊", "title": "Official Google CSS Partner", "description": "Certified partnership"}
    ]'::jsonb
  ),
  (
    (SELECT id FROM public.investments WHERE slug = 'vyne'),
    (SELECT id FROM public.languages WHERE code = 'en'),
    'Vyne',
    'Beauty, easier than ever.',
    'The new app that allows you to book beauty appointments how you want, when you want and with whom you want. Coming soon!',
    'Get Notified',
    'Learn More',
    '[
      {"title": "See real prices", "description": "No hidden charges or surprises."},
      {"title": "Book appointments online 24/7", "description": "Whenever it suits you, in seconds."},
      {"title": "Choose the best", "description": "See reviews, ratings and portfolio."},
      {"title": "Enjoy offers & discounts on every booking", "description": "Reward points, exclusive offers, special prices for returning customers and instant discounts with treats."}
    ]'::jsonb,
    '[
      {"icon": "📱", "title": "Mobile First", "description": "Easy to use app"},
      {"icon": "🎯", "title": "Instant Booking", "description": "Book in seconds"},
      {"icon": "💰", "title": "Best Prices", "description": "Transparent pricing"},
      {"icon": "⭐", "title": "Quality Service", "description": "Verified professionals"}
    ]'::jsonb
  ),
  (
    (SELECT id FROM public.investments WHERE slug = 'cardia-care'),
    (SELECT id FROM public.languages WHERE code = 'en'),
    'Cardia Care',
    'Innovative Home Care Services',
    'Cardiacare is the only comprehensive home care service that can offer you personalized care solutions for your loved ones, through a set of innovative care programs that combine innovation, high technology and reliability.',
    'Contact Us',
    'Learn More',
    '[
      {"title": "HOLTER RHYTHM", "description": "24h to 14 days - Latest technology, 8gr weight, waterproof, real-time symptom recording."},
      {"title": "HOLTER PRESSURE", "description": "24h to 48h - Automatic blood pressure monitoring that facilitates your daily routine."},
      {"title": "NIGHT OXIMETRY", "description": "New oxygen saturation and heart rate recording device during nighttime sleep."},
      {"title": "NEW SLEEP STUDY", "description": "Small portable cutting-edge technology device, wireless, giving you the ability to prescribe CPAP mask from EOPYY."},
      {"title": "PACEMAKER/DEFIBRILLATOR CHECK", "description": "Specialist cardiologist undertakes diagnostic control of necessary device parameters at home."},
      {"title": "HOME CARE SERVICES", "description": "Complete care for elderly, post-operative care, dementia care, mobility problems, oncological care."}
    ]'::jsonb,
    '[
      {"icon": "🏠", "title": "Home Service", "description": "Care at your home"},
      {"icon": "💗", "title": "Cardiac Care", "description": "Specialized equipment"},
      {"icon": "👨‍⚕️", "title": "Expert Team", "description": "Medical professionals"},
      {"icon": "📞", "title": "24/7 Support", "description": "Always available"},
      {"icon": "⭐", "title": "Excellent Reviews", "description": "4.7/5 rating"}
    ]'::jsonb
  );

-- Insert Greek translations
INSERT INTO public.investment_translations (investment_id, language_id, title, short_description, tagline, cta_primary_text, cta_secondary_text, features, benefits) VALUES
  (
    (SELECT id FROM public.investments WHERE slug = 'fedra'),
    (SELECT id FROM public.languages WHERE code = 'el'),
    'Fedra',
    'Μειώστε το κόστος Google Shopping κατά 20%',
    'Η Fedra είναι μια πλατφόρμα σύγκρισης τιμών και πιστοποιημένος Google CSS Partner που σας δίνει άμεσα 20% έκπτωση στη διαφήμιση του Google Product Catalog. Τώρα στην Ελλάδα, Ιταλία και Γαλλία.',
    'Ξεκινήστε',
    'Μάθετε Περισσότερα',
    '[
      {"title": "20% Έκπτωση στις διαφημίσεις Google Shopping", "description": "Μειώστε άμεσα το κόστος ανά κλικ με τη συνεργασία CSS."},
      {"title": "Χωρίς αλλαγή στις καμπάνιες ή το agency σας", "description": "Κρατήστε την υπάρχουσα ρύθμιση και ομάδα - ενσωματωνόμαστε απρόσκοπτα."},
      {"title": "Γρήγορη εγκατάσταση – Live σε 24 ώρες", "description": "Γρήγορη ενσωμάτωση με ελάχιστη προσπάθεια από τη μεριά σας."},
      {"title": "Πλήρης διαφάνεια – Κρατάτε τον έλεγχο", "description": "Διατηρήστε πλήρη ορατότητα και εξουσία στις καμπάνιες σας."},
      {"title": "Λειτουργεί με όλες τις πλατφόρμες eCommerce", "description": "Συμβατό με Shopify, WooCommerce, Magento και προσαρμοσμένα καταστήματα."}
    ]'::jsonb,
    '[
      {"icon": "🇬🇷", "title": "Ελλάδα", "description": "Διαθέσιμο τώρα"},
      {"icon": "🇮🇹", "title": "Ιταλία", "description": "Διαθέσιμο τώρα"},
      {"icon": "🇫🇷", "title": "Γαλλία", "description": "Διαθέσιμο τώρα"},
      {"icon": "⚡", "title": "Live σε 24 ώρες", "description": "Γρήγορη εγκατάσταση"},
      {"icon": "📊", "title": "Επίσημος Google CSS Partner", "description": "Πιστοποιημένη συνεργασία"}
    ]'::jsonb
  ),
  (
    (SELECT id FROM public.investments WHERE slug = 'vyne'),
    (SELECT id FROM public.languages WHERE code = 'el'),
    'Vyne',
    'Η ομορφιά, πιο εύκολη από ποτέ.',
    'Το νέο app που θα σου επιτρέπει να κλείνεις ραντεβού ομορφιάς όπως θέλεις, όποτε θέλεις και με όποιον θέλεις. Έρχεται σύντομα!',
    'Ειδοποίηση',
    'Μάθετε Περισσότερα',
    '[
      {"title": "Δες αληθινές τιμές", "description": "Δεν υπάρχουν κρυφές χρεώσεις ή εκπλήξεις."},
      {"title": "Κλείσε ραντεβού online 24/7", "description": "Όποτε σε βολεύει, σε λίγα δευτερόλεπτα."},
      {"title": "Επέλεξε τους καλύτερους", "description": "Δες κριτικές, αξιολογήσεις και portfolio."},
      {"title": "Απόλαυσε προσφορές & εκπτώσεις", "description": "Πόντοι επιβράβευσης, αποκλειστικές προσφορές, ειδικές τιμές και άμεσες εκπτώσεις."}
    ]'::jsonb,
    '[
      {"icon": "📱", "title": "Mobile First", "description": "Εύκολη εφαρμογή"},
      {"icon": "🎯", "title": "Instant Booking", "description": "Κράτηση σε δευτερόλεπτα"},
      {"icon": "💰", "title": "Καλύτερες Τιμές", "description": "Διάφανη τιμολόγηση"},
      {"icon": "⭐", "title": "Ποιοτική Εξυπηρέτηση", "description": "Επαληθευμένοι επαγγελματίες"}
    ]'::jsonb
  ),
  (
    (SELECT id FROM public.investments WHERE slug = 'cardia-care'),
    (SELECT id FROM public.languages WHERE code = 'el'),
    'Cardia Care',
    'Καινοτόμες Υπηρεσίες Φροντίδας στο Σπίτι',
    'Η Cardiacare είναι η μοναδική ολοκληρωμένη υπηρεσία φροντίδας στο σπίτι που μπορεί να σας προσφέρει εξατομικευμένες λύσεις φροντίδας για τους αγαπημένους σας.',
    'Επικοινωνία',
    'Μάθετε Περισσότερα',
    '[
      {"title": "HOLTER ΡΥΘΜΟΥ", "description": "24ωρο έως 14 ημέρες - Τελευταία τεχνολογία, βάρος 8gr, αδιάβροχο, καταγραφή συμπτωμάτων σε πραγματικό χρόνο."},
      {"title": "HOLTER ΠΙΕΣΗΣ", "description": "24ωρο έως 48ώρες - Αυτόματη παρακολούθηση αρτηριακής πίεσης που διευκολύνει την καθημερινότητά σας."},
      {"title": "ΝΥΧΤΕΡΙΝΗ ΟΞΥΜΕΤΡΙΑ", "description": "Νέα συσκευή καταγραφής κορεσμού οξυγόνου και καρδιακού ρυθμού κατά τη διάρκεια του νυχτερινού ύπνου."},
      {"title": "ΝΕΑ ΜΕΛΕΤΗ ΥΠΝΟΥ", "description": "Μικρή φορητή συσκευή κορυφαίας τεχνολογίας, ασύρματη, που δίνει τη δυνατότητα συνταγογράφησης CPAP από τον ΕΟΠΥΥ."},
      {"title": "ΕΛΕΓΧΟΣ ΒΗΜΑΤΟΔΟΤΗ/ΑΠΙΝΙΔΩΤΗ", "description": "Ειδικός καρδιολόγος αναλαμβάνει τον διαγνωστικό έλεγχο των παραμέτρων της συσκευής στο σπίτι."},
      {"title": "ΥΠΗΡΕΣΙΕΣ ΦΡΟΝΤΙΔΑΣ ΣΤΟ ΣΠΙΤΙ", "description": "Ολοκληρωμένη φροντίδα για ηλικιωμένους, μετεγχειρητική φροντίδα, φροντίδα άνοιας, κινητικά προβλήματα, ογκολογική φροντίδα."}
    ]'::jsonb,
    '[
      {"icon": "🏠", "title": "Υπηρεσία στο Σπίτι", "description": "Φροντίδα στο χώρο σας"},
      {"icon": "💗", "title": "Καρδιολογική Φροντίδα", "description": "Εξειδικευμένος εξοπλισμός"},
      {"icon": "👨‍⚕️", "title": "Έμπειρη Ομάδα", "description": "Ιατρικοί επαγγελματίες"},
      {"icon": "📞", "title": "24/7 Υποστήριξη", "description": "Πάντα διαθέσιμοι"},
      {"icon": "⭐", "title": "Άριστες Κριτικές", "description": "4.7/5 αξιολόγηση"}
    ]'::jsonb
  );