// Phase 2: Unified Products Service - RPC-based with proper error handling
import { supabase } from '@/integrations/supabase/client';
import { uploadFile } from '@/utils/fileUtils';

export interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  hero_image: string | null;
  website_url: string;
  display_order: number;
  slug: string;
  page_title: string | null;
  page_subtitle: string | null;
  page_description: string | null;
  page_background_color: string;
  highlight_color: string;
  features: Array<{icon: string, title: string, description: string}>;
  stats: Array<{value: string, label: string}>;
  testimonials: Array<{name: string, role: string, text: string}>;
  cta_section_title: string | null;
  cta_section_description: string | null;
  cta_button_text: string | null;
}

export interface ProductSaveResult {
  success: boolean;
  productId?: string;
  error?: Error;
}

export interface ProductDeleteResult {
  success: boolean;
  error?: Error;
}

// Get all products with enhanced RPC
export const getUnifiedProductsForAdmin = async (languageCode: string = 'en'): Promise<Product[]> => {
  try {
    const { data, error } = await supabase.rpc('get_all_products_with_translation', {
      p_language_code: languageCode
    });

    if (error) throw error;
    return (data || []) as Product[];
  } catch (error) {
    console.error('Error fetching products for admin:', error);
    throw error;
  }
};

// Get single product by ID with translation
export const getUnifiedProductById = async (productId: string, languageCode: string = 'en'): Promise<Product | null> => {
  try {
    const { data, error } = await supabase.rpc('get_product_with_translation', {
      p_product_id: productId,
      p_language_code: languageCode
    });

    if (error) throw error;
    return (data?.[0] || null) as Product | null;
  } catch (error) {
    console.error('Error fetching product with translation:', error);
    throw error;
  }
};

// Get product by slug - using existing function but with better error handling
export const getUnifiedProductBySlug = async (slug: string, languageCode: string = 'en'): Promise<Product | null> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        website_url,
        slug,
        image_url,
        hero_image,
        display_order,
        page_background_color,
        highlight_color,
        features,
        stats,
        testimonials,
        product_translations(
          title,
          description,
          page_title,
          page_subtitle,
          page_description,
          cta_section_title,
          cta_section_description,
          cta_button_text,
          language:languages(code)
        )
      `)
      .eq('slug', slug)
      .maybeSingle(); // Use maybeSingle instead of single to avoid crashes

    if (error) {
      console.error('Error fetching product by slug:', error);
      return null;
    }

    if (!products) {
      return null;
    }

    // Find translation for current language, fallback to English if not found
    const translation = products.product_translations?.find(
      t => t.language?.code === languageCode
    ) || products.product_translations?.find(
      t => t.language?.code === 'en'
    ) || products.product_translations?.[0];

    return {
      id: products.id,
      title: translation?.title || '',
      description: translation?.description || '',
      website_url: products.website_url,
      slug: products.slug,
      image_url: products.image_url || null,
      hero_image: products.hero_image || null,
      display_order: products.display_order,
      page_title: translation?.page_title || null,
      page_subtitle: translation?.page_subtitle || null,
      page_description: translation?.page_description || null,
      page_background_color: products.page_background_color || 'advisable-darkPurple',
      highlight_color: products.highlight_color || 'advisable-purple',
      features: (products.features as any[]) || [],
      stats: (products.stats as any[]) || [],
      testimonials: (products.testimonials as any[]) || [],
      cta_section_title: translation?.cta_section_title || null,
      cta_section_description: translation?.cta_section_description || null,
      cta_button_text: translation?.cta_button_text || null
    };
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null; // Return null instead of throwing to prevent crashes
  }
};

// Save product with translations and proper file handling
export const saveUnifiedProduct = async (
  productData: Partial<Product>, 
  translations: Record<string, any>,
  files: { image?: File | null, hero_image?: File | null } = {}
): Promise<ProductSaveResult> => {
  try {
    // Handle file uploads first
    let imageUrl = productData.image_url || '';
    let heroImageUrl = productData.hero_image || '';

    if (files.image) {
      try {
        const uploadResult = await uploadFile(files.image, 'product-images');
        if (uploadResult) {
          imageUrl = uploadResult;
        }
      } catch (uploadError) {
        console.warn('Image upload failed, continuing without:', uploadError);
      }
    }

    if (files.hero_image) {
      try {
        const uploadResult = await uploadFile(files.hero_image, 'product-hero-images');
        if (uploadResult) {
          heroImageUrl = uploadResult;
        }
      } catch (uploadError) {
        console.warn('Hero image upload failed, continuing without:', uploadError);
      }
    }

    // Prepare core product data (non-translatable fields)
    // Ensure required fields are not undefined
    if (!productData.website_url || !productData.slug) {
      throw new Error('Website URL and slug are required for product');
    }

    const coreData = {
      website_url: productData.website_url,
      slug: productData.slug,
      image_url: imageUrl || null,
      hero_image: heroImageUrl || null,
      display_order: productData.display_order || 0,
      page_background_color: productData.page_background_color || 'advisable-darkPurple',
      highlight_color: productData.highlight_color || 'advisable-purple',
      features: productData.features || [],
      stats: productData.stats || [],
      testimonials: productData.testimonials || []
    };

    let productId = productData.id;

    // Save or update core product data
    if (productId) {
      const { error } = await supabase
        .from('products')
        .update(coreData)
        .eq('id', productId);
      
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert(coreData)
        .select('id')
        .single();
      
      if (error) throw error;
      productId = data.id;
    }

    // Save translations for each language
    for (const [languageCode, translationData] of Object.entries(translations)) {
      if (!translationData || !productId) continue;

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
        .from('product_translations')
        .upsert({
          product_id: productId,
          language_id: languageData.id,
          title: translationData.title,
          description: translationData.description,
          page_title: translationData.page_title,
          page_subtitle: translationData.page_subtitle,
          page_description: translationData.page_description,
          cta_section_title: translationData.cta_section_title,
          cta_section_description: translationData.cta_section_description,
          cta_button_text: translationData.cta_button_text
        }, {
          onConflict: 'product_id,language_id'
        });

      if (translationError) {
        console.error(`Error saving translation for ${languageCode}:`, translationError);
      }
    }

    return { success: true, productId };
  } catch (error) {
    console.error('Error saving product with translations:', error);
    return { success: false, error: error as Error };
  }
};

// Delete product with proper cleanup
export const deleteUnifiedProduct = async (productId: string): Promise<ProductDeleteResult> => {
  try {
    // Delete in correct order due to foreign key constraints
    // 1. Delete translations
    await supabase
      .from('product_translations')
      .delete()
      .eq('product_id', productId);

    // 2. Delete main product record
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting product completely:', error);
    return { success: false, error: error as Error };
  }
};