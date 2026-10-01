import { supabase } from '@/integrations/supabase/client';

// Partner category management functions (similar to client categories)
export const savePartnerCategories = async (partnerId: string, categories: string[]): Promise<{ success: boolean, error: Error | null }> => {
  try {
    // First, delete existing categories for this partner
    const { error: deleteError } = await supabase
      .from('partner_partner_categories')
      .delete()
      .eq('partner_id', partnerId);

    if (deleteError) {
      throw deleteError;
    }

    // Then insert new categories if any exist
    if (categories.length > 0) {
      const categoryInserts = categories.map(category => ({
        partner_id: partnerId,
        category: category
      }));

      const { error: insertError } = await supabase
        .from('partner_partner_categories')
        .insert(categoryInserts);

      if (insertError) {
        throw insertError;
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving partner categories:', error);
    return { success: false, error: error as Error };
  }
};

export const getPartnerCategoriesForPartner = async (partnerId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('partner_partner_categories')
      .select('category')
      .eq('partner_id', partnerId);

    if (error) {
      throw error;
    }

    return data?.map(item => item.category) || [];
  } catch (error) {
    console.error('Error fetching partner categories:', error);
    return [];
  }
};