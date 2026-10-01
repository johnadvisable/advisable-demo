// Unified Client Service - Enhanced with transaction handling and proper error management
import { supabase } from '@/integrations/supabase/client';
import { generateSlug } from '@/utils/slugUtils';
import { transactionHandler, ValidationRule } from '@/utils/transactionHandler';
import { FileUploadHandler } from '@/utils/fileUploadHandler';
import { getErrorMessage, logError } from '@/utils/errorHandler';
import { Client } from './types';

export interface ClientSaveResult {
  success: boolean;
  clientId?: string;
  error?: Error;
}

export interface ClientDeleteResult {
  success: boolean;
  error?: Error;
}

// Unified function to get all clients with consistent RPC usage
export const getUnifiedClientsForAdmin = async (languageCode: string = 'en'): Promise<Client[]> => {
  try {
    const { data, error } = await supabase.rpc('get_all_clients_with_translation', {
      p_language_code: languageCode
    });

    if (error) {
      console.error('RPC Error:', error);
      throw error;
    }

    if (!data) {
      console.warn('No data returned from RPC');
      return [];
    }

    return data as Client[];
  } catch (error) {
    console.error('Error in getUnifiedClientsForAdmin:', error);
    throw error;
  }
};

// Unified function to get single client
export const getUnifiedClientById = async (clientId: string, languageCode: string = 'en'): Promise<Client | null> => {
  try {
    const { data, error } = await supabase.rpc('get_client_with_translation', {
      p_client_id: clientId,
      p_language_code: languageCode
    });

    if (error) {
      console.error('RPC Error:', error);
      throw error;
    }

    return (data?.[0] || null) as Client | null;
  } catch (error) {
    console.error('Error in getUnifiedClientById:', error);
    throw error;
  }
};

// Enhanced save function with validation and transaction handling
export const saveUnifiedClient = async (
  clientData: Partial<Client>, 
  translations: Record<string, any>,
  files: { logo?: File | null, background?: File | null } = {}
): Promise<ClientSaveResult> => {
  const validationRules: ValidationRule[] = [
    { field: 'slug', required: true, minLength: 1, maxLength: 100 },
    { field: 'product_category', required: true, minLength: 1 }
  ];

  // Create slug if not provided
  if (!clientData.slug && translations.en?.name) {
    clientData.slug = generateSlug(translations.en.name);
  }

  const result = await transactionHandler.validateAndExecute(
    clientData,
    validationRules,
    async () => {
      logError('ClientSave', null, { clientId: clientData.id, hasLogo: !!files.logo, hasBackground: !!files.background });

      // Handle file uploads first
      let logoUrl = clientData.logo || '';
      let backgroundUrl = clientData.background_image || '';

      if (files.logo) {
        const logoResult = await FileUploadHandler.uploadFile({
          bucket: 'files-uploads',
          path: `client-logos/${clientData.id || 'new'}-${Date.now()}.${files.logo.name.split('.').pop()}`,
          file: files.logo,
          maxSize: 5 * 1024 * 1024, // 5MB
          allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        });

        if (!logoResult.success) {
          throw new Error(`Logo upload failed: ${logoResult.error}`);
        }
        logoUrl = logoResult.url || '';
      }

      if (files.background) {
        const bgResult = await FileUploadHandler.uploadFile({
          bucket: 'files-uploads',
          path: `client-backgrounds/${clientData.id || 'new'}-${Date.now()}.${files.background.name.split('.').pop()}`,
          file: files.background,
          maxSize: 10 * 1024 * 1024, // 10MB for backgrounds
          allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        });

        if (!bgResult.success) {
          throw new Error(`Background upload failed: ${bgResult.error}`);
        }
        backgroundUrl = bgResult.url || '';
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
        slug: clientData.slug || 'unnamed-client'
      };

      let clientId = clientData.id;

      // Save or update core client data
      if (clientId) {
        const { error } = await supabase
          .from('clients')
          .update({ ...coreData, updated_at: new Date().toISOString() })
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
          throw new Error(`Failed to get language ID for ${languageCode}: ${getErrorMessage(langError)}`);
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
            case_study_results: translationData.case_study_results || [],
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'clients_translations_client_id_language_id_key',
            ignoreDuplicates: false 
          });

        if (translationError) {
          throw new Error(`Failed to save translation for ${languageCode}: ${getErrorMessage(translationError)}`);
        }
      }

      // Save client categories
      if (clientData.product_categories && clientId) {
        await saveClientCategories(clientId, clientData.product_categories);
      }

      return { success: true, clientId };
    },
    'SaveUnifiedClient'
  );

  // Convert TransactionResult to ClientSaveResult
  if (result.success) {
    return {
      success: true,
      clientId: result.data?.clientId
    };
  } else {
    return {
      success: false,
      error: new Error(result.error || 'Unknown error occurred')
    };
  }
};

// Save client categories
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

// Unified delete function
export const deleteUnifiedClient = async (clientId: string): Promise<ClientDeleteResult> => {
  try {

    // Delete in correct order due to foreign key constraints
    // 1. Delete translations
    const { error: transError } = await supabase
      .from('clients_translations')
      .delete()
      .eq('client_id', clientId);
    
    if (transError) {
      console.error('Error deleting translations:', transError);
      throw transError;
    }

    // 2. Delete categories  
    const { error: catError } = await supabase
      .from('client_categories')
      .delete()
      .eq('client_id', clientId);
    
    if (catError) {
      console.error('Error deleting categories:', catError);
      throw catError;
    }

    // 3. Delete main client record
    const { error: clientError } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (clientError) {
      console.error('Error deleting client:', clientError);
      throw clientError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteUnifiedClient:', error);
    return { success: false, error: error as Error };
  }
};

// Get client categories for a specific client
export const getUnifiedClientCategories = async (clientId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('client_categories')
      .select('category')
      .eq('client_id', clientId);

    if (error) {
      console.error('Error fetching client categories:', error);
      throw error;
    }
    
    return data?.map(item => item.category) || [];
  } catch (error) {
    console.error('Error in getUnifiedClientCategories:', error);
    return [];
  }
};

// Get all available client categories
export const getUnifiedAvailableCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.rpc('get_client_categories');
    if (error) {
      console.error('Error fetching available categories:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Error in getUnifiedAvailableCategories:', error);
    return [];
  }
};