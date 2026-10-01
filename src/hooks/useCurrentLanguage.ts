import { useTranslation } from 'react-i18next';

// Domain to language mapping (same as in i18n.ts)
const DOMAIN_LANGUAGE_MAP: Record<string, string> = {
  'gr': 'el',
  'es': 'es',
  'fr': 'fr',
  'it': 'it',
  'de': 'de',
  'com': 'en'
};

/**
 * Get language from domain TLD (synchronous, for immediate use)
 */
function getLanguageFromDomain(): string | null {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  
  // Skip on localhost or lovable preview domains
  if (hostname === 'localhost' || hostname.includes('lovable')) {
    return null;
  }
  
  const parts = hostname.split('.');
  const tld = parts[parts.length - 1];
  return DOMAIN_LANGUAGE_MAP[tld] || null;
}

/**
 * Custom hook to get the current language
 * Priority: 1. Domain TLD (production) 2. i18n language (development/fallback)
 */
export const useCurrentLanguage = (): string => {
  const { i18n } = useTranslation();
  
  // In production, domain determines language
  const domainLanguage = getLanguageFromDomain();
  if (domainLanguage) {
    return domainLanguage;
  }
  
  // Fallback to i18n language
  return i18n.language || 'en';
};
