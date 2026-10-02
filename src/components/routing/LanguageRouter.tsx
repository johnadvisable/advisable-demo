// Language-aware router component with lazy loading for performance
import React, { useEffect, Suspense, useRef } from 'react';
import { useLocation, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollToTop from '@/components/ScrollToTop';
import {
  extractLanguageFromPath,
  isLanguageCode,
  getDomainLanguageConfig,
  isLocalDevelopment,
  removeLanguageFromPath
} from '@/utils/multilanguageUtils';

// The repo only ships the two seminar pages
const AcademyClaude = React.lazy(() => import('@/pages/AcademyClaude'));
const AcademyClaudeV2 = React.lazy(() => import('@/pages/AcademyClaudeV2'));

// Every other URL (old site pages, nav links, invalid language prefixes) lands on the seminar
const SEMINAR_PATH = '/academy/seminar/claude';

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

  if (lang && !VALID_LANGUAGES.includes(lang)) {
    return <Navigate to={SEMINAR_PATH} replace />;
  }

  return <>{children}</>;
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

  useEffect(() => {
    const pathname = location.pathname;

    // Skip if we've already processed this path
    if (lastProcessedPath.current === pathname) return;

    const { defaultLang } = getDomainLanguageConfig();
    const detectedLanguage = extractLanguageFromPath(pathname);
    const availableLanguageCodes = languages.map(lang => lang.code);

    if (isLocalDevelopment()) {
      // Development mode: support URL prefixes for testing
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
  }, [location.pathname, i18n.language, languages, i18n]);

  const availableLanguageCodes = languages.map(lang => lang.code);

  // In production, redirect old language-prefixed URLs to clean paths
  if (!isLocalDevelopment()) {
    const langPrefix = extractLanguageFromPath(location.pathname);
    if (langPrefix && isLanguageCode(langPrefix, availableLanguageCodes)) {
      const cleanPath = removeLanguageFromPath(location.pathname, langPrefix);
      return <Navigate to={cleanPath} replace />;
    }
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ScrollToTop />
      <Routes>
        <Route path="/academy/claude" element={<AcademyClaude />} />
        <Route path="/academy/claude-v2" element={<AcademyClaudeV2 />} />
        {/* Static segment outranks :slug, so this wins over the original seminar route */}
        <Route path="/academy/seminar/claude-v2" element={<AcademyClaudeV2 />} />
        <Route path="/academy/seminar/:slug" element={<AcademyClaude />} />
        <Route path="/:lang/academy/claude" element={<ValidatedLanguageRoute><AcademyClaude /></ValidatedLanguageRoute>} />
        <Route path="/:lang/academy/claude-v2" element={<ValidatedLanguageRoute><AcademyClaudeV2 /></ValidatedLanguageRoute>} />
        <Route path="/:lang/academy/seminar/claude-v2" element={<ValidatedLanguageRoute><AcademyClaudeV2 /></ValidatedLanguageRoute>} />
        <Route path="/:lang/academy/seminar/:slug" element={<ValidatedLanguageRoute><AcademyClaude /></ValidatedLanguageRoute>} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={SEMINAR_PATH} replace />} />
      </Routes>
    </Suspense>
  );
};

export default LanguageRouter;
