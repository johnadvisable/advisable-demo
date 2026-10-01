
import { supabase } from '@/integrations/supabase/client';
import { Client } from './types';
import { formatClientsData } from './clientUtils';

const applyClientLogoOverrides = (clients: Client[]): Client[] => clients;

const applyClientLogoOverride = (client: Client | null): Client | null => client;


// Get all clients from Supabase with translations and categories
export const getAllClients = async (languageCode: string = 'en'): Promise<Client[]> => {
  try {
    const { data, error } = await supabase.rpc('get_all_clients_with_translation', {
      p_language_code: languageCode
    });

    if (error) {
      throw error;
    }

    return applyClientLogoOverrides((data || []) as Client[]);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
};

// Get client by ID
export const getClientById = async (id: string, languageCode: string = 'en'): Promise<Client | null> => {
  try {
    const { data, error } = await supabase.rpc('get_client_with_translation', {
      p_client_id: id,
      p_language_code: languageCode
    });

    if (error) {
      throw error;
    }

    return applyClientLogoOverride((data?.[0] || null) as Client | null);
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    return null;
  }
};

// Get client translation by client ID and language code
export const getClientTranslation = async (clientId: string, languageCode: string): Promise<any | null> => {
  try {
    // First get language ID from code
    const { data: languageData, error: langError } = await supabase
      .from('languages')
      .select('id')
      .eq('code', languageCode)
      .single();
    
    if (langError) {
      console.error("Error getting language ID:", langError);
      throw langError;
    }

    // Then get translation
    const { data, error } = await supabase
      .from('clients_translations')
      .select('*')
      .eq('client_id', clientId)
      .eq('language_id', languageData.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching client translation:', error);
    return null;
  }
};

// Get clients by product category
export const getClientsByCategory = async (category: string): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('product_category', category)
      .order('display_order', { ascending: true });

    if (error) {
      throw error;
    }

    return applyClientLogoOverrides(formatClientsData(data || []));
  } catch (error) {
    console.error('Error fetching clients by category:', error);
    return [];
  }
};

// Get featured clients
export const getFeaturedClients = async (languageCode: string = 'en'): Promise<Client[]> => {
  try {
    const { data, error } = await supabase.rpc('get_all_clients_with_translation', {
      p_language_code: languageCode
    });

    if (error) {
      throw error;
    }

    // Filter only featured clients
    const allClients = applyClientLogoOverrides((data || []) as Client[]);
    const featuredClients = allClients.filter((client) => client.featured);
    return featuredClients;
  } catch (error) {
    console.error('Error fetching featured clients:', error);
    return [];
  }
};

// Get home page clients - first 30 by display_order
export const getHomeClients = async (languageCode: string = 'en', limit: number = 30): Promise<Client[]> => {
  try {
    const { data, error } = await supabase.rpc('get_all_clients_with_translation', {
      p_language_code: languageCode
    });

    if (error) {
      throw error;
    }

    // Sort by display_order and take the first 'limit' clients
    const allClients = applyClientLogoOverrides((data || []) as Client[]);
    const sortedClients = allClients
      .sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
      .slice(0, limit);
    
    return sortedClients;
  } catch (error) {
    console.error('Error fetching home clients:', error);
    return [];
  }
};

// Get client categories
export const getClientCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.rpc('get_client_categories');

    if (error) {
      console.error('Error fetching client categories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching client categories:', error);
    return [];
  }
};

// Get client by slug
export const getClientBySlug = async (slug: string, languageCode: string = 'en'): Promise<Client | null> => {
  try {
    const { data, error } = await supabase.rpc('get_client_by_slug_with_translation', {
      p_slug: slug,
      p_language_code: languageCode
    });

    if (error) {
      throw error;
    }

    return applyClientLogoOverride((data?.[0] || null) as Client | null);
  } catch (error) {
    console.error(`Error fetching client by slug: ${slug}`, error);
    return null;
  }
};
