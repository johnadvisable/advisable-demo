import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Send, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import SecureContactFormFields from './SecureContactFormFields';
import { useQuery } from '@tanstack/react-query';
import { getServicesByCategorySlug, Service } from '@/services/serviceService';
import { getAllTeamMembers, TeamMember } from '@/services/teamMemberService';
import { Link, useNavigate } from 'react-router-dom';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import confetti from 'canvas-confetti';
import { trackEvent } from '@/lib/analyticsTracking';

// Turnstile Site Key from environment - this is a public key
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  interest: string;
  selectedProduct: string;
  message: string;
  selectedServices: string[];
}

const initialFormData: FormData = {
  name: '',
  email: '',
  company: '',
  phone: '',
  interest: '',
  selectedProduct: '',
  message: '',
  selectedServices: [],
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
        size?: 'normal' | 'compact';
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const BuiltInContactForm = () => {
  const { t } = useTranslation('contact');
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);

  // Prefill from a WebMCP agent draft (agent prepares, human reviews and submits)
  useEffect(() => {
    const applyDraft = (draft: any) => {
      if (!draft || typeof draft !== 'object') return;
      setFormData((prev) => ({
        ...prev,
        name: draft.name || prev.name,
        email: draft.email || prev.email,
        company: draft.company || prev.company,
        phone: draft.phone || prev.phone,
        interest: draft.interest || prev.interest,
        message: draft.message || prev.message,
      }));
    };

    try {
      const stored = sessionStorage.getItem('advisable:contact-draft');
      if (stored) {
        applyDraft(JSON.parse(stored));
        sessionStorage.removeItem('advisable:contact-draft');
      }
    } catch {
      /* ignore malformed drafts */
    }

    const handler = (event: Event) => applyDraft((event as CustomEvent).detail);
    window.addEventListener('advisable:contact-draft', handler);
    return () => window.removeEventListener('advisable:contact-draft', handler);
  }, []);


  // Load Turnstile script
  useEffect(() => {
    if (document.querySelector('script[src*="turnstile"]')) {
      setTurnstileLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => setTurnstileLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Don't remove script on unmount as it might be used elsewhere
    };
  }, []);

  // Render Turnstile widget
  useEffect(() => {
    if (!turnstileLoaded || !turnstileRef.current || !window.turnstile) return;
    if (turnstileWidgetId.current) return; // Already rendered

    turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token: string) => {
        setTurnstileToken(token);
      },
      'expired-callback': () => {
        setTurnstileToken(null);
      },
      'error-callback': () => {
        setTurnstileToken(null);
        console.error('Turnstile error');
      },
      theme: 'light',
      size: 'normal',
    });

    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, [turnstileLoaded]);

  // Reset Turnstile on successful submission
  const resetTurnstile = useCallback(() => {
    if (turnstileWidgetId.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetId.current);
      setTurnstileToken(null);
    }
  }, []);

  // Fetch services for the selector - digital-agency
  const { data: servicesData, isLoading: loadingServices } = useQuery({
    queryKey: ['services', 'digital-agency', currentLanguage],
    queryFn: () => getServicesByCategorySlug('digital-agency', currentLanguage),
  });

  const services: Service[] = servicesData || [];



  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('form.errors.nameRequired', 'Name is required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('form.errors.emailRequired', 'Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('form.errors.emailInvalid', 'Invalid email format');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('form.errors.messageRequired', 'Message is required');
    }

    if (!formData.interest) {
      newErrors.interest = t('form.errors.interestRequired', 'Please select an interest');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if all required fields are filled
  const isFormComplete = formData.name.trim() && 
    formData.email.trim() && 
    formData.message.trim() && 
    formData.interest;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      interest: value,
      // Reset selectedProduct when changing interest
      selectedProduct: value !== 'products' ? '' : prev.selectedProduct
    }));
    if (errors.interest) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated.interest;
        return updated;
      });
    }
  };

  const handleProductChange = (value: string) => {
    setFormData(prev => ({ ...prev, selectedProduct: value }));
    if (errors.selectedProduct) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated.selectedProduct;
        return updated;
      });
    }
  };

  const handleServiceSelect = (serviceTitle: string) => {
    if (!formData.selectedServices.includes(serviceTitle)) {
      setFormData(prev => ({
        ...prev,
        selectedServices: [...prev.selectedServices, serviceTitle],
      }));
    }
  };

  const handleServiceDeselect = (serviceTitle: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.filter(s => s !== serviceTitle),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    if (!validateForm()) {
      toast.error(t('form.errors.fixErrors', 'Please fix the errors above'));
      return;
    }

    // Graceful fallback: allow submission without token if Turnstile fails to load
    const hasTurnstile = !!turnstileToken;
    if (!hasTurnstile && turnstileLoaded && window.turnstile) {
      // Turnstile loaded but no token yet - user hasn't completed it
      toast.error(t('form.errors.captchaRequired', 'Please complete the security verification'));
      return;
    }

    setIsSubmitting(true);

    try {
      const currentPage = window.location.href;
      
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          ...formData,
          currentPage,
          language: currentLanguage,
          turnstileToken: turnstileToken || '',
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to send message');
      }

      if (data && !data.success) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Track form submission (GTM dataLayer + gtag when GA is loaded directly)
      trackEvent('form_submission', {
        event_category: 'Contact',
        event_label: formData.interest,
        value: 1,
      });

      setIsSubmitted(true);
      setFormData(initialFormData);
      setShowErrors(false);
      resetTurnstile();
      toast.success(t('form.success', 'Message sent successfully!'));

      // Redirect to thank-you URL so GTM/Meta Pixel can fire conversion based on path
      const thankYouUrl = buildNavigationUrl('/thank-you-contact', currentLanguage);
      navigate(thankYouUrl, {
        state: {
          interest: formData.interest,
          email: formData.email,
          name: formData.name,
          language: currentLanguage,
        },
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      resetTurnstile();
      toast.error(t('form.errors.submitError', 'Failed to send message. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch team members for avatar display
  const { data: teamMembers } = useQuery({
    queryKey: ['teamMembers', currentLanguage],
    queryFn: () => getAllTeamMembers(currentLanguage),
  });

  // Get first 5 team members for avatar stack
  const displayMembers = (teamMembers || []).slice(0, 5);

  // Trigger confetti when form is submitted
  const triggerConfetti = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  // Trigger confetti when submitted
  useEffect(() => {
    if (isSubmitted) {
      triggerConfetti();
    }
  }, [isSubmitted, triggerConfetti]);

  if (isSubmitted) {
    return (
      <div ref={sectionRef} className="text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-3xl font-bold text-foreground mb-3">
          {t('form.thankYouTitle', 'Thank you!')}
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
          {t('form.thankYouMessage', 'We have received your message and will get back to you shortly.')}
        </p>
        
        {/* Team avatar stack */}
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
                    <img 
                      src={member.image_url} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium bg-gradient-to-br from-primary/20 to-primary/40">
                      {member.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Link 
              to="/advisable-team"
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

        <Button
          variant="outline"
          onClick={() => setIsSubmitted(false)}
          className="rounded-full px-6"
        >
          {t('form.sendAnother', 'Send another message')}
        </Button>
      </div>
    );
  }

  return (
    <div ref={sectionRef}>
      <div className={`relative rounded-2xl p-[2px] transition-all duration-500 gradient-form-shadow ${isFormComplete ? 'gradient-form-complete' : ''}`}>
        {/* Animated gradient border for complete form */}
        <div className="gradient-form-border" />
        <div className="gradient-form-glow" />
        
        <div className="relative apple-card bg-card border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <SecureContactFormFields
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              handleProductChange={handleProductChange}
              handleServiceSelect={handleServiceSelect}
              handleServiceDeselect={handleServiceDeselect}
              services={services}
              loadingServices={loadingServices}
              errors={errors}
              showErrors={showErrors}
            />

            {/* Turnstile Widget */}
            <div className="flex justify-center py-4">
              <div ref={turnstileRef} />
            </div>

            <div className="pt-4">
              <div className={`relative rounded-full p-[2px] transition-all duration-300 ${isFormComplete ? 'gradient-button-active' : ''}`}>
                <div className="gradient-button-border" />
                <div className="gradient-button-glow" />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full apple-button py-6 text-lg font-medium rounded-full border-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('form.sending', 'Sending...')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {t('form.submit', 'Send Message')}
                    </>
                  )}
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              {t('form.privacyNote', 'By submitting this form, you agree to our privacy policy.')}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuiltInContactForm;
