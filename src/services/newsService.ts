
import { supabase } from "@/integrations/supabase/client";

export type NewsItem = {
  id: string;
  title: string;
  type: 'article' | 'media';
  excerpt: string;
  content: string | null;
  featured_image: string | null;
  thumbnail_url?: string | null;
  video_url: string | null;
  published_date: string;
  created_at: string;
  updated_at: string;
  slug: string;
};

export async function getAllNewsItems({ queryKey }: { queryKey: any[] }): Promise<NewsItem[]> {
  const [_, language_code = 'en' as string] = queryKey;
  try {
    const { data, error } = await supabase.rpc('get_all_news_items_with_translation', {
      p_language_code: language_code
    });

    if (error) {
      throw error;
    }

    return (data || []).map((item: any) => ({
      ...item,
      type: item.type as 'article' | 'media',
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
      slug: item.slug || ''
    }));
  } catch (error) {
    console.error('Error fetching news items:', error);
    throw new Error('Failed to fetch news items');
  }
};

export async function getNewsByType(type: 'article' | 'media', languageCode: string): Promise<NewsItem[]> {
  try {
    const { data, error } = await supabase.rpc('get_all_news_items_with_translation', {
      p_language_code: languageCode
    });

    if (error) {
      throw error;
    }

    return (data || []).filter((item: any) => item.type === type).map((item: any) => ({
      ...item,
      type: item.type as 'article' | 'media',
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
      slug: item.slug || ''
    }));
  } catch (error) {
    console.error('Error fetching news items:', error);
    throw new Error('Failed to fetch news items');
  }
};

export async function getNewsItemById(id: string, languageCode: string): Promise<NewsItem | null> {
  try {
    const { data, error } = await supabase.rpc('get_news_item_by_slug_with_translation', {
      p_slug: id, // Try as slug first
      p_language_code: languageCode
    });

    if (error || !data || data.length === 0) {
      // Fallback to UUID lookup for backward compatibility
      const { data: uuidData, error: uuidError } = await supabase.rpc('get_news_item_with_translation', {
        p_item_id: id,
        p_language_code: languageCode
      });

      if (uuidError) {
        console.error('Error fetching news item:', uuidError);
        throw new Error('Failed to fetch news item');
      }

      if (!uuidData || uuidData.length === 0) {
        return null;
      }

      const item = uuidData[0];
      return {
        id: item.id,
        title: item.title || '',
        type: item.type as 'article' | 'media',
        excerpt: item.excerpt || '',
        content: item.content,
        featured_image: item.featured_image,
        thumbnail_url: item.thumbnail_url || null,
        video_url: item.video_url,
        published_date: item.published_date,
        created_at: item.published_date || new Date().toISOString(),
        updated_at: item.published_date || new Date().toISOString(),
        slug: item.slug || ''
      };
    }

    const item = data[0];
    return {
      id: item.id,
      title: item.title || '',
      type: item.type as 'article' | 'media',
      excerpt: item.excerpt || '',
      content: item.content,
      featured_image: item.featured_image,
      thumbnail_url: item.thumbnail_url || null,
      video_url: item.video_url,
      published_date: item.published_date,
      created_at: item.published_date || new Date().toISOString(),
      updated_at: item.published_date || new Date().toISOString(),
      slug: item.slug || ''
    };
  } catch (error) {
    console.error('Error fetching news item:', error);
    throw new Error('Failed to fetch news item');
  }
}

export async function deleteNewsItem(id: string): Promise<{ success: boolean; error?: Error }> {
  try {
    const { error } = await supabase
      .from('insights')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting news item:', error);
    return { success: false, error: error as Error };
  }
}

export async function getNewsItemBySlug(slug: string, languageCode: string): Promise<NewsItem | null> {
  try {
    const { data, error } = await supabase.rpc('get_news_item_by_slug_with_translation', {
      p_slug: slug,
      p_language_code: languageCode
    });

    if (error) {
      console.error('Error fetching news item:', error);
      throw new Error('Failed to fetch news item');
    }

    if (!data || data.length === 0) {
      return null;
    }

    const item = data[0];
    return {
      id: item.id,
      title: item.title || '',
      type: item.type as 'article' | 'media',
      excerpt: item.excerpt || '',
      content: item.content,
      featured_image: item.featured_image,
      thumbnail_url: item.thumbnail_url || null,
      video_url: item.video_url,
      published_date: item.published_date,
      created_at: item.published_date || new Date().toISOString(),
      updated_at: item.published_date || new Date().toISOString(),
      slug: item.slug || ''
    };
  } catch (error) {
    console.error('Error fetching news item:', error);
    throw new Error('Failed to fetch news item');
  }
}
