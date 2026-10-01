
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import SEOWrapper from "@/components/SEO/SEOWrapper";

const PrivacyPolicy = () => {
  const { t } = useTranslation('privacypolicy');

  return (
    <SEOWrapper
      title="Privacy Policy - Advisable"
      description="Our privacy policy outlines how Advisable collects, uses, and protects your personal information and data."
      keywords="privacy policy, data protection, personal information, GDPR compliance"
      type="website"
    >
      <div className="min-h-screen bg-white">
      <Header variant="light" />

      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8 text-advisable-darkPurple">{t('title')}</h1>
        
        <div className="prose max-w-none">
          <p className="mb-4">{t('lastUpdated', { date: new Date().toLocaleDateString() })}</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. {t('sections.introduction.title')}</h2>
          <p>
            {t('sections.introduction.content')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. {t('sections.dataWeCollect.title')}</h2>
          <p>
            {t('sections.dataWeCollect.content')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('sections.dataWeCollect.identityData')}</li>
            <li>{t('sections.dataWeCollect.contactData')}</li>
            <li>{t('sections.dataWeCollect.technicalData')}</li>
            <li>{t('sections.dataWeCollect.usageData')}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. {t('sections.howWeCollect.title')}</h2>
          <p>
            {t('sections.howWeCollect.content')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('sections.howWeCollect.directInteractions')}</li>
            <li>{t('sections.howWeCollect.automatedTechnologies')}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. {t('sections.analytics.title')}</h2>
          <p>
            {t('sections.analytics.content')}
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">{t('sections.analytics.googleAnalytics.title')}</h3>
          <p>
            {t('sections.analytics.googleAnalytics.content')}
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">{t('sections.analytics.googleTagManager.title')}</h3>
          <p>
            {t('sections.analytics.googleTagManager.content')}
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">{t('sections.analytics.microsoftClarity.title')}</h3>
          <p>
            {t('sections.analytics.microsoftClarity.content')}
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">{t('sections.analytics.advertising.title')}</h3>
          <p>
            {t('sections.analytics.advertising.content')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. {t('sections.howWeUse.title')}</h2>
          <p>
            {t('sections.howWeUse.content')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('sections.howWeUse.contract')}</li>
            <li>{t('sections.howWeUse.legitimateInterests')}</li>
            <li>{t('sections.howWeUse.legalObligation')}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. {t('sections.dataSecurity.title')}</h2>
          <p>
            {t('sections.dataSecurity.content')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. {t('sections.dataRetention.title')}</h2>
          <p>
            {t('sections.dataRetention.content')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. {t('sections.legalRights.title')}</h2>
          <p>
            {t('sections.legalRights.content')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('sections.legalRights.access')}</li>
            <li>{t('sections.legalRights.correction')}</li>
            <li>{t('sections.legalRights.erasure')}</li>
            <li>{t('sections.legalRights.object')}</li>
            <li>{t('sections.legalRights.restriction')}</li>
            <li>{t('sections.legalRights.transfer')}</li>
            <li>{t('sections.legalRights.withdrawConsent')}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. {t('sections.changes.title')}</h2>
          <p>
            {t('sections.changes.content')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. {t('sections.contact.title')}</h2>
          <p>
            {t('sections.contact.content')}
          </p>
          <p className="mb-8">
            {t('sections.contact.details')}
          </p>
        </div>
      </main>
      
      <Footer />
      </div>
    </SEOWrapper>
  );
};

export default PrivacyPolicy;
