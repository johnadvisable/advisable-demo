import { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Home, Mail, CalendarDays, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { trackEvent } from '@/lib/analyticsTracking';

const AcademySeminarThankYou = () => {
  // Conversion tracking (GTM -> Meta Pixel, GA, OpenAI Ads)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore
    window.dataLayer.push({
      event: 'contact_form_submitted',
      conversion_type: 'lead',
      form_name: 'academy_seminar_booking',
      form_interest: 'academy-ai-for-business',
      page_path: window.location.pathname,
      language: 'el',
    });
    // Standard "Lead" naming for Meta Pixel mapping in GTM
    // @ts-ignore
    window.dataLayer.push({ event: 'Lead' });

    // GA lead event (dataLayer for GTM + gtag when GA is loaded directly)
    trackEvent('generate_lead', {
      event_category: 'Academy',
      event_label: 'AI for Business seminar',
      value: 1,
    });

    const eventId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    // Meta Pixel conversions
    if (typeof window.fbq === 'function') {
      const content = {
        content_name: 'academy_seminar_booking',
        content_category: 'academy-ai-for-business',
      };
      window.fbq('track', 'Lead', content, { eventID: eventId });
      window.fbq('track', 'CompleteRegistration', { ...content, status: true }, {
        eventID: `cr_${eventId}`,
      });
    }

    // OpenAI Ads conversion
    // @ts-ignore
    if (typeof window.oaiq === 'function') {
      // @ts-ignore
      window.oaiq('measure', 'lead_created', { type: 'customer_action' }, { event_id: eventId });
    }
  }, []);

  const triggerConfetti = useCallback(() => {
    const count = 200;
    const defaults = { origin: { y: 0.7 }, zIndex: 9999 };
    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
    };
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  useEffect(() => {
    triggerConfetti();
  }, [triggerConfetti]);

  return (
    <>
      <Helmet>
        <title>Ευχαριστούμε για την κράτηση | AI for Business | Advisable</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-24">
        <div className="text-center animate-fade-in max-w-xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Ευχαριστούμε, η κράτησή σου καταχωρήθηκε
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Κράτησες τη θέση σου στο σεμινάριο AI for Business. Θα λάβεις email με όλες τις λεπτομέρειες συμμετοχής.
          </p>

          <div className="text-left space-y-4 mb-8 rounded-2xl border border-border p-6">
            <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 mt-0.5 text-primary" />
              <p className="text-sm text-muted-foreground">24 και 25 Σεπτεμβρίου, ζωντανές συνεδρίες στα ελληνικά.</p>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5 text-primary" />
              <p className="text-sm text-muted-foreground">Ηρώς 4, Κολωνός, 104 42 Αθήνα ή online live stream.</p>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 mt-0.5 text-primary" />
              <p className="text-sm text-muted-foreground">
                Οι οδηγίες πρόσβασης και η βεβαίωση παρακολούθησης στέλνονται με email.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="rounded-full px-6">
              <Link to="/academy/seminar/claude">Δες ξανά το πρόγραμμα</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Αρχική
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default AcademySeminarThankYou;
