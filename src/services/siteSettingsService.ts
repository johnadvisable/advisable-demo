import { supabase } from '@/integrations/supabase/client';

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// Get all site settings
export const getSiteSettings = async (): Promise<SiteSetting[]> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('category', { ascending: true })
    .order('key', { ascending: true });

  if (error) {
    console.error('Error fetching site settings:', error);
    throw error;
  }

  return data.map(item => ({
    ...item,
    value: item.value || '',
    description: item.description || '',
    category: item.category || '',
    is_public: item.is_public || false,
    created_at: item.created_at || '',
    updated_at: item.updated_at || ''
  }));
};

// Get public site settings (for frontend use)
export const getPublicSiteSettings = async (): Promise<Record<string, string>> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('is_public', true);

  if (error) {
    console.error('Error fetching public site settings:', error);
    throw error;
  }

  const settings: Record<string, string> = {};
  data.forEach(setting => {
    settings[setting.key] = setting.value || '';
  });

  return settings;
};

// Get setting by key
export const getSiteSettingByKey = async (key: string): Promise<SiteSetting | null> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No rows returned
    }
    console.error('Error fetching site setting:', error);
    throw error;
  }

  return {
    ...data,
    value: data.value || '',
    description: data.description || '',
    category: data.category || '',
    is_public: data.is_public || false,
    created_at: data.created_at || '',
    updated_at: data.updated_at || ''
  };
};

// Update site setting
export const updateSiteSetting = async (key: string, value: string): Promise<SiteSetting> => {
  const { data, error } = await supabase
    .from('site_settings')
    .update({ value })
    .eq('key', key)
    .select()
    .single();

  if (error) {
    console.error('Error updating site setting:', error);
    throw error;
  }

  return {
    ...data,
    value: data.value || '',
    description: data.description || '',
    category: data.category || '',
    is_public: data.is_public || false,
    created_at: data.created_at || '',
    updated_at: data.updated_at || ''
  };
};

// Create site setting
export const createSiteSetting = async (settingData: Omit<SiteSetting, 'id' | 'created_at' | 'updated_at'>): Promise<SiteSetting> => {
  const { data, error } = await supabase
    .from('site_settings')
    .insert([settingData])
    .select()
    .single();

  if (error) {
    console.error('Error creating site setting:', error);
    throw error;
  }

  return {
    ...data,
    value: data.value || '',
    description: data.description || '',
    category: data.category || '',
    is_public: data.is_public || false,
    created_at: data.created_at || '',
    updated_at: data.updated_at || ''
  };
};

// Delete site setting
export const deleteSiteSetting = async (key: string): Promise<void> => {
  const { error } = await supabase
    .from('site_settings')
    .delete()
    .eq('key', key);

  if (error) {
    console.error('Error deleting site setting:', error);
    throw error;
  }
};

// Bulk update site settings
export const bulkUpdateSiteSettings = async (settings: Record<string, string>): Promise<void> => {
  const updates = Object.entries(settings).map(([key, value]) => ({
    key,
    value
  }));

  for (const update of updates) {
    await updateSiteSetting(update.key, update.value);
  }
};