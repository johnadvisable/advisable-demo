// Language-aware router component with lazy loading for performance
import React, { useEffect, Suspense, useRef } from 'react';
import { useLocation, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollToTop from '@/components/ScrollToTop';
import {
  extractLanguageFromPath,
  isLanguageCode,
  isLanguageHomepage,
  getDomainLanguageConfig,
  isLocalDevelopment,
  removeLanguageFromPath
} from '@/utils/multilanguageUtils';

// Lazy load all page components for better performance
const Index = React.lazy(() => import('@/pages/Index'));
const Blog = React.lazy(() => import('@/pages/InsightsHub'));
const BlogPost = React.lazy(() => import('@/pages/BlogPost'));
const Insights = React.lazy(() => import('@/pages/InsightsHub'));
const InsightsItem = React.lazy(() => import('@/pages/InsightsItem'));
const News = React.lazy(() => import('@/pages/InsightsHub'));
const NewsItem = React.lazy(() => import('@/pages/NewsItem'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const PrivacyPolicy = React.lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('@/pages/TermsOfService'));
const CookiePolicy = React.lazy(() => import('@/pages/CookiePolicy'));
const Partners = React.lazy(() => import('@/pages/Partners'));
const PartnerDetail = React.lazy(() => import('@/pages/PartnerDetail'));
const OurClients = React.lazy(() => import('@/pages/OurClients'));
const ClientDetail = React.lazy(() => import('@/pages/ClientDetail'));
const ContactPage = React.lazy(() => import('@/pages/ContactPage'));
const LetsBuildTogether = React.lazy(() => import('@/pages/LetsBuildTogether'));
const ServiceCategory = React.lazy(() => import('@/pages/ServiceCategory'));
const ServiceDetail = React.lazy(() => import('@/pages/ServiceDetail'));
const Products = React.lazy(() => import('@/pages/Products'));
const ProductDetail = React.lazy(() => import('@/pages/ProductDetail'));
const MarketDataProduct = React.lazy(() => import('@/pages/products/MarketDataProduct'));
const AboutCompany = React.lazy(() => import('@/pages/AboutCompany'));
const AdvisableTeam = React.lazy(() => import('@/pages/AdvisableTeam'));
const InvestmentsPage = React.lazy(() => import('@/pages/Investments'));
const InvestmentDetail = React.lazy(() => import('@/pages/InvestmentDetail'));
const Careers = React.lazy(() => import('@/pages/Careers'));
const CareerDetail = React.lazy(() => import('@/pages/CareerDetail'));
const SledToAdvisable = React.lazy(() => import('@/pages/SledToAdvisable'));
const AdvisableAcademy = React.lazy(() => import('@/pages/AdvisableAcademy'));
const Academy = React.lazy(() => import('@/pages/Academy'));
const AcademyVideoLessons = React.lazy(() => import('@/pages/AcademyVideoLessons'));
const AccountLogin = React.lazy(() => import('@/pages/academy/video/AccountLogin'));
const AcademyAccount = React.lazy(() => import('@/pages/academy/video/Account'));
const AcademyAdmin = React.lazy(() => import('@/pages/academy/video/AcademyAdmin'));
const ResetPassword = React.lazy(() => import('@/pages/academy/video/ResetPassword'));
const AcademyClaude = React.lazy(() => import('@/pages/AcademyClaude'));
const AcademySeminarThankYou = React.lazy(() => import('@/pages/AcademySeminarThankYou'));
const AcademyBusinessTraining = React.lazy(() => import('@/pages/AcademyBusinessTraining'));

const AdvisableAcademyCourse = React.lazy(() => import('@/pages/AdvisableAcademyCourse'));
const ThankYouContact = React.lazy(() => import('@/pages/ThankYouContact'));
const CyberContact = React.lazy(() => import('@/pages/CyberContact'));

// Loading component with better UX
const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Valid language codes for route validation
const VALID_LANGUAGES = ['en', 'el', 'fr', 'it', 'es'];

// Wrapper component that validates language parameter
const ValidatedLanguageRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useParams<{ lang: string }>();
  
  // If lang param exists but is not a valid language code, show 404
  if (lang && !VALID_LANGUAGES.includes(lang)) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    );
  }
  
  return <>{children}</>;
};

// Legacy URL: AI Web & App Development moved from Digital Agency to Technology
const LegacyAiWebAppRedirect: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const prefix = lang && VALID_LANGUAGES.includes(lang) ? `/${lang}` : '';
  return <Navigate to={`${prefix}/technology/ai-web-app-development`} replace />;
};

interface LanguageRouterProps {
  children?: React.ReactNode;
}

const LanguageRouter: React.FC<LanguageRouterProps> = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const lastProcessedPath = useRef<string>('');

  // Updated languages - removed German
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'el', name: 'Ελληνικά' },
    { code: 'fr', name: 'Français' },
    { code: 'it', name: 'Italiano' },
    { code: 'es', name: 'Español' }
  ];
  const isLoading = false;

  useEffect(() => {
    if (isLoading || languages.length === 0) return;

    const pathname = location.pathname;

    // Skip if we've already processed this path
    if (lastProcessedPath.current === pathname) return;

    const { defaultLang } = getDomainLanguageConfig();
    const detectedLanguage = extractLanguageFromPath(pathname);
    const availableLanguageCodes = languages.map(lang => lang.code);

    if (isLocalDevelopment()) {
      // Development mode: support URL prefixes for testing
      if (isLanguageHomepage(pathname, availableLanguageCodes)) {
        const langCode = pathname.substring(1);
        if (langCode !== i18n.language) {
          i18n.changeLanguage(langCode);
          lastProcessedPath.current = pathname;
        }
        return;
      }

      if (detectedLanguage && isLanguageCode(detectedLanguage, availableLanguageCodes)) {
        if (detectedLanguage !== i18n.language) {
          i18n.changeLanguage(detectedLanguage);
          lastProcessedPath.current = pathname;
        }
      }
    } else {
      // Production mode: domain determines language, no URL prefixes needed
      if (i18n.language !== defaultLang) {
        i18n.changeLanguage(defaultLang);
        lastProcessedPath.current = pathname;
      }
    }
  }, [location.pathname, i18n.language, languages, isLoading, i18n]);

  // Show loading state while language context initializes
  if (isLoading) {
    return <LoadingFallback />;
  }

  const availableLanguageCodes = languages.map(lang => lang.code);

  // In production, redirect old language-prefixed URLs to clean paths
  if (!isLocalDevelopment()) {
    const langPrefix = extractLanguageFromPath(location.pathname);
    if (langPrefix && isLanguageCode(langPrefix, availableLanguageCodes)) {
      const cleanPath = removeLanguageFromPath(location.pathname, langPrefix);
      return <Navigate to={cleanPath} replace />;
    }
  }

  // Check if current path is a language homepage (for development)
  if (isLocalDevelopment() && isLanguageHomepage(location.pathname, availableLanguageCodes)) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Index />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ScrollToTop />
      <Routes>
        {/* Main routes without language prefix (production) */}
        <Route path="/" element={<Index />} />

        {/* Service category routes - explicit slugs (avoid conflicts with /:lang) */}
        <Route path="/digital-agency" element={<ServiceCategory categorySlugOverride="digital-agency" />} />
        <Route path="/venture-studio" element={<ServiceCategory categorySlugOverride="venture-studio" />} />
        <Route path="/adobe-experience-manager-agency" element={<ServiceCategory categorySlugOverride="adobe-experience-manager-agency" />} />
        <Route path="/digital-agency/ai-web-app-development" element={<Navigate to="/technology/ai-web-app-development" replace />} />
        <Route path="/digital-agency/:serviceSlug" element={<ServiceDetail categorySlugOverride="digital-agency" />} />
        <Route path="/venture-studio/:serviceSlug" element={<ServiceDetail categorySlugOverride="venture-studio" />} />
        <Route path="/adobe-experience-manager-agency/:serviceSlug" element={<ServiceDetail categorySlugOverride="adobe-experience-manager-agency" />} />
        <Route path="/technology" element={<ServiceCategory categorySlugOverride="technology" />} />
        <Route path="/technology/:serviceSlug" element={<ServiceDetail categorySlugOverride="technology" />} />
        <Route path="/cyber-security" element={<ServiceCategory categorySlugOverride="cyber-security" />} />
        <Route path="/cyber-security/contact" element={<CyberContact />} />
        <Route path="/cyber-security/:serviceSlug" element={<ServiceDetail categorySlugOverride="cyber-security" />} />

        {/* Language-prefixed routes (for development/testing) */}
        <Route path="/:lang" element={<ValidatedLanguageRoute><Index /></ValidatedLanguageRoute>} />

        {/* Product routes */}
        <Route path="/products" element={<Products />} />
        <Route path="/:lang/products" element={<ValidatedLanguageRoute><Products /></ValidatedLanguageRoute>} />
        <Route path="/product/sizethemarket" element={<MarketDataProduct />} />
        <Route path="/:lang/product/sizethemarket" element={<ValidatedLanguageRoute><MarketDataProduct /></ValidatedLanguageRoute>} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/:lang/product/:slug" element={<ValidatedLanguageRoute><ProductDetail /></ValidatedLanguageRoute>} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/:lang/products/:slug" element={<ValidatedLanguageRoute><ProductDetail /></ValidatedLanguageRoute>} />

        {/* Investment routes */}
        <Route path="/investments" element={<InvestmentsPage />} />
        <Route path="/:lang/investments" element={<ValidatedLanguageRoute><InvestmentsPage /></ValidatedLanguageRoute>} />
        <Route path="/investments/:slug" element={<InvestmentDetail />} />
        <Route path="/:lang/investments/:slug" element={<ValidatedLanguageRoute><InvestmentDetail /></ValidatedLanguageRoute>} />

        {/* Blog routes */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/:lang/blog" element={<ValidatedLanguageRoute><Blog /></ValidatedLanguageRoute>} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/:lang/blog/:slug" element={<ValidatedLanguageRoute><BlogPost /></ValidatedLanguageRoute>} />

        {/* Insights routes */}
        <Route path="/insights" element={<Insights />} />
        <Route path="/:lang/insights" element={<ValidatedLanguageRoute><Insights /></ValidatedLanguageRoute>} />
        <Route path="/insights/:slug" element={<InsightsItem />} />
        <Route path="/:lang/insights/:slug" element={<ValidatedLanguageRoute><InsightsItem /></ValidatedLanguageRoute>} />

        {/* News routes */}
        <Route path="/news" element={<News />} />
        <Route path="/:lang/news" element={<ValidatedLanguageRoute><News /></ValidatedLanguageRoute>} />
        <Route path="/news/:slug" element={<NewsItem />} />
        <Route path="/:lang/news/:slug" element={<ValidatedLanguageRoute><NewsItem /></ValidatedLanguageRoute>} />

        {/* Partner routes */}
        <Route path="/partners-and-integrations" element={<Partners />} />
        <Route path="/:lang/partners-and-integrations" element={<ValidatedLanguageRoute><Partners /></ValidatedLanguageRoute>} />
        <Route path="/partners-and-integrations/:id" element={<PartnerDetail />} />
        <Route path="/:lang/partners-and-integrations/:id" element={<ValidatedLanguageRoute><PartnerDetail /></ValidatedLanguageRoute>} />

        {/* Client routes */}
        <Route path="/our-clients" element={<OurClients />} />
        <Route path="/:lang/our-clients" element={<ValidatedLanguageRoute><OurClients /></ValidatedLanguageRoute>} />
        <Route path="/our-clients/:slug" element={<ClientDetail />} />
        <Route path="/:lang/our-clients/:slug" element={<ValidatedLanguageRoute><ClientDetail /></ValidatedLanguageRoute>} />

        {/* Static pages */}
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/:lang/contact" element={<ValidatedLanguageRoute><ContactPage /></ValidatedLanguageRoute>} />
        <Route path="/lets-build-together" element={<LetsBuildTogether />} />
        <Route path="/:lang/lets-build-together" element={<ValidatedLanguageRoute><LetsBuildTogether /></ValidatedLanguageRoute>} />
        <Route path="/thank-you-contact" element={<ThankYouContact />} />
        <Route path="/:lang/thank-you-contact" element={<ValidatedLanguageRoute><ThankYouContact /></ValidatedLanguageRoute>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/:lang/privacy-policy" element={<ValidatedLanguageRoute><PrivacyPolicy /></ValidatedLanguageRoute>} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/:lang/terms-of-service" element={<ValidatedLanguageRoute><TermsOfService /></ValidatedLanguageRoute>} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/:lang/cookie-policy" element={<ValidatedLanguageRoute><CookiePolicy /></ValidatedLanguageRoute>} />
        <Route path="/about-company" element={<AboutCompany />} />
        <Route path="/:lang/about-company" element={<ValidatedLanguageRoute><AboutCompany /></ValidatedLanguageRoute>} />
        <Route path="/advisable-team" element={<AdvisableTeam />} />
        <Route path="/:lang/advisable-team" element={<ValidatedLanguageRoute><AdvisableTeam /></ValidatedLanguageRoute>} />

        {/* Language-prefixed service routes (dev only, but keep working) */}
        <Route path="/:lang/digital-agency" element={<ValidatedLanguageRoute><ServiceCategory categorySlugOverride="digital-agency" /></ValidatedLanguageRoute>} />
        <Route path="/:lang/venture-studio" element={<ValidatedLanguageRoute><ServiceCategory categorySlugOverride="venture-studio" /></ValidatedLanguageRoute>} />
        <Route path="/:lang/adobe-experience-manager-agency" element={<ValidatedLanguageRoute><ServiceCategory categorySlugOverride="adobe-experience-manager-agency" /></ValidatedLanguageRoute>} />
        <Route path="/:lang/digital-agency/ai-web-app-development" element={<LegacyAiWebAppRedirect />} />
        <Route path="/:lang/digital-agency/:serviceSlug" element={<ValidatedLanguageRoute><ServiceDetail categorySlugOverride="digital-agency" /></ValidatedLanguageRoute>} />
        <Route path="/:lang/venture-studio/:serviceSlug" element={<ValidatedLanguageRoute><ServiceDetail categorySlugOverride="venture-studio" /></ValidatedLanguageRoute>} />
        <Route path="/:lang/adobe-experience-manager-agency/:serviceSlug" element={<ValidatedLanguageRoute><ServiceDetail categorySlugOverride="adobe-experience-manager-agency" /></ValidatedLanguageRoute>} />
        <Route path="/:lang/technology" element={<ValidatedLanguageRoute><ServiceCategory categorySlugOverride="technology" /></ValidatedLanguageRoute>} />
        <Route path="/:lang/technology/:serviceSlug" element={<ValidatedLanguageRoute><ServiceDetail categorySlugOverride="technology" /></ValidatedLanguageRoute>} />
        <Route path="/:lang/cyber-security" element={<ValidatedLanguageRoute><ServiceCategory categorySlugOverride="cyber-security" /></ValidatedLanguageRoute>} />
        <Route path="/:lang/cyber-security/contact" element={<ValidatedLanguageRoute><CyberContact /></ValidatedLanguageRoute>} />
        <Route path="/:lang/cyber-security/:serviceSlug" element={<ValidatedLanguageRoute><ServiceDetail categorySlugOverride="cyber-security" /></ValidatedLanguageRoute>} />

        {/* Career routes */}
        <Route path="/careers" element={<Careers />} />
        <Route path="/:lang/careers" element={<ValidatedLanguageRoute><Careers /></ValidatedLanguageRoute>} />
        <Route path="/careers/:slug" element={<CareerDetail />} />
        <Route path="/:lang/careers/:slug" element={<ValidatedLanguageRoute><CareerDetail /></ValidatedLanguageRoute>} />

        {/* Promo pages */}
        <Route path="/sled-to-advisable" element={<SledToAdvisable />} />
        <Route path="/:lang/sled-to-advisable" element={<ValidatedLanguageRoute><SledToAdvisable /></ValidatedLanguageRoute>} />

        {/* Hidden Courses page - secret URL, not linked anywhere */}
        <Route path="/advisable-academy" element={<AdvisableAcademy />} />
        <Route path="/advisable-academy/:slug" element={<AdvisableAcademyCourse />} />

        {/* Academy landing page */}
        <Route path="/academy" element={<Academy />} />
        <Route path="/:lang/academy" element={<ValidatedLanguageRoute><Academy /></ValidatedLanguageRoute>} />
        <Route path="/academy/video-lessons" element={<AcademyVideoLessons />} />
        <Route path="/:lang/academy/video-lessons" element={<ValidatedLanguageRoute><AcademyVideoLessons /></ValidatedLanguageRoute>} />
        <Route path="/academy/account/login" element={<AccountLogin />} />
        <Route path="/:lang/academy/account/login" element={<ValidatedLanguageRoute><AccountLogin /></ValidatedLanguageRoute>} />
        <Route path="/academy/account" element={<AcademyAccount />} />
        <Route path="/:lang/academy/account" element={<ValidatedLanguageRoute><AcademyAccount /></ValidatedLanguageRoute>} />
        <Route path="/academy/admin" element={<AcademyAdmin />} />
        <Route path="/:lang/academy/admin" element={<ValidatedLanguageRoute><AcademyAdmin /></ValidatedLanguageRoute>} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/academy/ai-training-for-business" element={<AcademyBusinessTraining />} />
        <Route path="/:lang/academy/ai-training-for-business" element={<ValidatedLanguageRoute><AcademyBusinessTraining /></ValidatedLanguageRoute>} />

        <Route path="/academy/claude" element={<AcademyClaude />} />
        <Route path="/academy/seminar/thank-you" element={<AcademySeminarThankYou />} />
        <Route path="/:lang/academy/seminar/thank-you" element={<ValidatedLanguageRoute><AcademySeminarThankYou /></ValidatedLanguageRoute>} />
        <Route path="/academy/seminar/:slug" element={<AcademyClaude />} />
        <Route path="/:lang/academy/claude" element={<ValidatedLanguageRoute><AcademyClaude /></ValidatedLanguageRoute>} />
        <Route path="/:lang/academy/seminar/:slug" element={<ValidatedLanguageRoute><AcademyClaude /></ValidatedLanguageRoute>} />



        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default LanguageRouter;