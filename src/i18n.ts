// Temporarily simplified imports to resolve module loading issues
import * as i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Backend from 'i18next-http-backend';
import * as LanguageDetector from 'i18next-browser-languagedetector';

console.log('🌐 Initializing i18n...');

const i18n = (i18next as any).default || i18next;

// Domain to language mapping
const DOMAIN_LANGUAGE_MAP: Record<string, string> = {
  'gr': 'el',
  'es': 'es',
  'fr': 'fr',
  'it': 'it',
  'de': 'de',
  'com': 'en'
};

// Set HTML lang immediately based on domain (runs synchronously before React)
function setHtmlLangFromDomain(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  
  const hostname = window.location.hostname;
  
  // Skip on localhost or lovable preview domains
  if (hostname === 'localhost' || hostname.includes('lovable')) {
    return undefined;
  }
  
  const parts = hostname.split('.');
  const tld = parts[parts.length - 1];
  const detectedLanguage = DOMAIN_LANGUAGE_MAP[tld];
  
  if (detectedLanguage) {
    // Set HTML lang attribute immediately
    document.documentElement.lang = detectedLanguage;
    console.log(`🌐 HTML lang set to: ${detectedLanguage} (domain: ${hostname})`);
  }
  
  return detectedLanguage;
}

// Run immediately on script load
const domainLanguage = setHtmlLangFromDomain();

// Custom domain-based language detector for i18next
const domainLanguageDetector = {
  name: 'domainDetector',
  lookup(): string | undefined {
    if (domainLanguage) {
      // Update localStorage to match domain language
      try {
        localStorage.setItem('i18nextLng', domainLanguage);
      } catch (e) {
        // Ignore localStorage errors
      }
      return domainLanguage;
    }
    return undefined;
  },
  cacheUserLanguage(): void {
    // No-op - domain is the source of truth in production
  }
};

// Create a custom language detector that includes our domain detector
const languageDetectorModule = (LanguageDetector as any).default || LanguageDetector;
const customLanguageDetector = new languageDetectorModule();
customLanguageDetector.addDetector(domainLanguageDetector);

i18n
  // Load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  .use((Backend as any).default || Backend)
  // Detect user language with custom detector
  .use(customLanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    fallbackLng: 'en',
    debug: false, // Set to true for development debugging

    interpolation: {
      escapeValue: false, // Not needed for react as it escapes by default
    },

    // Backend configuration for loading translations
    backend: {
      loadPath: function(lng: string, ns: string) {
        // Admin namespace is in the root admin folder
        if (ns === 'admin') {
          return `/locales/admin/${lng}.json`;
        }
        // Front namespaces (shared, index, contact) are in front/namespace folders
        return `/locales/front/${ns}/${lng}.json`;
      },
    },

    // Language detection configuration - domain detector runs first
    detection: {
      order: ['domainDetector', 'localStorage', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    // Default namespace - OPTIMIZED: Only load critical namespaces initially
    // Other namespaces will be lazy-loaded when needed
    defaultNS: 'shared',
    ns: ['shared', 'index'],
    
    // Enable partial bundled languages for lazy loading
    partialBundledLanguages: true,
    
    // Load namespace on demand
    load: 'currentOnly',
  })
  .then(() => {
    console.log('✅ i18n initialized successfully');
    // Set initial HTML lang attribute
    document.documentElement.lang = i18n.language || 'en';
  })
  .catch((error: any) => {
    console.error('❌ i18n initialization failed:', error);
  });

// Listen for language changes and update HTML lang attribute
i18n.on('languageChanged', (lng: string) => {
  document.documentElement.lang = lng;
  console.log(`🌐 HTML lang updated to: ${lng}`);
});

export default i18n;
