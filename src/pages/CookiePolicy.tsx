
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import SEOWrapper from "@/components/SEO/SEOWrapper";

const CookiePolicy = () => {
  const { t } = useTranslation('cookiepolicy');

  return (
    <SEOWrapper
      title="Cookie Policy - Advisable"
      description="Information about how Advisable uses cookies and similar technologies on our website."
      keywords="cookie policy, cookies, website tracking, privacy"
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

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. {t('sections.whatAreCookies.title')}</h2>
          <p>
            {t('sections.whatAreCookies.definition')}
          </p>
          <p>
            {t('sections.whatAreCookies.firstParty')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. {t('sections.whyUseCookies.title')}</h2>
          <p>
            {t('sections.whyUseCookies.content')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. {t('sections.cookieTypes.title')}</h2>
          <p>
            {t('sections.cookieTypes.introduction')}
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">{t('sections.cookieTypes.essential.title')}</h3>
          <p>
            {t('sections.cookieTypes.essential.content')}
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">{t('sections.cookieTypes.performance.title')}</h3>
          <p>
            {t('sections.cookieTypes.performance.content')}
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">{t('sections.cookieTypes.analytics.title')}</h3>
          <p>
            {t('sections.cookieTypes.analytics.content')}
          </p>
          <p>
            {t('sections.cookieTypes.analytics.servicesIntro')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>{t('sections.cookieTypes.analytics.services.googleAnalytics.title')}:</strong> {t('sections.cookieTypes.analytics.services.googleAnalytics.content')}
            </li>
            <li>
              <strong>{t('sections.cookieTypes.analytics.services.googleTagManager.title')}:</strong> {t('sections.cookieTypes.analytics.services.googleTagManager.content')}
            </li>
            <li>
              <strong>{t('sections.cookieTypes.analytics.services.microsoftClarity.title')}:</strong> {t('sections.cookieTypes.analytics.services.microsoftClarity.content')}
            </li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">{t('sections.cookieTypes.advertising.title')}</h3>
          <p>
            {t('sections.cookieTypes.advertising.content')}
          </p>
          <p>
            {t('sections.cookieTypes.advertising.servicesIntro')}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>{t('sections.cookieTypes.advertising.services.googleAds.title')}:</strong> {t('sections.cookieTypes.advertising.services.googleAds.content')}
            </li>
            <li>
              <strong>{t('sections.cookieTypes.advertising.services.metaAds.title')}:</strong> {t('sections.cookieTypes.advertising.services.metaAds.content')}
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. {t('sections.controlCookies.title')}</h2>
          <p>
            {t('sections.controlCookies.rights')}
          </p>
          <p>
            {t('sections.controlCookies.browser')}
          </p>
          <p>
            {t('sections.controlCookies.advertising', {
              link1: 'http://www.aboutads.info/choices/',
              link2: 'http://www.youronlinechoices.com'
            })}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. {t('sections.changes.title')}</h2>
          <p>
            {t('sections.changes.content')}
          </p>
          <p>
            {t('sections.changes.date')}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. {t('sections.declaration.title')}</h2>
          <div className="mb-8">
            <script id="CookieDeclaration" src="https://consent.cookiebot.com/e7b9aeb9-7125-440a-b373-52d5d7c71531/cd.js" type="text/javascript" async></script>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. {t('sections.contact.title')}</h2>
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

export default CookiePolicy;
