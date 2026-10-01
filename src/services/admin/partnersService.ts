// Phase 2: Unified Partners Service - RPC-based with proper error handling
import { supabase } from '@/integrations/supabase/client';
import { uploadFile } from '@/utils/fileUtils';

export interface Partner {
  id: string;
  name: string;
  description: string;
  long_description: string;
  use_case: string;
  logo: string;
  category: string;
  has_detail_page: boolean;
  featured: boolean;
  benefits: string[];
  integration_steps: string[];
  contact_person: string;
  partnership_type: string;
  display_order: number;
}

export interface PartnerSaveResult {
  success: boolean;
  partnerId?: string;
  error?: Error;
}

export interface PartnerDeleteResult {
  success: boolean;
  error?: Error;
}

// Get all partners with enhanced RPC
export const getUnifiedPartnersForAdmin = async (languageCode: string = 'en'): Promise<Partner[]> => {
  try {
    const { data, error } = await supabase.rpc('get_all_partners_with_translation_enhanced', {
      p_language_code: languageCode
    });

    if (error) throw error;
    return (data || []) as Partner[];
  } catch (error) {
    console.error('Error fetching partners for admin:', error);
    throw error;
  }
};

// Get single partner by ID with translation
export const getUnifiedPartnerById = async (partnerId: string, languageCode: string = 'en'): Promise<Partner | null> => {
  try {
    const { data, error } = await supabase.rpc('get_partner_with_translation', {
      p_partner_id: partnerId,
      p_language_code: languageCode
    });

    if (error) throw error;
    return (data?.[0] || null) as Partner | null;
  } catch (error) {
    console.error('Error fetching partner with translation:', error);
    throw error;
  }
};

// Save partner with translations and proper file handling
export const saveUnifiedPartner = async (
  partnerData: Partial<Partner>, 
  translations: Record<string, any>,
  files: { logo?: File | null } = {}
): Promise<PartnerSaveResult> => {
  try {
    // Handle file uploads first
    let logoUrl = partnerData.logo || '';

    if (files.logo) {
      try {
        const uploadResult = await uploadFile(files.logo, 'partner-logos');
        if (uploadResult) {
          logoUrl = uploadResult;
        }
      } catch (uploadError) {
        console.warn('Logo upload failed, continuing without:', uploadError);
      }
    }

    // Prepare core partner data (non-translatable fields)
    // Ensure required fields are not undefined
    if (!partnerData.category) {
      throw new Error('Category is required for partner');
    }

    const coreData = {
      logo: logoUrl,
      category: partnerData.category,
      has_detail_page: partnerData.has_detail_page || false,
      featured: partnerData.featured || false,
      benefits: partnerData.benefits || [],
      integration_steps: partnerData.integration_steps || [],
      contact_person: partnerData.contact_person || null,
      partnership_type: partnerData.partnership_type || null,
      display_order: partnerData.display_order || 0
    };

    let partnerId = partnerData.id;

    // Save or update core partner data
    if (partnerId) {
      const { error } = await supabase
        .from('partners')
        .update(coreData)
        .eq('id', partnerId);
      
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from('partners')
        .insert(coreData)
        .select('id')
        .single();
      
      if (error) throw error;
      partnerId = data.id;
    }

    // Save translations for each language
    for (const [languageCode, translationData] of Object.entries(translations)) {
      if (!translationData || !partnerId) continue;

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
        .from('partner_translations')
        .upsert({
          partner_id: partnerId,
          language_id: languageData.id,
          name: translationData.name,
          description: translationData.description,
          long_description: translationData.long_description,
          use_case: translationData.use_case
        }, { 
          onConflict: 'partner_translations_partner_id_language_id_key',
          ignoreDuplicates: false 
        });

      if (translationError) {
        console.error(`Error saving translation for ${languageCode}:`, translationError);
      }
    }

    return { success: true, partnerId };
  } catch (error) {
    console.error('Error saving partner with translations:', error);
    return { success: false, error: error as Error };
  }
};

// Delete partner with proper cleanup
export const deleteUnifiedPartner = async (partnerId: string): Promise<PartnerDeleteResult> => {
  try {
    // Delete in correct order due to foreign key constraints
    // 1. Delete translations
    await supabase
      .from('partner_translations')
      .delete()
      .eq('partner_id', partnerId);

    // 2. Delete partner categories  
    await supabase
      .from('partner_partner_categories')
      .delete()
      .eq('partner_id', partnerId);

    // 3. Delete main partner record
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', partnerId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting partner completely:', error);
    return { success: false, error: error as Error };
  }
};

// Get partner categories
export const getUnifiedPartnerCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('partner_categories')
      .select('name')
      .order('display_order');

    if (error) throw error;
    return data?.map(item => item.name) || [];
  } catch (error) {
    console.error('Error fetching partner categories:', error);
    return [];
  }
};