import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import BuiltInContactForm from './contact/BuiltInContactForm';

const Contact = () => {
  const { t } = useTranslation('contact');

  return (
    <section id="contact" className="apple-section bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="apple-section-title text-foreground">{t('title')}</h2>
          <p className="apple-section-subtitle">
            {t('subtitle')}
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto">
          <div>
            <BuiltInContactForm />
          </div>
        </div>

        {/* Email Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Mail className="h-5 w-5" />
            <span>{t('emailText')}</span>
            <a
              href="mailto:welcome@advisable.com"
              className="text-primary font-medium hover:underline transition-colors"
            >
              welcome@advisable.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
