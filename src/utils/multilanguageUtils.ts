// Multilingual URL utilities for domain-based language routing
import { Language } from '@/context/LanguageContext';

/**
 * Domain-Language Mapping (fallback - primary source is now database domain_config table)
 * These are kept as synchronous fallbacks for initial page load before DB data is available
 */
const DOMAIN_LANGUAGE_MAP: Record<string, string> = {
  'gr': 'el',   // .gr → Greek
  'es': 'es',   // .es → Spanish
  'fr': 'fr',   // .fr → French
  'it': 'it',   // .it → Italian
  'com': 'en',  // .com → English
};

const LANGUAGE_DOMAIN_MAP: Record<string, string> = {
  'el': 'advisable.gr',
  'es': 'advisable.es',
  'fr': 'advisable.fr',
  'it': 'advisable.it',
  'en': 'advisable.com',
};

// All supported languages
const SUPPORTED_LANGUAGES = ['en', 'el', 'es', 'fr', 'it'];

/**
 * Set domain map from database (called after fetching domain_config)
 * This updates the in-memory maps with DB values
 */
export function updateDomainMapsFromDB(configs: Array<{ language_code: string; domain: string }>): void {
  configs.forEach(config => {
    LANGUAGE_DOMAIN_MAP[config.language_code] = config.domain;
    // Extract TLD and update reverse map
    const tld = config.domain.split('.').pop();
    if (tld) {
      DOMAIN_LANGUAGE_MAP[tld] = config.language_code;
    }
  });
}

/**
 * Get current domain language configuration
 */
export function getDomainLanguageConfig(): {
  hostname: string;
  tld: string;
  defaultLang: string;
} {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'advisable.com';
  const parts = hostname.split('.');
  const tld = parts[parts.length - 1] || 'com';
  const defaultLang = DOMAIN_LANGUAGE_MAP[tld] || 'en';

  return { hostname, tld, defaultLang };
}

/**
 * Get the default language for the current domain
 */
export function getDefaultLanguageForDomain(): string {
  const { defaultLang } = getDomainLanguageConfig();
  return defaultLang;
}

/**
 * Check if a language change requires redirect to a different domain
 * Returns the full redirect URL or null if no redirect needed
 */
export function getLanguageRedirectUrl(targetLang: string, currentPath: string): string | null {
  const { tld } = getDomainLanguageConfig();
  const currentDomainLang = DOMAIN_LANGUAGE_MAP[tld] || 'en';

  // If target language matches current domain's language, no redirect needed
  if (targetLang === currentDomainLang) {
    return null;
  }

  // Get clean path (remove any existing language prefix)
  const existingLangPrefix = extractLanguageFromPath(currentPath);
  const cleanPath = existingLangPrefix
    ? removeLanguageFromPath(currentPath, existingLangPrefix)
    : currentPath;

  // Get target domain for the language
  const targetDomain = LANGUAGE_DOMAIN_MAP[targetLang];

  if (!targetDomain) {
    console.warn(`No domain mapping found for language: ${targetLang}`);
    return null;
  }

  // Build the redirect URL (without language prefix since each domain = one language)
  const pathPart = cleanPath === '/' ? '' : cleanPath;
  return `https://www.${targetDomain}${pathPart}`;
}

/**
 * Get all supported language codes
 */
export function getSupportedLanguages(): string[] {
  return SUPPORTED_LANGUAGES;
}

/**
 * Extracts language code from the current URL path
 * @param pathname - The URL pathname (e.g., '/el/blog/article' or '/de')
 * @returns Language code or null if not found
 */
export function extractLanguageFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const firstSegment = segments[0];
  // Check if first segment looks like a language code (2-3 characters)
  if (firstSegment.length >= 2 && firstSegment.length <= 3 && /^[a-z]+$/.test(firstSegment)) {
    // Only return if it's a supported language
    if (SUPPORTED_LANGUAGES.includes(firstSegment)) {
      return firstSegment;
    }
  }

  return null;
}

/**
 * Checks if a path is a language-only homepage (e.g., '/de', '/el')
 * @param pathname - The URL pathname
 * @param availableLanguages - Array of available language codes
 * @returns Boolean indicating if path is a language homepage
 */
export function isLanguageHomepage(pathname: string, availableLanguages: string[]): boolean {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length !== 1) return false;

  return availableLanguages.includes(segments[0]);
}

/**
 * Removes language prefix from path
 * @param pathname - The URL pathname
 * @param languageCode - Language code to remove
 * @returns Clean path without language prefix
 */
export function removeLanguageFromPath(pathname: string, languageCode?: string): string {
  if (!languageCode) return pathname;

  const regex = new RegExp(`^/${languageCode}(?=/|$)`);
  const cleanPath = pathname.replace(regex, '');
  return cleanPath || '/';
}

/**
 * Builds a localized URL - with domain-based routing, no prefix needed
 * @param path - The base path (e.g., '/blog/article')
 * @param _languageCode - Language code (ignored in domain-based routing)
 * @returns Clean URL path without language prefix
 */
export function buildLocalizedUrl(path: string, _languageCode?: string): string {
  // With domain-based routing, we don't need language prefixes
  // Each domain serves its own language
  const cleanPath = path.replace(/^\/[a-z]{2,3}(?=\/|$)/, '') || '/';
  return cleanPath;
}

/**
 * Generates alternate URLs for all active languages (for hreflang tags)
 * @param path - The base path without language prefix
 * @param languages - Array of active languages
 * @returns Record of language codes to full URLs
 */
export function generateAlternateUrls(path: string, languages: Language[]): Record<string, string> {
  const alternates: Record<string, string> = {};
  const cleanPath = buildLocalizedUrl(path);

  languages.filter(lang => lang.isActive).forEach(lang => {
    const domain = LANGUAGE_DOMAIN_MAP[lang.code];
    if (domain) {
      alternates[lang.code] = `https://www.${domain}${cleanPath === '/' ? '' : cleanPath}`;
    }
  });

  return alternates;
}

/**
 * Checks if a path segment is a supported language code
 * @param segment - URL segment to check
 * @param availableLanguages - Array of available language codes
 * @returns Boolean indicating if segment is a language code
 */
export function isLanguageCode(segment: string, availableLanguages: string[]): boolean {
  return availableLanguages.includes(segment) && SUPPORTED_LANGUAGES.includes(segment);
}

/**
 * Gets the clean path for routing (removes language prefix)
 * @param pathname - Current pathname
 * @param currentLanguage - Current language code
 * @returns Clean path for React Router
 */
export function getCleanPathForRouting(pathname: string, currentLanguage: string): string {
  return removeLanguageFromPath(pathname, currentLanguage);
}

/**
 * Builds navigation URL - with domain-based routing, just return clean path
 * @param path - Target path
 * @param currentLanguage - Current language code (ignored)
 * @returns Clean navigation URL
 */
export function buildNavigationUrl(path: string, currentLanguage: string): string {
  return buildLocalizedUrl(path, currentLanguage);
}

/**
 * Get the domain for a specific language
 */
export function getDomainForLanguage(languageCode: string): string {
  return LANGUAGE_DOMAIN_MAP[languageCode] || 'advisable.com';
}

/**
 * Check if we're on localhost/development
 */
export function isLocalDevelopment(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('lovableproject.com');
}
