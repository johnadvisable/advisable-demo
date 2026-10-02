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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { buildNavigationUrl, getDomainForLanguage, isLocalDevelopment } from '@/utils/multilanguageUtils';
import {
  Calendar, MapPin, Users, Clock, Check, CheckCircle, Ticket,
  Sparkles, Bot, Plug, FileText, ShieldCheck, GraduationCap, Monitor, PlayCircle, MessageSquare, Mail, FileSpreadsheet, X, ArrowRight,
} from 'lucide-react';
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

/* ============================ V2 DATA ============================ */
const STATS = [
  ['8 ώρες', 'live εκπαίδευση σε δύο πρωινά'],
  ['4', 'πρακτικές ενότητες'],
  ['3 μήνες', 'πρόσβαση στη βιντεοσκόπηση'],
  ['0', 'τεχνικές γνώσεις απαιτούνται'],
];

const BEFORE_AFTER = [
  ['Μια προσφορά θέλει ώρες γραψίματος', 'Προσφορά έτοιμη σε δέκα λεπτά'],
  ['Η εβδομαδιαία αναφορά στήνεται με το χέρι', 'Αναφορά με ένα κλικ'],
  ['Εξηγείς ξανά templates και ύφος σε κάθε συνομιλία', 'Ένας βοηθός που ήδη ξέρει τους κανόνες της εταιρείας σου'],
  ['Αντιγράφεις δεδομένα από εργαλείο σε εργαλείο', 'Το AI δουλεύει απευθείας μέσα στα εργαλεία σου'],
];

const TAKEAWAYS = [
  [Bot, 'Ένα δικό σου Claude Skill', 'Για μια πραγματική, επαναλαμβανόμενη εργασία σου'],
  [Plug, 'Ένας MCP connector', 'Στημένος πάνω στα εργαλεία που ήδη χρησιμοποιείς'],
  [FileText, 'Οδηγός prompting', 'Έτοιμος να τον μοιραστείς με την ομάδα σου'],
  [GraduationCap, 'Βεβαίωση παρακολούθησης', 'Από την Advisable Academy'],
  [PlayCircle, '3 μήνες on-demand video', 'Η βιντεοσκόπηση όλου του σεμιναρίου'],
];

const AUDIENCE = ['Επιχειρηματίες', 'Managers', 'Marketers', 'Πωλητές', 'Ελεύθεροι επαγγελματίες'];

const REQUIREMENTS = [
  'Έναν λογαριασμό email',
  'Έναν δωρεάν λογαριασμό Claude, στέλνουμε οδηγίες πριν το σεμινάριο',
];

function getDaysLeft() {
  return Math.max(0, Math.ceil((new Date(CONFIG.START_DATE).getTime() - Date.now()) / 86400000));
}

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <header className="max-w-2xl">
      <p className="text-sm font-semibold tracking-wide text-primary-strong">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight lg:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>}
    </header>
  );
}

/* ======================= Booking (Eventora) ======================= */
function BookingPanel({ source }: { source: string }) {
  const daysLeft = getDaysLeft();
  return (
    <div className="rounded-2xl border border-primary/30 bg-card/70 p-6 shadow-[0_24px_64px_-24px_hsl(var(--primary)/0.45)] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold">AI for Business</p>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-strong">Live online</span>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-4xl font-black tracking-tight">{CONFIG.PRICE_ONLINE} €</span>
        <span className="text-sm text-muted-foreground">τελική τιμή</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Και για τις δύο ημέρες.</p>

      <dl className="mt-5 space-y-3 border-t border-border/60 pt-5 text-sm">
        {[
          [Calendar, 'Ημερομηνίες', CONFIG.DATES],
          [Clock, 'Ώρες', CONFIG.SESSION_HOURS],
          [Monitor, 'Τρόπος', 'Online, ζωντανά'],
          [GraduationCap, 'Γλώσσα', 'Ελληνικά'],
        ].map(([Icon, label, value]: any) => (
          // dt/dd must be direct children of the group div, so the icon lives inside dt
          <div key={label} className="relative pl-7">
            <dt className="text-xs text-muted-foreground">
              <Icon className="absolute left-0 top-0.5 h-4 w-4 text-primary-strong" aria-hidden="true" />
              {label}
            </dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      <Button asChild size="lg" className="group mt-6 w-full text-primary-ink">
        <a
          href={CONFIG.BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackBookingClick({ source, mode: 'online', value: CONFIG.PRICE_ONLINE })}
        >
          Κάνε κράτηση τώρα
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      </Button>

      <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
        <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary-strong" aria-hidden="true" />Ασφαλής πληρωμή μέσω Eventora</li>
        <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 shrink-0 text-primary-strong" aria-hidden="true" />Δωρεάν ακύρωση έως 10 ημέρες πριν</li>
      </ul>

      {daysLeft > 0 && (
        <p className="mt-5 rounded-lg bg-primary/10 px-3 py-2 text-center text-xs font-medium text-primary-strong">
          Απομένουν {daysLeft} ημέρες μέχρι την έναρξη
        </p>
      )}
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
        <section className="relative isolate overflow-hidden border-b border-border/50 bg-[hsl(195_45%_4%)]">
          {/* Ambient glow: teal, ocean blue and emerald, drifting slowly */}
          <div
            className="absolute -inset-[15%] motion-safe:animate-drift"
            style={{
              backgroundImage: [
                'radial-gradient(ellipse 45% 55% at 72% 42%, hsl(var(--primary) / 0.85), transparent 70%)',
                'radial-gradient(ellipse 40% 50% at 92% 85%, hsl(212 90% 55% / 0.7), transparent 70%)',
                'radial-gradient(ellipse 32% 38% at 55% 8%, hsl(155 75% 45% / 0.5), transparent 70%)',
              ].join(', '),
            }}
            aria-hidden="true"
          />
          {/* Spreadsheet grid, fading out toward the copy */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage: 'radial-gradient(ellipse 50% 70% at 75% 50%, black, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse 50% 70% at 75% 50%, black, transparent 75%)',
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(195_45%_4%)] via-[hsl(195_45%_4%/0.55)] to-transparent" aria-hidden="true" />
          {/* Work getting done: a proposal drafting itself, a report filling in, an email going out */}
          <div
            className="absolute right-[4%] top-1/2 hidden aspect-[4/3] w-[42%] max-w-[640px] -translate-y-1/2 lg:block"
            aria-hidden="true"
          >
            {/* Weekly report, back right */}
            <div className="absolute right-0 top-[4%] w-[46%] rotate-3 rounded-2xl border border-white/15 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-medium text-white/80">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                Εβδομαδιαία αναφορά
              </div>
              <div className="mt-5 flex h-28 items-end gap-2.5">
                {[45, 70, 55, 85, 65, 95].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-primary/50 to-primary motion-safe:animate-grow-bar"
                    style={{ height: `${h}%`, animationDelay: `${0.4 + i * 0.15}s` }}
                  />
                ))}
              </div>
              <div className="mt-3 h-px bg-white/15" />
              <p className="mt-2 text-[11px] text-white/50">Ενημερώθηκε αυτόματα</p>
            </div>

            {/* Proposal, main card */}
            <div className="absolute left-[2%] top-[14%] w-[52%] -rotate-2 rounded-2xl border border-white/20 bg-white/[0.09] p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-white/85">
                  <FileText className="h-4 w-4 text-primary" />
                  Προσφορά_Πελάτη.docx
                </div>
                <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                  <Clock className="h-3 w-3" />
                  10 λεπτά
                </span>
              </div>
              <div className="mt-5 h-3 w-2/3 origin-left rounded bg-white/70 motion-safe:animate-type-line" />
              <div className="mt-4 space-y-2.5">
                {['w-full', 'w-11/12', 'w-full', 'w-4/5', 'w-full', 'w-3/5'].map((w, i) => (
                  <div
                    key={i}
                    className={`h-2 ${w} origin-left rounded bg-white/25 motion-safe:animate-type-line`}
                    style={{ animationDelay: `${0.5 + i * 0.35}s` }}
                  />
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="h-2 w-1/4 rounded bg-white/20" />
                <div className="h-6 w-20 rounded-md bg-primary/80" />
              </div>
            </div>

            {/* Client email, front bottom */}
            <div className="absolute bottom-[4%] right-[10%] w-[48%] rotate-1 rounded-2xl border border-white/20 bg-black/60 p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-white/85">
                  <Mail className="h-4 w-4 text-primary" />
                  Προς: πελάτης
                </div>
                <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-ink motion-safe:animate-pop-in">
                  <Check className="h-3 w-3" />
                  Στάλθηκε
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-2 w-full rounded bg-white/25" />
                <div className="h-2 w-3/4 rounded bg-white/25" />
              </div>
            </div>
          </div>
          <div className="container relative mx-auto px-4 pb-16 pt-20 lg:pb-24 lg:pt-28">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                ADVISABLE ACADEMY · LIVE ONLINE
              </span>

              <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight text-white lg:text-7xl">
                AI for Business
                <span className="mt-2 block bg-gradient-to-r from-primary to-sky-400 bg-clip-text pb-1 text-3xl font-bold text-transparent lg:text-5xl">
                  με ChatGPT και Claude
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
                Διήμερο, πλήρως εισαγωγικό σεμινάριο για την καθημερινή σου δουλειά: Cowork, Skills και MCP connectors. Δεν χρειάζονται τεχνικές γνώσεις.
              </p>

              <ul className="mt-7 flex flex-wrap gap-2">
                {[
                  [Calendar, CONFIG.DATES],
                  [Clock, CONFIG.SESSION_HOURS],
                  [Monitor, 'Online, ζωντανά'],
                ].map(([Icon, text]: any) => (
                  <li key={text} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/85">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="group h-12 px-6 text-base text-primary-ink">
                  <a
                    href={CONFIG.BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackBookingClick({ source: 'hero_online', mode: 'online', value: CONFIG.PRICE_ONLINE })}
                  >
                    Κράτησε θέση · {CONFIG.PRICE_ONLINE} €
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="h-12 px-6 text-base text-white hover:bg-white/10 hover:text-white"
                  onClick={() => { trackAcademyEvent('view_agenda_click', { seminar: 'ai-for-business' }); scrollToId('agenda'); }}
                >
                  Δες το πρόγραμμα
                </Button>
              </div>
              <p className="mt-4 text-sm text-white/60">Τελική τιμή για το διήμερο · Δωρεάν ακύρωση έως 10 ημέρες πριν</p>
            </div>
          </div>
        </section>

        {/* Stats band */}
        <section aria-label="Με μια ματιά" className="border-b border-border/50 bg-card/30">
          <dl className="container mx-auto grid grid-cols-2 gap-y-8 px-4 py-10 lg:grid-cols-4">
            {STATS.map(([value, label]) => (
              <div key={label} className="px-2 text-center lg:border-l lg:border-border/50 lg:first:border-l-0">
                <dt className="sr-only">{label}</dt>
                <dd className="text-3xl font-black tracking-tight lg:text-4xl">{value}</dd>
                <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Body: content column + sticky booking rail on desktop */}
        <div className="container mx-auto px-4">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14 xl:gap-20">
            <div className="min-w-0 divide-y divide-border/50">

              {/* Before / after */}
              <section className="py-16 lg:py-24">
                <SectionHeading
                  eyebrow="Γιατί να έρθεις"
                  title="Δύο πρωινά που αλλάζουν τον τρόπο που δουλεύεις"
                  intro="Όλα όσα θα δεις τα εφαρμόζουμε καθημερινά στην Advisable, σε πραγματικά projects για περισσότερες από 250 εταιρείες."
                />
                <div className="mt-10 overflow-hidden rounded-2xl border border-border/60">
                  <div className="hidden grid-cols-2 border-b border-border/60 bg-card/40 text-xs font-semibold sm:grid">
                    <p className="px-6 py-3 text-muted-foreground">Σήμερα</p>
                    <p className="border-l border-border/60 px-6 py-3 text-primary-strong">Μετά το σεμινάριο</p>
                  </div>
                  <ul className="divide-y divide-border/60">
                    {BEFORE_AFTER.map(([before, after]) => (
                      <li key={before} className="grid sm:grid-cols-2">
                        <p className="flex items-start gap-3 px-6 pb-2 pt-5 text-sm text-muted-foreground sm:py-5">
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" aria-hidden="true" />
                          <span><span className="sr-only">Σήμερα: </span>{before}</span>
                        </p>
                        <p className="flex items-start gap-3 px-6 pb-5 pt-2 text-sm font-medium sm:border-l sm:border-border/60 sm:bg-primary/[0.04] sm:py-5">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary-strong" aria-hidden="true" />
                          <span><span className="sr-only">Μετά: </span>{after}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Curriculum */}
              <section id="curriculum" className="scroll-mt-6 py-16 lg:py-24">
                <SectionHeading
                  eyebrow="Τι θα μάθεις"
                  title="Τέσσερις ενότητες, από το πρώτο prompt έως τη σύνδεση με τα εργαλεία σου"
                  intro="Με εξάσκηση πάνω στη δική σου δουλειά. Το Claude Code δεν αποτελεί μέρος του σεμιναρίου."
                />
                <ol className="mt-10 grid gap-4 sm:grid-cols-2">
                  {MODULES.map(({ icon: Icon, title: mt, text }, i) => (
                    <li key={mt} className="rounded-2xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-primary/50 hover:bg-card/60">
                      <div className="flex items-center justify-between">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-strong ring-1 ring-primary/20">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="font-mono text-sm text-muted-foreground" aria-hidden="true">0{i + 1}</span>
                      </div>
                      <h3 className="mt-5 text-lg font-semibold">{mt}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Agenda */}
              <section id="agenda" className="scroll-mt-6 py-16 lg:py-24">
                <SectionHeading
                  eyebrow="Το πρόγραμμα"
                  title="Δύο τετράωρες live συνεδρίες"
                  intro="Με δύο σύντομα διαλείμματα κάθε μέρα."
                />
                <Tabs defaultValue="day-0" className="mt-10">
                  <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl bg-card/60 p-1 sm:inline-grid sm:w-auto">
                    {AGENDA.map((day, i) => (
                      <TabsTrigger
                        key={day.title}
                        value={`day-${i}`}
                        className="rounded-lg px-6 py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-ink"
                      >
                        Ημέρα {i + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {AGENDA.map((day, i) => (
                    <TabsContent key={day.title} value={`day-${i}`} className="mt-8">
                      <h3 className="text-lg font-semibold">{day.title.split(' - ')[1] ?? day.title}</h3>
                      <ol className="mt-6 border-l border-border/60 pl-6">
                        {day.slots.map(([time, text, isBreak]: any) => (
                          <li key={time} className="relative pb-6 last:pb-0">
                            <span
                              className={`absolute -left-[30px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-background ${isBreak ? 'bg-muted-foreground/40' : 'bg-primary'}`}
                              aria-hidden="true"
                            />
                            <p className="font-mono text-xs text-primary-strong">{time}</p>
                            <p className={`mt-1 text-sm leading-relaxed ${isBreak ? 'text-muted-foreground' : ''}`}>{text}</p>
                          </li>
                        ))}
                      </ol>
                    </TabsContent>
                  ))}
                </Tabs>
              </section>

              {/* Takeaways */}
              <section className="py-16 lg:py-24">
                <SectionHeading eyebrow="Τι παίρνεις μαζί σου" title="Φεύγεις με εργαλεία που ήδη δουλεύουν" />
                <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {TAKEAWAYS.map(([Icon, t, sub]: any) => (
                    <li key={t} className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/60 to-card/20 p-5">
                      <Icon className="h-5 w-5 text-primary-strong" aria-hidden="true" />
                      <p className="mt-4 font-semibold">{t}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Audience + requirements */}
              <section className="py-16 lg:py-24">
                <div className="grid gap-12 md:grid-cols-2">
                  <div>
                    <SectionHeading eyebrow="Σε ποιους απευθύνεται" title="Για όσους θέλουν να δουλεύουν πιο έξυπνα" />
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {AUDIENCE.map((a) => (
                        <li key={a} className="rounded-full border border-border/60 bg-card/40 px-3.5 py-1.5 text-sm">{a}</li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-muted-foreground">Κατάλληλο για κάθε επίπεδο γνώσεων.</p>
                  </div>
                  <div>
                    <SectionHeading eyebrow="Τι χρειάζεσαι" title="Σχεδόν τίποτα" />
                    <ul className="mt-6 space-y-3 text-sm">
                      {REQUIREMENTS.map((r) => (
                        <li key={r} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-strong" aria-hidden="true" />
                          {r}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-muted-foreground">Οι συνδρομές των εργαλείων δεν περιλαμβάνονται στην τιμή.</p>
                  </div>
                </div>
              </section>

              {/* Instructors */}
              <section className="py-16 lg:py-24">
                <SectionHeading eyebrow="Οι εκπαιδευτές σου" title="Άνθρωποι που δουλεύουν με AI κάθε μέρα" />
                <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                  {INSTRUCTORS.map((p) => (
                    <li
                      key={p.name}
                      className="relative flex gap-5 overflow-hidden rounded-2xl border border-primary/25 bg-white p-6 shadow-[0_20px_50px_-24px_hsl(var(--primary)/0.5)] transition-transform duration-300 motion-safe:hover:-translate-y-1"
                    >
                      {/* Light teal/sky tint echoing the hero palette */}
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          backgroundImage:
                            'radial-gradient(ellipse 70% 90% at 100% 0%, hsl(var(--primary) / 0.18), transparent 70%), radial-gradient(ellipse 50% 70% at 0% 100%, hsl(205 90% 60% / 0.12), transparent 70%)',
                        }}
                        aria-hidden="true"
                      />
                      <div className="relative h-20 w-20 shrink-0 rounded-2xl bg-gradient-to-br from-primary to-sky-500 p-[2px]">
                        <div className="h-full w-full overflow-hidden rounded-[14px] bg-secondary">
                          {p.image ? (
                            <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted-foreground">{p.name.charAt(0)}</div>
                          )}
                        </div>
                      </div>
                      <div className="relative min-w-0">
                        <p className="text-lg font-semibold">{p.name}</p>
                        <p className="text-sm font-medium text-primary-strong">{p.role}</p>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.bio}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="hidden py-16 lg:block lg:py-24" aria-label="Κράτηση">
              <div className="sticky top-8">
                <BookingPanel source="sidebar" />
              </div>
            </aside>
          </div>
        </div>

        {/* Proof, right before the booking section */}
        <SocialPostsSlider />
        <TrustedBySection currentLanguage={currentLanguage} />

        {/* Register + FAQ, objections answered at the point of decision */}
        <section id="register" className="scroll-mt-6 border-y border-border/50 bg-card/20">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
              <div>
                <SectionHeading eyebrow="Συχνές ερωτήσεις" title="Ό,τι χρειάζεται να ξέρεις πριν κλείσεις θέση" />
                <Accordion
                  type="single"
                  collapsible
                  className="mt-8"
                  onValueChange={(v) => v && trackAcademyEvent('faq_open', { seminar: 'ai-for-business', faq: v })}
                >
                  {FAQ.map((f, i) => (
                    <AccordionItem key={f.q} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                      <AccordionContent className="leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              <div className="order-first lg:order-none lg:sticky lg:top-8 lg:self-start">
                <BookingPanel source="register" />
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist for anyone not booking now */}
        <SeminarWaitlist seminar="ai-for-business" />

        {/* Corporate */}
        <section>
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card/60 to-background p-8 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:p-12">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold tracking-wide text-primary-strong">Για ομάδες</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight lg:text-3xl">Το προτιμάς μέσα στην ίδια σου την εταιρεία;</h2>
                <p className="mt-3 text-muted-foreground">
                  Τρέχουμε το ίδιο πρόγραμμα στον δικό σας χώρο, προσαρμοσμένο στις διαδικασίες και τα εργαλεία σας, με τιμολόγηση ανά ομάδα και δυνατότητα υλοποίησης μαζί με την Advisable.
                </p>
              </div>
              <Button asChild size="lg" variant="outline" className="group mt-6 h-auto w-full shrink-0 whitespace-normal py-3 text-center sm:w-auto lg:mt-0">
                <Link to={buildNavigationUrl('/contact', currentLanguage)}>
                  Ζήτησε προσφορά για την ομάδα σου
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
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
            <Button asChild size="lg" className="ml-auto shrink-0 text-primary-ink">
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
