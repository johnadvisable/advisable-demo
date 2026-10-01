
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

type TranslatedField = {
  originalValue: string | null;
  translatedValue: string | null;
  isLoading: boolean;
};

export const useTranslatedContent = (
  tableName: string,
  recordId: string | undefined,
  fieldName: string,
  originalValue: string | null
): TranslatedField => {
  const { currentLanguage } = useLanguage();
  const [translatedValue, setTranslatedValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!recordId) {
      setIsLoading(false);
      return;
    }

    // Reset state when dependencies change
    setTranslatedValue(null);
    setIsLoading(true);

    const fetchTranslation = async () => {
      try {
        // For English (default), use the original value
        if (currentLanguage === 'en') {
          setTranslatedValue(originalValue);
          setIsLoading(false);
          return;
        }

        // For other languages, check for translations
        const { data, error } = await supabase.rpc(
          'get_translation',
          { 
            p_table_name: tableName,
            p_record_id: recordId,
            p_field_name: fieldName,
            p_language_code: currentLanguage
          }
        );

        if (error) {
          throw error;
        }

        // If translation exists, use it, otherwise fall back to original value
        setTranslatedValue(data || originalValue);
      } catch (error) {
        console.error(`Error fetching translation for ${tableName}.${fieldName}:`, error);
        setTranslatedValue(originalValue); // Fallback to original value
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslation();
  }, [tableName, recordId, fieldName, originalValue, currentLanguage]);

  return {
    originalValue,
    translatedValue,
    isLoading
  };
};
