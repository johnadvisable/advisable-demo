import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import BuiltInContactForm from './contact/BuiltInContactForm';

const SimpleContact = () => {
  const { t } = useTranslation('contact');
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} id="contact" className="full-screen-section bg-gray-50 py-6 md:py-0">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-4xl font-bold text-advisable-darkPurple mb-4">{t('title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <BuiltInContactForm />
        </div>

        <div className="mt-8 text-center text-gray-600 border-t border-gray-100 pt-6">
          <p>
            {t('emailText')}{" "}
            <a
              href="mailto:welcome@advisable.com"
              className="text-advisable-purple font-medium hover:underline transition-colors"
            >
              welcome@advisable.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SimpleContact;