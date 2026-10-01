// Unified translation hook that handles all translation needs efficiently
import { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface TranslationRecord {
  id: string;
  [key: string]: any; // Original data
}

interface TranslatedRecord extends TranslationRecord {
  translatedFields: Record<string, string>;
  isTranslated: boolean;
}

interface UseUnifiedTranslationOptions {
  entityType: 'products' | 'clients' | 'services' | 'partners' | 'news_items';
  fields: string[];
  staleTime?: number;
  enabled?: boolean;
}

export function useUnifiedTranslation<T extends TranslationRecord>(
  data: T[] | T | null,
  options: UseUnifiedTranslationOptions
) {
  const { currentLanguage } = useLanguage();

  // Generate cache key based on entity type, language, and data IDs
  const cacheKey = useMemo(() => {
    if (!data) return null;
    const ids = Array.isArray(data) ? data.map(d => d.id).sort() : [data.id];
    return `${options.entityType}_translations_${currentLanguage}_${ids.join('_')}`;
  }, [data, options.entityType, currentLanguage]);

  // Query translations for all records
  const translationsQuery = useQuery({
    queryKey: ['unified-translations', cacheKey],
    queryFn: async () => {
      if (!data || currentLanguage === 'en') return null;

      const records = Array.isArray(data) ? data : [data];
      const translations: Record<string, Record<string, string>> = {};

      // Batch fetch translations for better performance
      for (const record of records) {
        const recordTranslations: Record<string, string> = {};
        
        // Use parallel requests for all fields
        const translationPromises = options.fields.map(async (field) => {
          try {
            const result = await supabase.rpc('get_translation', {
              p_table_name: options.entityType,
              p_record_id: record.id,
              p_field_name: field,
              p_language_code: currentLanguage
            });

            if (result.data) {
              recordTranslations[field] = result.data;
            }
          } catch (error) {
            console.warn(`Translation fetch failed for ${options.entityType}.${field}:`, error);
          }
        });

        await Promise.all(translationPromises);
        translations[record.id] = recordTranslations;
      }

      return translations;
    },
    enabled: options.enabled !== false && !!data && currentLanguage !== 'en',
    staleTime: options.staleTime || 10 * 60 * 1000, // 10 minutes default
    gcTime: options.staleTime || 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Transform data with translations
  const translatedData = useMemo(() => {
    if (!data) return null;

    const applyTranslations = (record: T): TranslatedRecord => {
      if (currentLanguage === 'en' || !translationsQuery.data) {
        return {
          ...record,
          translatedFields: {},
          isTranslated: false
        };
      }

      const recordTranslations = translationsQuery.data[record.id] || {};
      const translatedFields: Record<string, string> = {};
      let hasTranslations = false;

      // Apply translations for each field
      options.fields.forEach(field => {
        const translation = recordTranslations[field];
        if (translation && translation.trim()) {
          translatedFields[field] = translation;
          hasTranslations = true;
        } else {
          // Fallback to original value
          translatedFields[field] = record[field] || '';
        }
      });

      return {
        ...record,
        translatedFields,
        isTranslated: hasTranslations
      };
    };

    if (Array.isArray(data)) {
      return data.map(applyTranslations);
    } else {
      return applyTranslations(data);
    }
  }, [data, translationsQuery.data, currentLanguage, options.fields]);

  return {
    data: translatedData,
    isLoading: translationsQuery.isLoading,
    isError: translationsQuery.isError,
    error: translationsQuery.error,
    currentLanguage,
    // Helper function to get translated field value
    getTranslatedField: (record: TranslatedRecord, field: string) => {
      return record.translatedFields?.[field] || record[field] || '';
    },
    // Invalidate translations cache
    invalidateTranslations: () => {
      translationsQuery.refetch();
    }
  };
}

// Specialized hooks for common entities
export function useProductTranslations(products: any[] | any | null) {
  return useUnifiedTranslation(products, {
    entityType: 'products',
    fields: ['title', 'description', 'page_title', 'page_subtitle', 'page_description', 'cta_section_title', 'cta_section_description', 'cta_button_text']
  });
}

export function useClientTranslations(clients: any[] | any | null) {
  return useUnifiedTranslation(clients, {
    entityType: 'clients',
    fields: ['name', 'description', 'case_study_challenge', 'case_study_solution']
  });
}

export function useServiceTranslations(services: any[] | any | null) {
  return useUnifiedTranslation(services, {
    entityType: 'services',
    fields: ['title', 'short_description', 'long_description']
  });
}

export function usePartnerTranslations(partners: any[] | any | null) {
  return useUnifiedTranslation(partners, {
    entityType: 'partners',
    fields: ['name', 'description', 'long_description', 'use_case']
  });
}

export function useNewsTranslations(newsItems: any[] | any | null) {
  return useUnifiedTranslation(newsItems, {
    entityType: 'news_items',
    fields: ['title', 'excerpt', 'content']
  });
}