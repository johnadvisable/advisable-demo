import { supabase } from "@/integrations/supabase/client";

export interface InsightPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_date: string;
  featured_image: string | null;
  type: string;
  language_code: string;
  updated_at?: string;
}

export const getAllInsights = async ({ queryKey }: { queryKey: any[] }): Promise<InsightPost[]> => {
  const [, languageCode] = queryKey;

  try {
    const { data, error } = await supabase.rpc('get_all_insights_with_translation', {
      p_language_code: languageCode
    });

    if (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }

    return (data || []).map((post: any) => ({
      ...post,
      language_code: languageCode
    }));
  } catch (error) {
    console.error('Failed to fetch insights:', error);
    throw error;
  }
};

export const getInsightBySlug = async (slug: string, languageCode: string): Promise<InsightPost | null> => {

  try {
    const { data, error } = await supabase.rpc('get_insight_by_slug_with_translation', {
      p_slug: slug,
      p_language_code: languageCode
    });

    if (error) {
      console.error('Error fetching insight by slug:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const post = data[0];

    return {
      ...post,
      language_code: languageCode
    };
  } catch (error) {
    console.error('Failed to fetch insight by slug:', error);
    throw error;
  }
};