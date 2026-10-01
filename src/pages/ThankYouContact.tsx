import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/context/LanguageContext';
import { getAllTeamMembers, TeamMember } from '@/services/teamMemberService';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import confetti from 'canvas-confetti';
import { trackEvent } from '@/lib/analyticsTracking';

interface SubmissionState {
  interest?: string;
  email?: string;
  name?: string;
  language?: string;
}

const ThankYouContact = () => {
  const { t } = useTranslation('contact');
  const { currentLanguage } = useLanguage();
  const location = useLocation();
  const state = (location.state || {}) as SubmissionState;

  // Push conversion event to dataLayer (GTM → Meta Pixel)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore
    window.dataLayer.push({
      event: 'contact_form_submitted',
      conversion_type: 'lead',
      form_name: 'contact',
      form_interest: state.interest || 'unknown',
      page_path: window.location.pathname,
      language: state.language || currentLanguage,
    });
    // Standard "Lead" naming for Meta Pixel mapping in GTM
    // @ts-ignore
    window.dataLayer.push({ event: 'Lead' });

    // GA lead event (dataLayer for GTM + gtag when GA is loaded directly)
    trackEvent('generate_lead', {
      event_category: 'Contact',
      event_label: state.interest || 'unknown',
      value: 1,
    });

    const eventId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    // Meta Pixel conversions
    if (typeof window.fbq === 'function') {
      const content = { content_name: 'contact', content_category: state.interest || 'unknown' };
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
  }, [state.interest, state.language, currentLanguage]);


  // Confetti effect
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

  const { data: teamMembers } = useQuery({
    queryKey: ['teamMembers', currentLanguage],
    queryFn: () => getAllTeamMembers(currentLanguage),
  });
  const displayMembers = (teamMembers || []).slice(0, 5);

  return (
    <>
      <Helmet>
        <title>{t('form.thankYouTitle', 'Thank you!')} | Advisable</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-24">
        <div className="text-center animate-fade-in max-w-xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t('form.thankYouTitle', 'Thank you!')}
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            {t('form.thankYouMessage', 'We have received your message and will get back to you shortly.')}
          </p>

          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {displayMembers.map((member: TeamMember, index: number) => (
                  <div
                    key={member.id}
                    className="w-12 h-12 rounded-full border-2 border-background overflow-hidden bg-secondary shadow-md transition-transform hover:scale-110 hover:z-10"
                    style={{ zIndex: displayMembers.length - index }}
                  >
                    {member.image_url ? (
                      <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium bg-gradient-to-br from-primary/20 to-primary/40">
                        {member.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Link
                to={buildNavigationUrl('/advisable-team', currentLanguage)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
              >
                {t('form.viewTeam', 'View Team')}
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('form.teamReviewMessage', 'Our team will review your request and get back to you soon.')}
            </p>
          </div>

          <Button asChild variant="outline" className="rounded-full px-6">
            <Link to={buildNavigationUrl('/', currentLanguage)}>
              <Home className="w-4 h-4 mr-2" />
              {t('form.backHome', 'Back to home')}
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
};

export default ThankYouContact;
