import { supabase } from '@/integrations/supabase/client';
import { getPartnerCategoriesForPartner } from './partners/partnerCategoryMutations';

export type PartnershipType = 'Silver' | 'Gold' | 'Platinum' | 'Strategic';

export type PartnerIntegration = {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: string;
  categories: string[];
  hasDetailPage: boolean;
  featured: boolean;
};

export type PartnerDetail = PartnerIntegration & {
  longDescription: string;
  benefits: string[];
  useCase: string;
  integrationSteps?: string[];
  contactPerson?: string;
  partnershipType: PartnershipType;
  display_order?: number;
};

export type PartnerCategory = {
  id: string;
  name: string;
  description?: string;
  display_order?: number;
};

// Get all partners from Supabase with optimized single query
export const getAllPartners = async (): Promise<PartnerIntegration[]> => {
  try {
    // Single query with LEFT JOIN to fetch partners, translations and categories
    const { data, error } = await supabase
      .from('partners')
      .select(`
        id,
        logo,
        category,
        has_detail_page,
        featured,
        display_order,
        partner_translations!inner (
          language_id,
          name,
          description
        ),
        partner_partner_categories (
          category
        )
      `)
      .order('display_order', { ascending: true });
      
    if (error) throw error;

    const partners: PartnerIntegration[] = (data || []).map(partner => {
      const translation = partner.partner_translations[0];
      const categories = partner.partner_partner_categories?.map(cat => cat.category) || [];
      
      return {
        id: partner.id,
        name: translation?.name || 'Unknown Partner',
        description: translation?.description || 'No description available',
        logo: partner.logo,
        category: partner.category,
        categories: categories,
        hasDetailPage: partner.has_detail_page,
        featured: partner.featured
      };
    });
    
    return partners;
  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
};
// Return featured partners only - LIMITED TO 10 for homepage
export const getFeaturedPartners = async ({ queryKey }: { queryKey: any[] }): Promise<PartnerIntegration[]> => {
  const [_, language = 'en' as string] = queryKey;
  try {
    // Get language data
    const { data: languageData } = await supabase
      .from('languages')
      .select('id')
      .eq('code', language)
      .single();

    const { data: defaultLangData } = await supabase
      .from('languages')
      .select('id')
      .eq('is_default', true)
      .single();

    const targetLanguageId = languageData?.id || defaultLangData?.id;
    
    if (!targetLanguageId) {
      console.error('No language found');
      return [];
    }

    // Get featured partners with basic data first - LIMIT 10 for homepage
    const { data, error } = await supabase
      .from('partners')
      .select(`
        id,
        logo,
        category,
        has_detail_page,
        featured,
        display_order
      `)
      .eq('featured', true)
      .order('display_order', { ascending: true })
      .limit(10); // LIMIT TO 10 PARTNERS FOR HOMEPAGE

    if (error) throw error;

    const partners: PartnerIntegration[] = [];
    
    for (const partner of data || []) {
      // Try to get translation for target language, fallback to original data
      const { data: translation } = await supabase
        .from('partner_translations')
        .select('name, description, long_description, use_case')
        .eq('partner_id', partner.id)
        .eq('language_id', targetLanguageId)
        .single();

      // Get categories for each partner
      const categories = await getPartnerCategoriesForPartner(partner.id);
      
      partners.push({
        id: partner.id,
        logo: partner.logo,
        category: partner.category,
        categories: categories,
        hasDetailPage: partner.has_detail_page,
        featured: partner.featured,
        name: translation?.name || '',
        description: translation?.description || '',
      });
    }
    
    return partners;
  } catch (error) {
    console.error('Error fetching featured partners:', error);
    return [];
  }
};

// Get partners by category
export const getPartnersByCategory = async (category: string): Promise<PartnerIntegration[]> => {
  try {
    // Get all partners and filter by category
    const allPartners = await getAllPartners();
    
    // Filter partners that have the specified category
    return allPartners.filter(partner => 
      partner.categories.includes(category) || partner.category === category
    );
  } catch (error) {
    console.error('Error fetching partners by category:', error);
    return [];
  }
};

// Get unique categories from partner_categories table, not from partners
export const getPartnerCategories = async (): Promise<string[]> => {
  try {
    // Get all partner categories from the categories table
    const { data, error } = await supabase
      .from("partner_categories")
      .select("name")
      .order("display_order");

    if (error) throw error;

    const categoryNames = data?.map(cat => cat.name).filter(Boolean) || [];
    
    // Also get categories from existing partner_partner_categories for completeness
    const { data: partnerCategoryData, error: partnerCategoryError } = await supabase
      .from("partner_partner_categories")
      .select("category");

    if (!partnerCategoryError && partnerCategoryData) {
      const additionalCategories = partnerCategoryData
        .map(pc => pc.category)
        .filter(Boolean);
      
      // Combine and deduplicate
      const allCategories = [...new Set([...categoryNames, ...additionalCategories])];
      return allCategories;
    }

    return categoryNames;
  } catch (error) {
    console.error("Error fetching partner categories:", error);
    return [];
  }
};

// Get partner details by ID
export const getPartnerById = async (id: string, language: string): Promise<PartnerDetail | undefined> => {
  try {
    const { data: languageData, error: langError } = await supabase
      .from('languages')
      .select('id')
      .eq('code', language)
      .single();    
    if (langError) {
      console.error(`Error fetching language ID for code ${language}:`, langError);
      // Fallback to default language
      const { data: defaultLang } = await supabase
        .from('languages')
        .select('id, code')
        .eq('is_default', true)
        .single();

      if (defaultLang) {
        return getPartnerById(id, defaultLang.code);
      }

      throw new Error(`Language not found and no default language available`);
    }

    const { data, error } = await supabase
      .from('partners')
      .select(`
        id,
        logo,
        category,
        has_detail_page,
        featured,
        benefits,
        integration_steps,
        contact_person,
        partnership_type,
        partner_translations!inner (
          name,
          description,
          long_description,
          use_case
        )
      `)
      .eq('id', id)
      .eq('partner_translations.language_id', languageData.id)
      .maybeSingle();


    if (error) throw error;

    if (!data) {
      console.error(`Partner not found with ID ${id}`);
      return undefined;
    }

    // Return the joined data
    return {
      id: data.id,
      name: data.partner_translations[0].name || '',
      logo: data.logo,
      description: data.partner_translations[0].description || '',
      category: data.category,
      categories: [], // Will be fetched separately if needed
      hasDetailPage: data.has_detail_page,
      featured: data.featured,
      longDescription: data.partner_translations[0]?.long_description || '',
      benefits: data.benefits || [],
      useCase: data.partner_translations[0]?.use_case || '',
        integrationSteps: data.integration_steps || undefined,
        contactPerson: data.contact_person || undefined,
      partnershipType: (data.partnership_type as PartnershipType) || 'Silver'
    };
  } catch (error) {
    console.error('Error fetching partner by ID:', error);
    return undefined;
  }
};

// NEW CATEGORY MANAGEMENT FUNCTIONS

// Get all partner categories from partner_categories table
export const getAllPartnerCategories = async (): Promise<PartnerCategory[]> => {
  const response = await (supabase as any)
    .from('partner_categories')
    .select('*')
    .order('display_order', { ascending: true });
  
  const { data, error } = response;
  
  if (error) {
    console.error('Error fetching partner categories:', error);
    return [];
  }
  
  return data.map((category: any) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    display_order: category.display_order
  }));
};

// Add a new partner category
export const addPartnerCategory = async (category: Omit<PartnerCategory, 'id'>): Promise<PartnerCategory | null> => {
  const response = await (supabase as any)
    .from('partner_categories')
    .insert({
      name: category.name,
      description: category.description,
      display_order: category.display_order || 0
    })
    .select();
  
  const { data, error } = response;
  
  if (error || !data || data.length === 0) {
    console.error('Error adding partner category:', error);
    return null;
  }
  
  return {
    id: data[0].id,
    name: data[0].name,
    description: data[0].description,
    display_order: data[0].display_order
  };
};

// Update an existing partner category
export const updatePartnerCategory = async (category: PartnerCategory): Promise<boolean> => {
  const response = await (supabase as any)
    .from('partner_categories')
    .update({
      name: category.name,
      description: category.description,
      display_order: category.display_order
    })
    .eq('id', category.id);
  
  const { error } = response;
  
  if (error) {
    console.error('Error updating partner category:', error);
    return false;
  }
  
  return true;
};

// Delete a partner
export const deletePartner = async (id: string): Promise<{ success: boolean, error: Error | null }> => {

  try {
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting partner:", error);
      throw error;
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error in deletePartner function:", error);
    return { success: false, error };
  }
};

// Delete a partner category
export const deletePartnerCategory = async (id: string): Promise<boolean> => {
  const response = await (supabase as any)
    .from('partner_categories')
    .delete()
    .eq('id', id);
  
  const { error } = response;
  
  if (error) {
    console.error('Error deleting partner category:', error);
    return false;
  }
  
  return true;
};

// Update multiple partner categories at once (for reordering)
export const updatePartnerCategoryOrder = async (categories: Pick<PartnerCategory, 'id' | 'display_order'>[]): Promise<boolean> => {
  const updates = categories.map(cat => ({
    id: cat.id,
    display_order: cat.display_order,
    name: ''
  }));
  
  const response = await (supabase as any)
    .from('partner_categories')
    .upsert(updates, { onConflict: 'id' });
  
  const { error } = response;
  
  if (error) {
    console.error('Error updating partner category order:', error);
    return false;
  }
  
  return true;
};

// Initialize default categories if none exist
export const initializeDefaultCategories = async (): Promise<boolean> => {
  try {
    const existing = await getAllPartnerCategories();
    if (existing.length > 0) {
      return true;
    }
    
    const defaultCategories = [
      { name: "Cloud", description: "Cloud-based services and platforms", display_order: 0 },
      { name: "Marketing", description: "Marketing tools and platforms", display_order: 1 },
      { name: "Productivity", description: "Tools to improve productivity", display_order: 2 },
      { name: "CRM", description: "Customer relationship management systems", display_order: 3 },
      { name: "Communication", description: "Communication tools and platforms", display_order: 4 },
      { name: "Payments", description: "Payment processing systems", display_order: 5 }
    ];
    
    for (const category of defaultCategories) {
      const result = await addPartnerCategory(category);
      if (!result) {
        console.error(`Failed to add default category: ${category.name}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing default categories:', error);
    return false;
  }
};
