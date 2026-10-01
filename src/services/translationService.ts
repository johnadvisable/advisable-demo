
import { supabase } from '@/integrations/supabase/client';

export type Translation = {
  id: string;
  table_name: string;
  record_id: string;
  field_name: string;
  language_code: string;
  content: string;
};

export type Language = {
  id: number;
  code: string;
  name: string;
  is_default: boolean;
  is_active: boolean;
};

// Get all active languages
export const getLanguages = async (): Promise<Language[]> => {
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .order('is_default', { ascending: false })
    .order('name');

  if (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }

  return data?.map(lang => ({
    ...lang,
    is_default: lang.is_default ?? false,
    is_active: lang.is_active ?? false
  })) || [];
};

// Toggle language active status
export const updateLanguageStatus = async (id: number, isActive: boolean): Promise<void> => {
  const { error } = await supabase
    .from('languages')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    console.error('Error updating language status:', error);
    throw error;
  }
};

// Set a language as default
export const setDefaultLanguage = async (id: number): Promise<void> => {
  // Start a transaction
  // First, unset all languages as default
  const { error: error1 } = await supabase
    .from('languages')
    .update({ is_default: false })
    .neq('id', -1); // Update all rows

  if (error1) {
    console.error('Error updating language defaults:', error1);
    throw error1;
  }

  // Then set the selected language as default
  const { error: error2 } = await supabase
    .from('languages')
    .update({ is_default: true })
    .eq('id', id);

  if (error2) {
    console.error('Error setting default language:', error2);
    throw error2;
  }
};

// Get translations for a specific record
export const getTranslations = async (
  tableName: string,
  recordId: string,
  fieldName: string
): Promise<Translation[]> => {
  const { data, error } = await supabase
    .from('translations')
    .select('*')
    .eq('table_name', tableName)
    .eq('record_id', recordId)
    .eq('field_name', fieldName);

  if (error) {
    console.error('Error fetching translations:', error);
    throw error;
  }

  return data?.map(translation => ({
    ...translation,
    content: translation.content || ''
  })) || [];
};

// Save a translation
export const saveTranslation = async (translation: Omit<Translation, 'id'>): Promise<void> => {
  // Check if translation already exists
  const { data, error: checkError } = await supabase
    .from('translations')
    .select('id')
    .eq('table_name', translation.table_name)
    .eq('record_id', translation.record_id)
    .eq('field_name', translation.field_name)
    .eq('language_code', translation.language_code)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking for existing translation:', checkError);
    throw checkError;
  }

  if (data) {
    // Update existing translation
    const { error } = await supabase
      .from('translations')
      .update({ content: translation.content })
      .eq('id', data.id);

    if (error) {
      console.error('Error updating translation:', error);
      throw error;
    }
  } else {
    // Insert new translation
    const { error } = await supabase
      .from('translations')
      .insert([translation]);

    if (error) {
      console.error('Error inserting translation:', error);
      throw error;
    }
  }
};

// Delete a translation
export const deleteTranslation = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('translations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting translation:', error);
    throw error;
  }
};

// Get UI translations for a specific language
export const getUITranslations = async (languageCode: string): Promise<Record<string, string>> => {
  const { data, error } = await supabase
    .from('translations')
    .select('field_name, content')
    .eq('table_name', 'ui_translations')
    .eq('language_code', languageCode);

  if (error) {
    console.error('Error fetching UI translations:', error);
    throw error;
  }

  const translations: Record<string, string> = {};
  data?.forEach(item => {
    translations[item.field_name] = item.content || '';
  });

  return translations;
};

// Bulk upsert UI translations
export const upsertUITranslations = async (translations: Record<string, string>, languageCode: string = 'en'): Promise<void> => {
  const translationData = Object.entries(translations).map(([key, value]) => ({
    table_name: 'ui_translations',
    record_id: '00000000-0000-0000-0000-000000000000',
    field_name: key,
    language_code: languageCode,
    content: value
  }));

  const { error } = await supabase.from('translations').upsert(translationData, {
    onConflict: 'table_name,record_id,field_name,language_code'
  });

  if (error) {
    console.error('Error upserting UI translations:', error);
    throw error;
  }
};

// Save a single UI translation
export const saveUITranslation = async (key: string, value: string, languageCode: string): Promise<void> => {
  const translation = {
    table_name: 'ui_translations',
    record_id: '00000000-0000-0000-0000-000000000000',
    field_name: key,
    language_code: languageCode,
    content: value
  };

  await saveTranslation(translation);
};
