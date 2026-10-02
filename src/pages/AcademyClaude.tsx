// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import TrustedBySection from '@/components/services/TrustedBySection';
import SocialPostsSlider from '@/components/academy/SocialPostsSlider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { buildNavigationUrl, getDomainForLanguage, isLocalDevelopment } from '@/utils/multilanguageUtils';
import {
  Calendar, MapPin, Users, Clock, Check, CheckCircle, Ticket,
  Sparkles, Bot, Plug, FileText, ShieldCheck, GraduationCap, Monitor, PlayCircle,
} from 'lucide-react';
import academyHero from '@/assets/academy-hero.jpg';
import SeminarWaitlist from '@/components/academy/SeminarWaitlist';
import { trackBookingClick, trackAcademyEvent, initScrollDepthTracking } from '@/lib/academyTracking';

/* ============================ CONFIG ============================ */
const CONFIG = {
  SLUG: 'claude',
  START_DATE: '2026-10-22',
  END_DATE: '2026-10-23',
  DATES: '22 & 23 Οκτωβρίου 2026',
  SESSION_HOURS: '10:00 - 14:00',
  SEATS: 25,
  PRICE: 199,
  PRICE_ONLINE: 149,
  INSTRUCTOR: 'Βασίλης Καλλάρας',
  VENUE_NAME: 'Κεντρικά γραφεία Advisable',
  VENUE_ADDRESS: 'Ηρούς 4, Κολωνός, 104 42 Αθήνα',
  VENUE_LANDMARK: 'Απέναντι από το Καπνεργοστάσιο',
  MAPS_URL: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Advisable, Ηρούς 4, Κολωνός, Αθήνα')}`,
  CANONICAL: 'https://www.advisable.com/academy/seminar/claude',
  BOOKING_URL: 'https://www.eventora.com/el/Events/advisable-academy',
};

const INSTRUCTORS = [
  {
    name: 'Βασίλης Καλλάρας',
    role: 'CEO & Co-Founder, Advisable',
    image: '/images/team/vasilis-kallaras.png',
    bio: 'Χτίζει AI-first ροές εργασίας σε επιχειρήσεις και ομάδες. Στο σεμιναριο δείχνει πώς το Claude μπαίνει στη στρατηγική και τη λήψη αποφάσεων.',
  },
  {
    name: 'Παναγιώτης Καλλάρας',
    role: 'Co-Founder, Advisable',
    image: '/images/team/panagiotis-kollaras.png',
    bio: 'Ηλεκτρολόγος Μηχανικός & Μηχανικός Υπολογιστών (Παν. Πατρών), Forbes 30 Under 30. Δουλεύει καθημερινά με AI εργαλεία σε πραγματικές επιχειρησιακές ροές.',
  },
  {
    name: 'Στέλλα Νούτσου',
    role: 'Head of Academy, Advisable',
    image: '/images/team/stella-noutsou.png',
    bio: 'Εκπαιδεύτρια στο πρακτικό κομμάτι του σεμιναρίου: πώς μπαίνει το Claude στην καθημερινή δουλειά μιας ομάδας.',
  },
  {
    name: 'Μάριος Ακριβός',
    role: 'Marketing Director, Advisable',
    image: '/images/team/marios-akrivos-seminar.jpg',
    bio: 'Σχεδιάζει και τρέχει marketing ροές με AI: περιεχόμενο, ερευνα και automation σε πραγματικά projects πελατών.',
  },
];




const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

function getPageUrl(language?: string): string {
  if (typeof window === 'undefined' || !window.location?.origin) return CONFIG.CANONICAL;
  if (isLocalDevelopment()) return `https://www.${getDomainForLanguage(language || 'en')}/academy/seminar/claude`;
  return `${window.location.origin}/academy/seminar/claude`;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: 'smooth' });
}

/* ============================ DATA ============================ */
const MODULES = [
  {
    icon: Sparkles,
    title: 'AI από το μηδέν: Claude και ChatGPT',
    text: 'Πώς να διατυπώνεις τα αιτήματά σου ώστε να παίρνεις ουσιαστικές απαντήσεις, σε ποιες εργασίες ξεχωρίζει το καθένα και πού κερδίζεις πολύτιμο χρόνο κάθε εβδομάδα.',
  },
  {
    icon: FileText,
    title: 'Claude Cowork',
    text: 'Το Claude γίνεται ο συνεργάτης σου σε έγγραφα, email, προσφορές και αναφορές. Συντάσσει, ελέγχει και διορθώνει, διατηρώντας το δικό σου ύφος.',
  },
  {
    icon: Bot,
    title: 'Claude Skills',
    text: 'Η τεχνογνωσία της ομάδας σου μετατρέπεται σε εργαλείο. Οργανώνεις τις διαδικασίες σου σε Skills και το AI ακολουθεί με συνέπεια τα templates και τους κανόνες σου σε κάθε εργασία.',
  },
  {
    icon: Plug,
    title: 'MCP connectors',
    text: 'Το πιο συναρπαστικό κομμάτι. Συνδέεις το Claude με το email, τα αρχεία, το CRM ή το eshop σου, ώστε να αντλεί δεδομένα και να ολοκληρώνει εργασίες απευθείας μέσα στα εργαλεία σου.',
  },
];

const AGENDA = [
  {
    title: 'Ημέρα 1 (24/9) - Ξεκινάμε με ChatGPT και Claude',
    slots: [
      ['15:00-15:15', 'Καλωσόρισμα, setup και τι θέλει να λύσει ο καθένας'],
      ['15:15-16:15', 'Βασικά σε ChatGPT και Claude: πώς ρωτάς, πώς δίνεις context, πώς ελέγχεις την απάντηση'],
      ['16:15-16:30', 'Διάλειμμα για καφέ', true],
      ['16:30-17:30', 'Cowork στην πράξη με ChatGPT και Claude: έγγραφα, email, προσφορές, συνόψεις'],
      ['17:30-17:45', 'Διάλειμμα', true],
      ['17:45-18:40', 'Claude Skills και custom GPTs: μετατρέπουμε τον τρόπο που δουλεύεις σε επαναχρησιμοποιήσιμο εργαλείο'],
      ['18:40-19:00', 'Ερωτήσεις και ανακεφαλαίωση'],
    ],
  },
  {
    title: 'Ημέρα 2 (25/9) - MCP connectors, artifacts και αυτοματισμοί',
    slots: [
      ['15:00-15:15', 'Ανακεφαλαίωση της πρώτης ημέρας'],
      ['15:15-16:15', 'MCP connectors: συνδέουμε ChatGPT και Claude με τα καθημερινά σου εργαλεία'],
      ['16:15-16:30', 'Διάλειμμα για καφέ', true],
      ['16:30-17:30', 'Artifacts και scheduled tasks: έτοιμα εργαλεία μέσα στη συνομιλία και δουλειές που τρέχουν μόνες τους'],
      ['17:30-17:45', 'Διάλειμμα', true],
      ['17:45-18:35', 'Ασφάλεια, δικαιώματα πρόσβασης και τι θέλει ανθρώπινο μάτι'],
      ['18:35-19:00', 'Το απλό σου playbook, ερωτήσεις και επόμενα βήματα'],

    ],
  },

];

const OUTCOMES = [
  'Έναν οδηγό prompting που μπορείς να δώσεις στην ομάδα σου',
  'Το δικό σου Claude Skill για μία πραγματική, επαναλαμβανόμενη εργασία',
  'Τουλάχιστον έναν MCP connector στημένο πάνω στα εργαλεία σου',
  'Μια σύντομη λίστα ελέγχου για ασφάλεια και δικαιώματα πρόσβασης',
  'Βεβαίωση παρακολούθησης και όλο το υλικό',
];

const FAQ = [
  { q: 'Χρειάζομαι τεχνικές γνώσεις;', a: 'Οχι. Το σεμινάριο είναι πλήρως εισαγωγικό. Αν χρησιμοποιείς email και browser, μπορείς να το παρακολουθήσεις.' },
  { q: 'Περιλαμβάνεται το Claude Code;', a: 'Οχι. Το σεμινάριο αφορά την καθημερινή επιχειρησιακή χρήση: ChatGPT και Claude, Cowork, Skills και MCP connectors. Το Claude Code δεν καλύπτεται.' },
  { q: 'Σε ποια γλώσσα γίνεται;', a: 'Στα ελληνικά. Για ομάδες μπορούμε να τρέξουμε ξεχωριστό τμήμα στα αγγλικά, αρκεί να μας το ζητήσετε.' },
  { q: 'Τι περιλαμβάνει η τιμή;', a: 'Η τιμή είναι τελική και περιλαμβάνει και τις δύο ημέρες, το υλικό, τη βεβαίωση παρακολούθησης και την υποστήριξη μετά το σεμινάριο. Οι συνδρομές των εργαλείων δεν περιλαμβάνονται.' },
  { q: 'Πώς γίνεται η πληρωμή;', a: 'Μετά την κράτησή σου σου στέλνουμε στοιχεία για τραπεζική κατάθεση ή online πληρωμή. Η θέση σου επιβεβαιώνεται με την προκαταβολή.' },
  { q: 'Μπορώ να ακυρώσω;', a: 'Δωρεάν ακύρωση έως 10 ημέρες πριν, με πλήρη επιστροφή χρημάτων. Μετά από αυτό η θέση σου μπορεί να μεταφερθεί σε επόμενο τμήμα ή σε άλλο άτομο.' },
];

/* ======================= Booking (Eventora) ======================= */
function BookingCard() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <Card className="border-border/60 bg-card/50 p-6 lg:p-8">
        <h3 className="text-2xl font-bold">Η κράτηση γίνεται μέσω Eventora</h3>
        <p className="mt-3 text-muted-foreground">
          Ολοκλήρωσε την κράτησή σου με ασφάλεια στη σελίδα του event.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { icon: Monitor, title: 'Online, live', price: CONFIG.PRICE_ONLINE, note: 'Οι ίδιες ζωντανές συνεδρίες μέσω διαδικτύου' },
          ].map((opt) => (
            <div key={opt.title} className="rounded-xl border border-border/60 p-4">
              <opt.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="mt-3 block font-semibold">{opt.title}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{opt.note}</span>
              <span className="mt-3 block text-2xl font-black">{opt.price} €</span>
              <span className="mt-2 block text-xs text-primary">Με βεβαίωση παρακολούθησης</span>
              <span className="mt-1 flex items-center gap-1.5 text-xs text-primary">
                <PlayCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                3 μήνες πρόσβαση στο on-demand video
              </span>
            </div>
          ))}
        </div>

        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          {[
            { icon: Check, text: `${CONFIG.DATES}, ${CONFIG.SESSION_HOURS}` },
            { icon: Check, text: 'Βεβαίωση παρακολούθησης' },
            { icon: PlayCircle, text: '3 μήνες πρόσβαση στο on-demand video lesson (βιντεοσκόπηση σεμιναρίου)' },
            { icon: Check, text: 'Υλικό και υποστήριξη μετά το σεμινάριο' },
          ].map((item) => (
            <li key={item.text} className="flex items-start gap-2">
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="lg:sticky lg:top-8 lg:self-start">
        <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-card/60 to-background p-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary">ΣΥΝΟΨΗ</p>
          <p className="mt-4 text-sm text-muted-foreground">
            AI for Business - και τις δύο ημέρες online (live)
          </p>
          <div className="mt-4 flex items-end justify-between border-t border-border/60 pt-4">
            <span className="text-sm text-muted-foreground">Τιμή από</span>
            <span className="text-4xl font-black">{CONFIG.PRICE_ONLINE} €</span>
          </div>
          <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
            <li>{CONFIG.DATES}</li>
            <li>{CONFIG.VENUE_ADDRESS}</li>
          </ul>

          <Button asChild size="lg" className="mt-6 w-full">
            <a
              href={CONFIG.BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick({ source: 'summary_card', mode: 'any', value: CONFIG.PRICE_ONLINE })}
            >
              <Ticket className="mr-2 h-4 w-4" />Κάνε κράτηση τώρα
            </a>
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Ασφαλής πληρωμή μέσω Eventora</p>
          <p className="mt-1 text-center text-xs text-muted-foreground">Δωρεάν ακύρωση έως 10 ημέρες πριν</p>
          <ul className="mt-4 space-y-1.5 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            {[
              'Δεν χρειάζονται τεχνικές γνώσεις',
              'Παρακολούθηση online',
              'Η τιμή είναι τελική και για τις δύο ημέρες',
              '250+ εταιρείες μας εμπιστεύονται',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}


/* ============================ PAGE ============================ */
export default function AcademyClaude() {
  const { currentLanguage } = useLanguage();
  const pageUrl = getPageUrl(currentLanguage);
  const ogImage = `${pageUrl.split('/academy')[0]}/images/academy/ai-for-business-og.jpg`;

  const [showSticky, setShowSticky] = useState(false);
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(CONFIG.START_DATE).getTime() - Date.now()) / 86400000),
  );

  // Meta pixel: SPA-safe PageView + ViewContent for this seminar page
  const metaFired = useRef(false);
  useEffect(() => {
    if (metaFired.current) return;
    metaFired.current = true;
    if (typeof window.fbq !== 'function') return;

    const initialPath = (window as any).__advInitialPath;
    const alreadyCountedOnLoad = initialPath === window.location.pathname;
    if (!alreadyCountedOnLoad) {
      window.fbq('track', 'PageView');
    }
    window.fbq('track', 'ViewContent', {
      content_name: 'AI for Business',
      content_category: 'seminar',
      content_ids: ['ai-for-business'],
      content_type: 'product',
      value: CONFIG.PRICE_ONLINE,
      currency: 'EUR',
    });
  }, []);

  useEffect(() => {
    const stopScrollDepth = initScrollDepthTracking('ai-for-business');
    const onScroll = () => setShowSticky(window.scrollY > 420);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      stopScrollDepth();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);


  const title = 'AI for Business: σεμινάριο ChatGPT και Claude στην Αθήνα | Advisable Academy';
  const description =
    'Διήμερο εισαγωγικό σεμινάριο AI for Business στην Αθήνα, 24 και 25 Σεπτεμβρίου 2026. ChatGPT και Claude, Cowork, Skills και MCP connectors για την καθημερινή δουλειά της επιχείρησης. Μικρό τμήμα, στα ελληνικά.';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'AI for Business',
    description,
    url: pageUrl,
    inLanguage: 'el',
    provider: { '@type': 'Organization', name: 'Advisable', url: pageUrl.replace('/academy/seminar/claude', '') },
    offers: {
      '@type': 'Offer',
      price: CONFIG.PRICE,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: CONFIG.BOOKING_URL,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      startDate: CONFIG.START_DATE,
      endDate: CONFIG.END_DATE,
      location: {
        '@type': 'Place',
        name: CONFIG.VENUE_NAME,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Ηρούς 4',
          addressLocality: 'Αθήνα',
          postalCode: '10442',
          addressCountry: 'GR',
        },
      },
      instructor: INSTRUCTORS.map((p) => ({ '@type': 'Person', name: p.name })),
    },
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} data-rh="true" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:secure_url" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Εκπαίδευση AI for Business της Advisable Academy" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>


      <main className="pb-24 md:pb-0">
        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-border/50 bg-black">
          <img src={academyHero} alt="Αίθουσα σεμιναρίων Advisable Academy στην Αθήνα" className="absolute inset-0 h-full w-full object-cover opacity-60" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" aria-hidden="true" />
          <div className="container relative mx-auto px-4 pb-20 pt-20 lg:pb-28 lg:pt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-white backdrop-blur">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              ADVISABLE ACADEMY
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white lg:text-6xl">
              AI for Business
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/80">
              Διήμερο, πλήρως εισαγωγικό σεμινάριο για τη χρήση του ChatGPT και του Claude στην καθημερινή σου δουλειά: Cowork, Skills και MCP connectors.
              Δεν χρειάζονται τεχνικές γνώσεις.
            </p>

            <ul className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
              {[
                [Calendar, CONFIG.DATES],
                [Clock, `Δύο τετράωρες live συνεδρίες, ${CONFIG.SESSION_HOURS} | Online`],
              ].map(([Icon, text]: any) => (
                <li key={text} className="flex items-start gap-2 text-sm text-white/80">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {/* Two clear options, decided here and not on Eventora */}
            <div className="mt-9 grid max-w-sm gap-3">
              <div className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur">
                <p className="text-3xl font-black text-white">
                  {CONFIG.PRICE_ONLINE} € <span className="text-base font-semibold text-white/80">| Online, live</span>
                </p>
                <p className="mt-1 text-xs text-white/70">Τελική τιμή για το διήμερο. Δωρεάν ακύρωση έως 10 ημέρες πριν.</p>
                <Button asChild className="mt-3 w-full">
                  <a
                    href={CONFIG.BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackBookingClick({ source: 'hero_online', mode: 'online', value: CONFIG.PRICE_ONLINE })}
                  >
                    Κράτησε online θέση
                  </a>
                </Button>
              </div>
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/80">
              {[
                '250+ εταιρείες μας εμπιστεύονται',
                'Google Premier Partner',
                'Βεβαίωση παρακολούθησης',
                '3 μήνες on-demand video',
                'Δωρεάν ακύρωση έως 10 ημέρες πριν',
              ].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => { trackAcademyEvent('view_agenda_click', { seminar: 'ai-for-business' }); scrollToId('agenda'); }}
                className="text-sm font-semibold text-white underline underline-offset-4 hover:text-primary"
              >
                Δες το πρόγραμμα
              </button>
              {daysLeft > 0 && (
                <span className="text-xs text-white/70">Απομένουν {daysLeft} ημέρες, οι θέσεις με φυσική παρουσία είναι μέχρι {CONFIG.SEATS}.</span>
              )}
            </div>
            <p className="mt-4 text-xs text-white/70">
              Γλώσσα διδασκαλίας: ελληνικά. Τελικές τιμές, ένα ενιαίο σεμινάριο και για τις δύο ημέρες.
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="border-b border-border/50">
          <div className="container mx-auto px-4 py-14 lg:py-20">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Δύο πρωινά που αλλάζουν τον τρόπο που δουλεύεις</h2>
            <p className="mt-4 max-w-3xl text-muted-foreground">
              Φαντάσου να ετοιμάζεις μια προσφορά σε δέκα λεπτά, να βγάζεις την εβδομαδιαία αναφορά με ένα κλικ και να έχεις στο πλευρό σου έναν βοηθό που γνωρίζει ήδη τα templates, τους κανόνες και το ύφος της εταιρείας σου. Ετσι δουλεύουν σήμερα οι ομάδες που αξιοποιούν σωστά το Claude και το ChatGPT. Σε δύο πρωινά σού δείχνουμε πώς, από το πρώτο prompt έως τη σύνδεση του AI με τα εργαλεία που χρησιμοποιείς.
            </p>
            <p className="mt-4 max-w-3xl text-muted-foreground">
              Ολα όσα θα δεις τα εφαρμόζουμε καθημερινά στην Advisable, σε πραγματικά projects για περισσότερες από 250 εταιρείες.
            </p>
          </div>
        </section>

        {/* What you learn */}
        <section className="border-b border-border/50">
          <div className="container mx-auto px-4 py-14 lg:py-20">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Τι θα μάθεις</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Τέσσερις ενότητες, από την αρχή και με εξάσκηση πάνω στη δική σου δουλειά. Το Claude Code δεν αποτελεί μέρος του σεμιναρίου.
            </p>
            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {MODULES.map(({ icon: Icon, title: mt, text }) => (
                <Card key={mt} className="border-border/60 bg-card/40 p-6 transition-colors hover:border-primary/40">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{mt}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>


        {/* Agenda */}
        <section id="agenda" className="scroll-mt-6 border-b border-border/50 bg-card/20">
          <div className="container mx-auto px-4 py-14 lg:py-20">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Το πρόγραμμα</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Δύο τετράωρες συνεδρίες, {CONFIG.SESSION_HOURS}, με δύο σύντομα διαλείμματα κάθε μέρα.
            </p>
            <div className="mt-9 grid gap-6 lg:grid-cols-2">
              {AGENDA.map((day) => (
                <Card key={day.title} className="border-border/60 bg-card/50 p-6 lg:p-8">
                  <h3 className="text-lg font-semibold leading-snug">{day.title}</h3>
                  <ul className="mt-5 space-y-3">
                    {day.slots.map(([time, text, isBreak]: any) => (
                      <li key={time} className={`flex gap-4 text-sm ${isBreak ? 'text-muted-foreground/70' : ''}`}>
                        <span className="w-24 shrink-0 font-mono text-xs text-primary">{time}</span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Audience / needs / outcomes */}
        <section className="border-b border-border/50">
          <div className="container mx-auto px-4 py-14 lg:py-20">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-border/60 bg-card/40 p-6">
                <h3 className="text-xl font-semibold">Σε ποιους απευθύνεται</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {['Επιχειρηματίες', 'Managers', 'Marketers', 'Πωλητές', 'Ελεύθεροι επαγγελματίες'].map((i) => (
                    <li key={i} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{i}</li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">Είναι κατάλληλο για κάθε επίπεδο γνώσεων, αρκεί η διάθεση να δουλέψεις πιο αποτελεσματικά.</p>
              </Card>

              <Card className="border-border/60 bg-card/40 p-6">
                <h3 className="text-xl font-semibold">Τι χρειάζεσαι</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {[
                    'Εναν λογαριασμό email',
                    'Εναν δωρεάν λογαριασμό Claude, στέλνουμε οδηγίες πριν το σεμινάριο',
                  ].map((i) => (
                    <li key={i} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{i}</li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">Το WiFi παρέχεται από την Advisable. Οι συνδρομές των εργαλείων δεν περιλαμβάνονται στην τιμή.</p>
              </Card>

              <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-card/50 to-background p-6">
                <h3 className="text-xl font-semibold">Τι παίρνεις μαζί σου</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {[
                    'Ενα δικό σου Claude Skill για μια πραγματική εργασία',
                    'Ενας MCP connector στημένος στα εργαλεία σου',
                    'Ενας οδηγός prompting για την ομάδα σου',
                    'Βεβαίωση παρακολούθησης',
                    'Πρόσβαση στη βιντεοσκόπηση του σεμιναρίου για 3 μήνες',
                  ].map((i) => (
                    <li key={i} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{i}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Instructors */}
        <section className="border-b border-border/50 bg-card/20">
          <div className="container mx-auto px-4 py-14 lg:py-20">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Οι εκπαιδευτές σου</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {INSTRUCTORS.map((p) => (
                <Card key={p.name} className="border-border/60 bg-card/50 p-6">
                  <div className="h-20 w-20 overflow-hidden rounded-full border border-border/60 bg-secondary">
                    {p.image ? (
                      <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-muted-foreground">
                        {p.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-lg font-semibold">{p.name}</p>
                  <p className="text-sm text-primary">{p.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.bio}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Venue (hidden while the seminar runs online only) */}
        <section className="hidden border-b border-border/50">
          <div className="container mx-auto px-4 py-14 lg:py-20">
            <div className="grid gap-6 lg:grid-cols-2">


              <Card className="border-border/60 bg-card/50 p-6 lg:p-8">
                <h2 className="text-2xl font-bold tracking-tight">Πού γίνεται</h2>
                <p className="mt-4 text-sm text-muted-foreground">{CONFIG.VENUE_NAME}</p>
                <p className="text-lg font-semibold">{CONFIG.VENUE_ADDRESS}</p>
                <p className="mt-1 text-sm text-muted-foreground">{CONFIG.VENUE_LANDMARK}</p>
                <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                  <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Και online, με live stream. Μπορείς να παρακολουθήσεις είτε με φυσική παρουσία στα γραφεία μας είτε online live.
                </p>
                <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Θα σου στείλουμε αναλυτικές οδηγίες πρόσβασης, ή τον σύνδεσμο σύνδεσης για το online live, με email μαζί με την επιβεβαίωση.
                </p>
                <Button asChild variant="outline" className="mt-6">
                  <a href={CONFIG.MAPS_URL} target="_blank" rel="noopener noreferrer">Οδηγίες στον χάρτη</a>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Proof, right before the booking section */}
        <SocialPostsSlider />
        <TrustedBySection currentLanguage={currentLanguage} />

        {/* Register */}
        <section id="register" className="scroll-mt-6 border-b border-border/50">
          <div className="container mx-auto px-4 py-14 lg:py-20">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Κράτησε τη θέση σου</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Η κράτηση και η πληρωμή γίνονται μέσω Eventora.
              {daysLeft > 0 && ` Απομένουν ${daysLeft} ημέρες μέχρι την έναρξη.`}
            </p>
            <div className="mt-9">
              <BookingCard />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-border/50 bg-card/20">
          <div className="container mx-auto px-4 py-14 lg:py-20">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Συχνές ερωτήσεις</h2>
            <Accordion
              type="single"
              collapsible
              className="mt-8 max-w-3xl"
              onValueChange={(v) => v && trackAcademyEvent('faq_open', { seminar: 'ai-for-business', faq: v })}
            >
              {FAQ.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Waitlist for anyone not booking now */}
        <SeminarWaitlist seminar="ai-for-business" />

        {/* Corporate */}
        <section>
          <div className="container mx-auto px-4 py-14 lg:py-20">
            <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-card/50 to-background p-8 lg:p-10">
              <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">Το προτιμάς μέσα στην ίδια σου την εταιρεία;</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Τρέχουμε το ίδιο πρόγραμμα στον δικό σας χώρο, προσαρμοσμένο στις διαδικασίες και τα εργαλεία σας, με τιμολόγηση ανά ομάδα και δυνατότητα υλοποίησης
                μαζί με την Advisable.
              </p>
              <Button asChild size="lg" className="mt-6">
                <Link to={buildNavigationUrl('/contact', currentLanguage)}>Ζήτησε προσφορά για την ομάδα σου</Link>
              </Button>
            </Card>
          </div>
        </section>

      </main>

      {/* Sticky mobile booking bar, appears after the hero */}
      {showSticky && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="text-[11px] leading-tight text-muted-foreground">{CONFIG.DATES}</p>
              <p className="text-sm font-black leading-tight">{CONFIG.PRICE_ONLINE} €</p>
              <p className="text-[10px] leading-tight text-muted-foreground">Δωρεάν ακύρωση έως 10 ημέρες πριν</p>
            </div>
            <Button asChild size="lg" className="ml-auto shrink-0">
              <a
                href={CONFIG.BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick({ source: 'sticky_mobile', mode: 'any', value: CONFIG.PRICE_ONLINE })}
              >
                Κάνε κράτηση τώρα
              </a>
            </Button>
          </div>
        </div>
      )}


    </div>
  );
}
