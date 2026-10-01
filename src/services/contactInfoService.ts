import { supabase } from '@/integrations/supabase/client';

export interface ContactInfo {
  id: string;
  info_type: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactInfoTranslation {
  id: string;
  contact_info_id: string;
  language_id: number;
  label: string;
  value: string;
  address: string;
  description: string;
}

// Get all contact info
export const getContactInfo = async (): Promise<ContactInfo[]> => {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching contact info:', error);
    throw error;
  }

  return data.map(item => ({
    ...item,
    is_primary: item.is_primary || false,
    display_order: item.display_order || 0,
    created_at: item.created_at || '',
    updated_at: item.updated_at || ''
  }));
};

// Get contact info with translations
export const getContactInfoWithTranslations = async (languageCode: string) => {
  const { data, error } = await supabase
    .rpc('get_contact_info_with_translation', {
      p_language_code: languageCode
    });

  if (error) {
    console.error('Error fetching contact info with translations:', error);
    throw error;
  }

  return data;
};

// Get contact info by ID
export const getContactInfoById = async (id: string): Promise<ContactInfo | null> => {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching contact info:', error);
    throw error;
  }

  return {
    ...data,
    is_primary: data.is_primary || false,
    display_order: data.display_order || 0,
    created_at: data.created_at || '',
    updated_at: data.updated_at || ''
  };
};

// Create contact info
export const createContactInfo = async (contactData: Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>): Promise<ContactInfo> => {
  const { data, error } = await supabase
    .from('contact_info')
    .insert([contactData])
    .select()
    .single();

  if (error) {
    console.error('Error creating contact info:', error);
    throw error;
  }

  return {
    ...data,
    is_primary: data.is_primary || false,
    display_order: data.display_order || 0,
    created_at: data.created_at || '',
    updated_at: data.updated_at || ''
  };
};

// Update contact info
export const updateContactInfo = async (id: string, contactData: Partial<ContactInfo>): Promise<ContactInfo> => {
  const { data, error } = await supabase
    .from('contact_info')
    .update(contactData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating contact info:', error);
    throw error;
  }

  return {
    ...data,
    is_primary: data.is_primary || false,
    display_order: data.display_order || 0,
    created_at: data.created_at || '',
    updated_at: data.updated_at || ''
  };
};

// Delete contact info
export const deleteContactInfo = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('contact_info')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contact info:', error);
    throw error;
  }
};

// Get translations for contact info
export const getContactInfoTranslations = async (contactId: string): Promise<ContactInfoTranslation[]> => {
  const { data, error } = await supabase
    .from('contact_info_translations')
    .select('*')
    .eq('contact_info_id', contactId);

  if (error) {
    console.error('Error fetching contact info translations:', error);
    throw error;
  }

  return data.map(item => ({
    ...item,
    label: item.label || '',
    value: item.value || '',
    address: item.address || '',
    description: item.description || ''
  }));
};

// Save contact info translation
export const saveContactInfoTranslation = async (translation: Omit<ContactInfoTranslation, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
  const { error } = await supabase
    .from('contact_info_translations')
    .upsert([translation], {
      onConflict: 'contact_info_translations_contact_info_id_language_id_key'
    });

  if (error) {
    console.error('Error saving contact info translation:', error);
    throw error;
  }
};