import { supabase } from '@/integrations/supabase/client';

export interface StaticPage {
  id: string;
  slug: string;
  page_type: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface StaticPageTranslation {
  id: string;
  static_page_id: string;
  language_id: number;
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
}

// Get all static pages
export const getStaticPages = async (): Promise<StaticPage[]> => {
  const { data, error } = await supabase
    .from('static_pages')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching static pages:', error);
    throw error;
  }

  return (data || []).map(page => ({
    ...page,
    display_order: page.display_order || 0
  }));
};

// Get static page by slug with translation
export const getStaticPageBySlug = async (slug: string, languageCode: string) => {
  const { data, error } = await supabase
    .rpc('get_static_page_with_translation', {
      p_slug: slug,
      p_language_code: languageCode
    });

  if (error) {
    console.error('Error fetching static page:', error);
    throw error;
  }

  return data?.[0] || null;
};

// Get static page by ID
export const getStaticPageById = async (id: string): Promise<StaticPage | null> => {
  const { data, error } = await supabase
    .from('static_pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching static page:', error);
    throw error;
  }

  return {
    ...data,
    display_order: data.display_order || 0
  };
};

// Create static page
export const createStaticPage = async (pageData: Omit<StaticPage, 'id' | 'created_at' | 'updated_at'>): Promise<StaticPage> => {
  const { data, error } = await supabase
    .from('static_pages')
    .insert([pageData])
    .select()
    .single();

  if (error) {
    console.error('Error creating static page:', error);
    throw error;
  }

  return {
    ...data,
    display_order: data.display_order || 0
  };
};

// Update static page
export const updateStaticPage = async (id: string, pageData: Partial<StaticPage>): Promise<StaticPage> => {
  const { data, error } = await supabase
    .from('static_pages')
    .update(pageData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating static page:', error);
    throw error;
  }

  return {
    ...data,
    display_order: data.display_order || 0
  };
};

// Delete static page
export const deleteStaticPage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('static_pages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting static page:', error);
    throw error;
  }
};

// Get translations for a static page
export const getStaticPageTranslations = async (pageId: string): Promise<StaticPageTranslation[]> => {
  const { data, error } = await supabase
    .from('static_page_translations')
    .select('*')
    .eq('static_page_id', pageId);

  if (error) {
    console.error('Error fetching static page translations:', error);
    throw error;
  }

  return (data || []).map(translation => ({
    ...translation,
    title: translation.title || '',
    content: translation.content || '',
    meta_title: translation.meta_title || '',
    meta_description: translation.meta_description || '',
    created_at: translation.created_at || undefined,
    updated_at: translation.updated_at || undefined
  }));
};

// Save static page translation
export const saveStaticPageTranslation = async (translation: Omit<StaticPageTranslation, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
  const { error } = await supabase
    .from('static_page_translations')
    .upsert([translation], {
      onConflict: 'static_page_translations_static_page_id_language_id_key'
    });

  if (error) {
    console.error('Error saving static page translation:', error);
    throw error;
  }
};