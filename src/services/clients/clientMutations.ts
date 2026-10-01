
// Enhanced Client Service with unified RPC-based operations
import { supabase } from '@/integrations/supabase/client';
import { Client } from './types';
import { uploadFile } from '@/utils/fileUtils';
import { generateSlug } from '@/utils/slugUtils';

// Get all clients with translations using RPC
export const getAllClientsForAdmin = async (languageCode: string = 'en'): Promise<Client[]> => {
  try {
    const { data, error } = await supabase.rpc('get_all_clients_with_translation', {
      p_language_code: languageCode
    });

    if (error) throw error;
    return (data || []) as Client[];
  } catch (error) {
    console.error('Error fetching clients for admin:', error);
    throw error;
  }
};

// Get single client with translation using RPC
export const getClientWithTranslation = async (clientId: string, languageCode: string = 'en'): Promise<Client | null> => {
  try {
    const { data, error } = await supabase.rpc('get_client_with_translation', {
      p_client_id: clientId,
      p_language_code: languageCode
    });

    if (error) throw error;
    return (data?.[0] || null) as Client | null;
  } catch (error) {
    console.error('Error fetching client with translation:', error);
    throw error;
  }
};

// Save client data with proper RLS and translations
export const saveClientWithTranslations = async (
  clientData: Partial<Client>, 
  translations: Record<string, any>,
  files: { logo?: File | null, background?: File | null } = {}
): Promise<{ success: boolean, clientId?: string, error?: Error }> => {
  try {
    // Handle file uploads first
    let logoUrl = clientData.logo || '';
    let backgroundUrl = clientData.background_image || '';

    if (files.logo) {
      try {
        const uploadResult = await uploadFile(files.logo, 'client-logos');
        logoUrl = uploadResult || logoUrl;
      } catch (uploadError) {
        console.warn('Logo upload failed, continuing without:', uploadError);
      }
    }

    if (files.background) {
      try {
        const uploadResult = await uploadFile(files.background, 'client-backgrounds');
        backgroundUrl = uploadResult || backgroundUrl;
      } catch (uploadError) {
        console.warn('Background upload failed, continuing without:', uploadError);
      }
    }

    // Prepare core client data (non-translatable fields)
    const coreData = {
      logo: logoUrl,
      background_image: backgroundUrl,
      website: clientData.website,
      industry: clientData.industry,
      country: clientData.country,
      product_category: clientData.product_category || 'General',
      featured: clientData.featured || false,
      display_order: clientData.display_order || 0,
      case_study_team_size: clientData.case_study_team_size,
      case_study_timeline: clientData.case_study_timeline,
      case_study_images: clientData.case_study_images || [],
      case_study_videos: clientData.case_study_videos || [],
      case_study_results: clientData.case_study_results || [],
      slug: clientData.slug || generateSlug(translations.en?.name || translations.el?.name || 'unnamed-client')
    };

    let clientId = clientData.id;

    // Save or update core client data
    if (clientId) {
      const { error } = await supabase
        .from('clients')
        .update(coreData)
        .eq('id', clientId);
      
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from('clients')
        .insert(coreData)
        .select('id')
        .single();
      
      if (error) throw error;
      clientId = data.id;
    }

    // Save translations for each language
    for (const [languageCode, translationData] of Object.entries(translations)) {
      if (!translationData || !clientId) continue;

      // Get language ID
      const { data: languageData, error: langError } = await supabase
        .from('languages')
        .select('id')
        .eq('code', languageCode)
        .single();

      if (langError) {
        console.error(`Error getting language ID for ${languageCode}:`, langError);
        continue;
      }

      // Save translation
      const { error: translationError } = await supabase
        .from('clients_translations')
        .upsert({
          client_id: clientId,
          language_id: languageData.id,
          name: translationData.name,
          description: translationData.description,
          testimonial: translationData.testimonial,
          case_study_challenge: translationData.case_study_challenge,
          case_study_solution: translationData.case_study_solution,
          case_study_images: translationData.case_study_images || [],
          case_study_videos: translationData.case_study_videos || [],
          case_study_results: translationData.case_study_results || []
        }, { 
          onConflict: 'clients_translations_client_id_language_id_key',
          ignoreDuplicates: false 
        });

      if (translationError) {
        console.error(`Error saving translation for ${languageCode}:`, translationError);
      }
    }

    // Save client categories
    if (clientData.product_categories && clientId) {
      await saveClientCategories(clientId, clientData.product_categories);
    }

    return { success: true, clientId };
  } catch (error) {
    console.error('Error saving client with translations:', error);
    return { success: false, error: error as Error };
  }
};

// Delete client with proper cleanup
export const deleteClientCompletely = async (clientId: string): Promise<{ success: boolean, error?: Error }> => {
  try {
    // Delete in correct order due to foreign key constraints
    // 1. Delete translations
    await supabase
      .from('clients_translations')
      .delete()
      .eq('client_id', clientId);

    // 2. Delete categories  
    await supabase
      .from('client_categories')
      .delete()
      .eq('client_id', clientId);

    // 3. Delete main client record
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting client completely:', error);
    return { success: false, error: error as Error };
  }
};

// Client category management
export const saveClientCategories = async (clientId: string, categories: string[]): Promise<void> => {
  try {
    // Delete existing categories
    await supabase
      .from('client_categories')
      .delete()
      .eq('client_id', clientId);

    // Insert new categories
    if (categories.length > 0) {
      const categoryInserts = categories.map(category => ({
        client_id: clientId,
        category: category
      }));

      const { error } = await supabase
        .from('client_categories')
        .insert(categoryInserts);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error saving client categories:', error);
    throw error;
  }
};

export const getClientCategoriesForClient = async (clientId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('client_categories')
      .select('category')
      .eq('client_id', clientId);

    if (error) throw error;
    return data?.map(item => item.category) || [];
  } catch (error) {
    console.error('Error fetching client categories:', error);
    return [];
  }
};

// Get available client categories using RPC
export const getClientCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.rpc('get_client_categories');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching client categories:', error);
    return [];
  }
};
