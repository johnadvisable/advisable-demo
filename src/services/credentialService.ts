
import { supabase } from '@/integrations/supabase/client';

export type Credential = {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  image_url?: string;
};

// Get all credentials from Supabase, ordered by display_order
export const getAllCredentials = async (
  languageCode: string
): Promise<Credential[]> => {
  try {
    // Use the RPC function to get all credentials with translations
    const { data: credentialData, error } = await supabase
      .rpc('get_all_credentials_with_translation', {
        p_language_code: languageCode
      });


    if (error) {
      console.error("Error fetching credentials:", error);
      throw new Error(error.message);
    }

    // Map the data to include the required fields
    const credentials = credentialData?.map((credential: any) => ({
      id: credential.id,
      title: credential.title || `Credential ${credential.display_order}`,
      description: credential.description || 'Award or certification',
      icon_name: credential.icon_name,
      display_order: credential.display_order,
      image_url: credential.image_url,
      created_at: '', // RPC doesn't return these, but they're required by the type
      updated_at: ''
    })) || [];

    return credentials;
  } catch (error) {
    console.error("Error fetching credentials:", error);
    return [] as Credential[];
  }
};
