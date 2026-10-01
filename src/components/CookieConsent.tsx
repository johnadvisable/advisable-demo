import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation('shared');
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    // Check if user already gave consent
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateGTMConsent = (granted: boolean) => {
    if (typeof window.gtag === 'function') {
      if (granted) {
        window.gtag('consent', 'update', {
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted',
          'analytics_storage': 'granted',
          'functionality_storage': 'granted',
          'personalization_storage': 'granted'
        });
      }
      // If denied, we don't need to update as default is already denied
    }
  };

  const handleAcceptAll = () => {
    localStorage.setItem('cookie_consent', 'granted');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    updateGTMConsent(true);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookie_consent', 'denied');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    updateGTMConsent(false);
    setIsVisible(false);
  };

  const getCookiePolicyPath = () => {
    let langCode = 'en';
    if (typeof currentLanguage === 'string') {
      langCode = currentLanguage;
    } else if (currentLanguage && typeof currentLanguage === 'object' && 'code' in currentLanguage) {
      langCode = (currentLanguage as { code: string }).code;
    }
    const langPrefix = langCode && langCode !== 'en' ? `/${langCode}` : '';
    return `${langPrefix}/cookie-policy`;
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in-up"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="max-w-4xl mx-auto bg-background/95 backdrop-blur-lg border border-border rounded-xl shadow-2xl p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
            <Cookie className="w-6 h-6 text-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 
              id="cookie-consent-title" 
              className="text-lg font-semibold text-foreground mb-2"
            >
              {t('cookieConsent.title', 'We use cookies')}
            </h3>
            <p 
              id="cookie-consent-description" 
              className="text-sm text-muted-foreground mb-4"
            >
              {t('cookieConsent.description', 'We use cookies to improve your experience, analyze site traffic, and for advertising purposes.')}{' '}
              <Link 
                to={getCookiePolicyPath()} 
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                {t('cookieConsent.learnMore', 'Learn more')}
              </Link>
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="order-2 sm:order-1"
              >
                {t('cookieConsent.rejectAll', 'Reject All')}
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="order-1 sm:order-2 bg-black hover:bg-black/90 text-white"
              >
                {t('cookieConsent.acceptAll', 'Accept All')}
              </Button>
            </div>
          </div>

          {/* Close button - acts as reject */}
          <button
            onClick={handleRejectAll}
            className="shrink-0 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label={t('cookieConsent.rejectAll', 'Reject All')}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
