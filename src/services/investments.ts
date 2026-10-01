import { supabase } from "@/integrations/supabase/client";

export interface Investment {
  id: string;
  slug: string;
  website_url: string;
  logo?: string;
  featured_image?: string;
  display_order: number;
  is_active: boolean;
  title: string;
  short_description: string;
  description: string;
  tagline: string;
  cta_primary_text: string;
  cta_secondary_text: string;
  features: Array<{ title: string; description: string }>;
  benefits: Array<{ icon: string; title: string; description: string }>;
  testimonials: Array<{ name: string; company: string; quote: string; image_url?: string }>;
}

// Raw type from Supabase with Json types
interface RawInvestment {
  id: string;
  slug: string;
  website_url: string;
  logo?: string;
  featured_image?: string;
  display_order: number;
  is_active: boolean;
  title: string;
  short_description: string;
  description: string;
  tagline: string;
  cta_primary_text: string;
  cta_secondary_text: string;
  features: any;
  benefits: any;
  testimonials: any;
}

// Helper function to transform raw data to typed Investment
const transformRawInvestment = (raw: RawInvestment): Investment => ({
  ...raw,
  features: Array.isArray(raw.features) ? raw.features : [],
  benefits: Array.isArray(raw.benefits) ? raw.benefits : [],
  testimonials: Array.isArray(raw.testimonials) ? raw.testimonials : [],
});

export const getInvestments = async (languageCode: string = 'en'): Promise<Investment[]> => {
  const { data, error } = await supabase.rpc('get_all_investments_with_translation', {
    p_language_code: languageCode
  });

  if (error) {
    console.error('Error fetching investments:', error);
    throw error;
  }

  return (data || []).map(transformRawInvestment);
};

export const getInvestmentBySlug = async (slug: string, languageCode: string = 'en'): Promise<Investment | null> => {
  const { data, error } = await supabase.rpc('get_investment_by_slug_with_translation', {
    p_slug: slug,
    p_language_code: languageCode
  });

  if (error) {
    console.error('Error fetching investment by slug:', error);
    throw error;
  }

  return data && data.length > 0 ? transformRawInvestment(data[0]) : null;
};