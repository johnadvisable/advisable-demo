
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

type NormalizedTranslationField = {
  originalValue: string | null;
  translatedValue: string | null;
  isLoading: boolean;
};

export const useNormalizedTranslation = (
  contentType: string,
  recordId: string | undefined,
  fieldName: string,
  originalValue: string | null
): NormalizedTranslationField => {
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

        // Different content types are stored in different tables
        let translationValue = null;
        
        if (contentType === 'services') {
          const { data, error } = await supabase.rpc(
            'get_service_with_translation',
            { p_service_id: recordId, p_language_code: currentLanguage }
          );
          
          if (!error && data) {
            translationValue = data[0]?.[fieldName as keyof typeof data[0]];
          }
        } 
        else if (contentType === 'service_categories') {
          const { data, error } = await supabase.rpc(
            'get_service_category_with_translation',
            { p_category_id: recordId, p_language_code: currentLanguage }
          );
          
          if (!error && data) {
            translationValue = data[0]?.[fieldName as keyof typeof data[0]];
          }
        }
        // Fallback to the old translations table for other content types
        else {
          const { data, error } = await supabase.rpc(
            'get_translation',
            { 
              p_table_name: contentType,
              p_record_id: recordId,
              p_field_name: fieldName,
              p_language_code: currentLanguage
            }
          );

          if (!error) {
            translationValue = data;
          }
        }

        // If translation exists, use it, otherwise fall back to original value
        setTranslatedValue(translationValue ? String(translationValue) : originalValue);
      } catch (error) {
        console.error(`Error fetching translation for ${contentType}.${fieldName}:`, error);
        setTranslatedValue(originalValue); // Fallback to original value
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslation();
  }, [contentType, recordId, fieldName, originalValue, currentLanguage]);

  return {
    originalValue,
    translatedValue,
    isLoading
  };
};
