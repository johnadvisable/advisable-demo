import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Send, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { getServicesByCategorySlug, Service } from '@/services/serviceService';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import { trackEvent } from '@/lib/analyticsTracking';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

const fieldClass =
  'bg-white/5 border border-white/15 text-white placeholder:text-white/40 rounded-[10px] focus:border-white/40 focus:ring-0';

interface CyberFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  selectedServices: string[];
}

const initialFormData: CyberFormData = {
  name: '',
  email: '',
  company: '',
  phone: '',
  message: '',
  selectedServices: [],
};

/** Cybersecurity-only contact form (dark theme, cybersecurity services dropdown). */
const CyberContactForm = () => {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CyberFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);

  const { data: servicesData, isLoading: loadingServices } = useQuery({
    queryKey: ['services', 'cyber-security', currentLanguage],
    queryFn: () => getServicesByCategorySlug('cyber-security', currentLanguage),
  });
  const services: Service[] = servicesData || [];

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
  }, []);

  useEffect(() => {
    if (!turnstileLoaded || !turnstileRef.current || !window.turnstile) return;
    if (turnstileWidgetId.current) return;

    turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token: string) => setTurnstileToken(token),
      'expired-callback': () => setTurnstileToken(null),
      'error-callback': () => setTurnstileToken(null),
      theme: 'dark',
      size: 'normal',
    });

    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, [turnstileLoaded]);

  const resetTurnstile = useCallback(() => {
    if (turnstileWidgetId.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetId.current);
      setTurnstileToken(null);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const sanitized = value
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
    setFormData((prev) => ({ ...prev, [name]: sanitized }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const addService = (title: string) => {
    setFormData((prev) =>
      prev.selectedServices.includes(title)
        ? prev
        : { ...prev, selectedServices: [...prev.selectedServices, title] }
    );
  };

  const removeService = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.filter((s) => s !== title),
    }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.name.trim()) next.name = 'Name is required';
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = 'Invalid email format';
    if (!formData.message.trim()) next.message = 'Message is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    if (!validate()) {
      toast.error('Please fix the errors above');
      return;
    }
    if (!turnstileToken && turnstileLoaded && window.turnstile) {
      toast.error('Please complete the security verification');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          ...formData,
          interest: 'cyber-security',
          selectedProduct: '',
          currentPage: window.location.href,
          language: currentLanguage,
          turnstileToken: turnstileToken || '',
        },
      });

      if (error) throw new Error(error.message || 'Failed to send message');
      if (data && !data.success) throw new Error(data.error || 'Failed to send message');

      trackEvent('form_submission', {
        event_category: 'Contact',
        event_label: 'cyber-security',
        value: 1,
      });

      setFormData(initialFormData);
      setShowErrors(false);
      resetTurnstile();

      navigate(buildNavigationUrl('/thank-you-contact', currentLanguage), {
        state: {
          interest: 'cyber-security',
          email: formData.email,
          name: formData.name,
          language: currentLanguage,
        },
      });
    } catch (err) {
      console.error('Error submitting cyber contact form:', err);
      resetTurnstile();
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-8 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <Label htmlFor="cyber-name" className="text-white font-medium">Full name *</Label>
            {showErrors && errors.name && (
              <span className="text-sm text-red-400">{errors.name}</span>
            )}
          </div>
          <Input
            id="cyber-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            maxLength={100}
            className={fieldClass}
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <Label htmlFor="cyber-email" className="text-white font-medium">Email *</Label>
            {showErrors && errors.email && (
              <span className="text-sm text-red-400">{errors.email}</span>
            )}
          </div>
          <Input
            id="cyber-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            maxLength={254}
            className={fieldClass}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="cyber-company" className="text-white font-medium">Company</Label>
          <Input
            id="cyber-company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Your company"
            maxLength={150}
            className={fieldClass}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="cyber-phone" className="text-white font-medium">Phone</Label>
          <Input
            id="cyber-phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+30 21X XXX XXXX"
            maxLength={20}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white font-medium">Cybersecurity services</Label>
        {formData.selectedServices.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.selectedServices.map((service) => (
              <span
                key={service}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white"
              >
                {service}
                <button
                  type="button"
                  aria-label={`Remove ${service}`}
                  onClick={() => removeService(service)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
        <Select value="" onValueChange={addService}>
          <SelectTrigger className={fieldClass}>
            <SelectValue
              placeholder={loadingServices ? 'Loading services...' : 'Select the services you are interested in'}
            />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0a] border border-white/15 text-white rounded-xl max-h-72">
            {services
              .filter((s) => !formData.selectedServices.includes(s.title))
              .map((service) => (
                <SelectItem
                  key={service.id}
                  value={service.title}
                  className="text-white focus:bg-white/10 focus:text-white"
                >
                  {service.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label htmlFor="cyber-message" className="text-white font-medium">Message *</Label>
          {showErrors && errors.message && (
            <span className="text-sm text-red-400">{errors.message}</span>
          )}
        </div>
        <Textarea
          id="cyber-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          maxLength={500}
          placeholder="Tell us about your security needs"
          className={`${fieldClass} resize-none`}
        />
        <div className="text-xs text-white/50 text-right">
          {formData.message.length}/500
        </div>
      </div>

      <div className="flex justify-center py-2">
        <div ref={turnstileRef} />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full py-6 text-lg font-medium bg-white text-black hover:bg-white/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Send Message
          </>
        )}
      </Button>

      <p className="text-sm text-white/50 text-center">
        By submitting this form, you agree to our privacy policy.
      </p>
    </form>
  );
};

export default CyberContactForm;
