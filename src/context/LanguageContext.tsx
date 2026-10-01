// @ts-nocheck
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { queryClient } from '@/lib/queryClient';
import {
  extractLanguageFromPath,
  isLanguageCode,
  getDomainLanguageConfig,
  isLocalDevelopment,
  getSupportedLanguages,
  getDefaultLanguageForDomain,
  updateDomainMapsFromDB
} from '@/utils/multilanguageUtils';
import { fetchDomainConfigs } from '@/services/domainService';

export type Language = {
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
};

type LanguageContextType = {
  currentLanguage: string;
  languages: Language[];
  setLanguage: (code: string) => void;
  t: (key: string, fallback: string) => string;
  isLoading: boolean;
  isLanguageReady: boolean; // New: indicates if language detection is complete
};

/**
 * Get initial language synchronously from domain/URL
 * This prevents flash of wrong language on first render
 */
function getInitialLanguage(): string {
  if (isLocalDevelopment()) {
    // Development: check URL path first, then localStorage
    const urlLanguage = extractLanguageFromPath(window.location.pathname);
    const supportedLangs = getSupportedLanguages();
    if (urlLanguage && supportedLangs.includes(urlLanguage)) {
      return urlLanguage;
    }
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage && supportedLangs.includes(storedLanguage)) {
      return storedLanguage;
    }
    return 'en';
  } else {
    // Production: synchronous domain detection
    return getDefaultLanguageForDomain();
  }
}

// Initialize with correct language immediately
const initialLanguage = getInitialLanguage();

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: initialLanguage,
  languages: [],
  setLanguage: () => {},
  t: (_, fallback) => fallback,
  isLoading: true,
  isLanguageReady: false,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  // Start with domain-detected language instead of hardcoded 'en'
  const [currentLanguage, setCurrentLanguage] = useState<string>(initialLanguage);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [languagesLoaded, setLanguagesLoaded] = useState(false);
  const [isLanguageReady, setIsLanguageReady] = useState(false);

  // First effect: Load languages and domain config, then determine initial language
  useEffect(() => {
    const initializeLanguageSystem = async () => {
      try {
        // Fetch domain configs from database and update local maps
        const domainConfigs = await fetchDomainConfigs();
        updateDomainMapsFromDB(domainConfigs);

        // Fetch languages
        const { data: languagesData, error } = await supabase
          .from('languages')
          .select('*')
          .eq('is_active', true)
          .order('is_default', { ascending: false });

        if (error) throw error;

        // Filter to only supported languages
        const supportedLangCodes = getSupportedLanguages();
        const filteredLanguages = languagesData.filter(lang =>
          supportedLangCodes.includes(lang.code)
        );

        const formattedLanguages = filteredLanguages.map(lang => ({
          code: lang.code,
          name: lang.name,
          isDefault: lang.is_default,
          isActive: lang.is_active
        }));

        setLanguages(formattedLanguages);

        const availableCodes = formattedLanguages.map(l => l.code);

        // Language selection based on domain or URL
        const { defaultLang: domainDefaultLang } = getDomainLanguageConfig();
        const urlLanguage = extractLanguageFromPath(window.location.pathname);

        let languageToUse: string;

        if (isLocalDevelopment()) {
          // In development, use URL prefix or stored preference
          if (urlLanguage && isLanguageCode(urlLanguage, availableCodes)) {
            languageToUse = urlLanguage;
          } else {
            const storedLanguage = localStorage.getItem('preferredLanguage');
            if (storedLanguage && availableCodes.includes(storedLanguage)) {
              languageToUse = storedLanguage;
            } else {
              languageToUse = 'en';
            }
          }
        } else {
          // In production, domain determines language
          languageToUse = availableCodes.includes(domainDefaultLang)
            ? domainDefaultLang
            : 'en';
        }

        setCurrentLanguage(languageToUse);
        localStorage.setItem('preferredLanguage', languageToUse);

        // Sync i18n
        if (i18n.language !== languageToUse) {
          await i18n.changeLanguage(languageToUse);
        }

        setLanguagesLoaded(true);
        setIsLanguageReady(true);
      } catch (error) {
        console.error('Error initializing language system:', error);
        setLanguagesLoaded(true);
        setIsLanguageReady(true); // Still mark as ready to prevent infinite loading
      }
    };

    initializeLanguageSystem();
  }, []);

  // Second effect: Load translations when language changes and languages are loaded
  useEffect(() => {
    if (!languagesLoaded) return;

    const fetchTranslations = async () => {
      try {
        const { data, error } = await supabase
          .from('translations')
          .select('*')
          .eq('table_name', 'ui_translations')
          .eq('language_code', currentLanguage);

        if (error) throw error;

        const translationsMap: Record<string, string> = {};
        data.forEach(item => {
          translationsMap[item.field_name] = item.content;
        });

        setTranslations(translationsMap);
      } catch (error) {
        console.error('Error fetching translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [currentLanguage, languagesLoaded]);

  // Third effect: Listen to i18n language changes and sync with context
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      console.log('[LanguageContext] i18n language changed to:', lng);
      setCurrentLanguage(lng);
      localStorage.setItem('preferredLanguage', lng);
    };

    // Set initial language from i18n if available and different
    if (i18n.language && i18n.language !== currentLanguage && languagesLoaded) {
      handleLanguageChanged(i18n.language);
    }

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, languagesLoaded]); // Remove currentLanguage from dependencies to prevent loops

  const setLanguage = (code: string) => {
    setCurrentLanguage(code);
    localStorage.setItem('preferredLanguage', code);
    
    // Comprehensive cache invalidation for language switch
    // Clear all translation-related queries
    queryClient.invalidateQueries({ queryKey: ['unified-translations'] });
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    queryClient.invalidateQueries({ queryKey: ['newsArticles'] });
    queryClient.invalidateQueries({ queryKey: ['newsMedia'] });
    queryClient.invalidateQueries({ queryKey: ['allNewsItems'] });
    queryClient.invalidateQueries({ queryKey: ['homeFeaturedPartners'] });
    queryClient.invalidateQueries({ queryKey: ['credentials'] });
    queryClient.invalidateQueries({ queryKey: ['clients'] });
    queryClient.invalidateQueries({ queryKey: ['services'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['partners'] });
    queryClient.invalidateQueries({ queryKey: ['company-facts'] });
    queryClient.invalidateQueries({ queryKey: ['hero-content'] });
    queryClient.invalidateQueries({ queryKey: ['static-pages'] });
    
    // Clear localStorage caches for language-specific data
    const languageKeys = [
      `advisable_content_${currentLanguage}_cache`,
      `advisable_translations_${currentLanguage}_cache`,
      `advisable_products_${currentLanguage}_cache`,
      `advisable_clients_${currentLanguage}_cache`,
      `advisable_services_${currentLanguage}_cache`,
      `advisable_partners_${currentLanguage}_cache`,
    ];
    
    languageKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
  };

  const t = (key: string, fallback: string): string => {
    return translations[key] || fallback;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, languages, setLanguage, t, isLoading, isLanguageReady }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
