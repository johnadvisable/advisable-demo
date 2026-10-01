import { supabase } from '@/integrations/supabase/client';

// Get available product categories for clients
export const getAvailableProductCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.rpc('get_client_categories');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching available product categories:', error);
    throw error;
  }
};

// Update client categories completely (replace all categories)
export const updateClientCategoriesComplete = async (
  clientId: string, 
  primaryCategory: string, 
  allCategories: string[]
): Promise<void> => {
  try {
    // First update the primary category in the clients table
    const { error: clientError } = await supabase
      .from('clients')
      .update({ product_category: primaryCategory })
      .eq('id', clientId);

    if (clientError) throw clientError;

    // Delete existing categories
    const { error: deleteError } = await supabase
      .from('client_categories')
      .delete()
      .eq('client_id', clientId);

    if (deleteError) throw deleteError;

    // Insert new categories
    if (allCategories.length > 0) {
      const categoriesToInsert = allCategories.map(category => ({
        client_id: clientId,
        category: category
      }));

      const { error: insertError } = await supabase
        .from('client_categories')
        .insert(categoriesToInsert);

      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error updating client categories:', error);
    throw error;
  }
};