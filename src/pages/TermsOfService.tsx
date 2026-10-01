
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import SEOWrapper from "@/components/SEO/SEOWrapper";

const TermsOfService = () => {
  const { t } = useTranslation('termsofservice');

  return (
    <SEOWrapper
      title="Terms of Service - Advisable"
      description="Terms of service and conditions for using Advisable services and digital platforms."
      keywords="terms of service, terms and conditions, service agreement"
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

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. {t('sections.definitions.title')}</h2>
          <p>
            {t('sections.definitions.service')}<br />
            {t('sections.definitions.terms')}<br />
            {t('sections.definitions.you')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. {t('sections.useOfService.title')}</h2>
          <p>
            {t('sections.useOfService.agreement')}
          </p>
          <p>
            {t('sections.useOfService.prohibitionsIntro')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('sections.useOfService.prohibitions.violateLaw')}</li>
            <li>{t('sections.useOfService.prohibitions.restrictOthers')}</li>
            <li>{t('sections.useOfService.prohibitions.harmMinors')}</li>
            <li>{t('sections.useOfService.prohibitions.unauthorizedAccess')}</li>
            <li>{t('sections.useOfService.prohibitions.denialOfService')}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. {t('sections.intellectualProperty.title')}</h2>
          <p>
            {t('sections.intellectualProperty.content')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. {t('sections.userContent.title')}</h2>
          <p>
            {t('sections.userContent.responsibility')}
          </p>
          <p>
            {t('sections.userContent.rights')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. {t('sections.links.title')}</h2>
          <p>
            {t('sections.links.content')}
          </p>
          <p>
            {t('sections.links.disclaimer')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. {t('sections.termination.title')}</h2>
          <p>
            {t('sections.termination.content')}
          </p>
          <p>
            {t('sections.termination.survival')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. {t('sections.liability.title')}</h2>
          <p>
            {t('sections.liability.content')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. {t('sections.disclaimer.title')}</h2>
          <p>
            {t('sections.disclaimer.content')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. {t('sections.governingLaw.title')}</h2>
          <p>
            {t('sections.governingLaw.content')}
          </p>
          <p>
            {t('sections.governingLaw.additional')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. {t('sections.changes.title')}</h2>
          <p>
            {t('sections.changes.content')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">12. {t('sections.ventureSubmissions.title')}</h2>
          <p>
            {t('sections.ventureSubmissions.p1')}
          </p>
          <p>
            {t('sections.ventureSubmissions.p2')}
          </p>
          <p>
            {t('sections.ventureSubmissions.p3')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">13. {t('sections.contact.title')}</h2>
          <p className="mb-8">
            {t('sections.contact.content')}
          </p>
        </div>
      </main>
      
      <Footer />
      </div>
    </SEOWrapper>
  );
};

export default TermsOfService;
