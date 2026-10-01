
import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published_date: string;
  featured_image: string | null;
  language_code: string;
}

export const getAllBlogPosts = async ({ queryKey }: { queryKey: any[] }): Promise<BlogPost[]> => {
  const [, languageCode = 'en'] = queryKey;
  
  try {
    const { data, error } = await supabase.rpc(
      'get_all_blog_posts_with_translation', 
      { p_language_code: languageCode }
    ) as { data: any[] | null; error: any };

    if (error) {
      console.error('❌ Supabase RPC error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No blog posts found for language:', languageCode);
      return [];
    }

    // Map the JSON response to our BlogPost interface
    return data.map(item => ({
      id: item.id,
      slug: item.slug,
      title: item.title || 'Untitled',
      excerpt: item.excerpt || '',
      content: item.content || '',
      category: item.category || 'General',
      author: item.author || 'Advisable Team',
      published_date: item.published_date || new Date().toISOString(),
      featured_image: item.featured_image || null,
      language_code: item.language_code || languageCode,
      type: item.type || 'article'
    }));
  } catch (error) {
    console.error('💥 Error fetching blog posts:', error);
    // Return empty array to prevent UI crashes
    return [];
  }
};

export const getBlogPostById = async (id: string, language_code: string = 'en'): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase.rpc('get_blog_post_by_id_with_translation', {
      p_id: id,
      p_language_code: language_code
    });

    if (error) {
      console.error('❌ Supabase RPC error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ Blog post not found with ID:', id);
      return null;
    }

    return {
      id: data[0].id,
      slug: data[0].slug,
      title: data[0].title || 'Untitled',
      excerpt: data[0].excerpt || '',
      content: data[0].content || '',
      category: data[0].category || 'General',
      author: data[0].author || 'Advisable Team',
      published_date: data[0].published_date,
      featured_image: data[0].featured_image,
      language_code: language_code
    };
  } catch (error) {
    console.error('💥 Error fetching blog post by ID:', error);
    return null;
  }
};

export const getBlogPostBySlug = async (slug: string, language_code: string = 'en'): Promise<BlogPost | null> => {
  try {

    const { data, error } = await supabase.rpc('get_blog_post_by_slug_with_translation', {
      p_slug: slug,
      p_language_code: language_code
    });

    if (error) {
      console.error('❌ Supabase RPC error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ Blog post not found with slug:', slug);
      return null;
    }

    const post = data[0];
    return {
      id: post.id,
      slug: post.slug,
      title: post.title || 'Untitled',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || 'General',
      author: post.author || 'Advisable Team',
      published_date: post.published_date,
      featured_image: post.featured_image,
      language_code: language_code,
    };
  } catch (error) {
    console.error('💥 Error fetching blog post by slug:', error);
    return null;
  }
};

// Add the missing function
export const getBlogPostsByCategory = async (category: string, language_code: string = 'en'): Promise<BlogPost[]> => {
  try {
    const { data: languageData, error: langError } = await supabase
      .from('languages')
      .select('id')
      .eq('code', language_code)
      .single();

    if (langError) {
      console.error(`Error fetching language ID for code ${language_code}:`, langError);
      // Fallback to default language
      const { data: defaultLang } = await supabase
        .from('languages')
        .select('id, code')
        .eq('is_default', true)
        .single();

      if (defaultLang) {
        return getBlogPostsByCategory(category, defaultLang.code);
      }

      throw new Error(`Language not found and no default language available`);
    }

    const { data, error } = await supabase
      .from('insights')
      .select(`
        id,
        slug,
        created_at,
        updated_at,
        author,
        published_date,
        featured_image,
        type,
        insights_translations!inner (
          title,
          excerpt,
          content
        )
      `)
      .eq('type', 'article')
      .eq('insights_translations.language_id', languageData.id)
      .order('created_at', { ascending: false })
      .limit(4); // Limit to 4 related posts

    if (error) {
      throw error;
    }

    // Return the joined data with proper type conversion
    return data.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.insights_translations[0].title || 'Untitled',
      excerpt: post.insights_translations[0].excerpt || '',
      content: post.insights_translations[0].content || '',
      category: category, // Use the passed category parameter
      author: post.author || 'Advisable Team',
      published_date: post.published_date || new Date().toISOString(),
      featured_image: post.featured_image,
      language_code: language_code,
    })) || [];
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    return [];
  }
};
