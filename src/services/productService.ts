
import { supabase } from '@/integrations/supabase/client';

export type Product = {
  id: string;
  title: string;
  description: string;
  website_url: string;
  slug: string;
  image_url: string | null;
  hero_image: string | null;
  display_order: number;
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
};

export const getProducts = async (languageCode: string): Promise<Product[]> => {
  const { data: products, error } = await supabase
    .rpc('get_all_products_with_translation', { p_language_code: languageCode });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  if (!products) {
    return [];
  }

  // Transform the data to match the Product type
  return products.map(product => ({
    id: product.id,
    title: product.title || '',
    description: product.description || '',
    website_url: product.website_url,
    slug: product.slug,
    image_url: product.image_url,
    hero_image: product.hero_image,
    display_order: product.display_order,
    page_title: product.page_title || null,
    page_subtitle: product.page_subtitle || null,
    page_description: product.page_description || null,
    page_background_color: product.page_background_color || '',
    highlight_color: product.highlight_color || '',
    features: (product.features as any[]) || [],
    stats: (product.stats as any[]) || [],
    testimonials: (product.testimonials as any[]) || [],
    cta_section_title: product.cta_section_title || null,
    cta_section_description: product.cta_section_description || null,
    cta_button_text: product.cta_button_text || null
  }));
};

export const getProductBySlug = async (slug: string, languageCode: string): Promise<Product | null> => {

  try {

    const rpcResult = await supabase.rpc('get_product_by_slug_with_translation', { 
      p_slug: slug, 
      p_language_code: languageCode 
    });

    // If RPC fails or returns empty, use fallback
    if (rpcResult.error || !rpcResult.data || (Array.isArray(rpcResult.data) && rpcResult.data.length === 0)) {

      // Get language ID
      const { data: language } = await supabase
        .from('languages')
        .select('id')
        .eq('code', languageCode)
        .single();

      const languageId = language?.id || 1;

      // Get base product
      const { data: productBase, error: baseError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (baseError || !productBase) {
        console.error('❌ ProductService: Product not found:', baseError);
        return null;
      }

      // Get translation
      const { data: translation } = await supabase
        .from('product_translations')
        .select('*')
        .eq('product_id', productBase.id)
        .eq('language_id', languageId)
        .maybeSingle();

      // Combine data
      const combinedProduct = {
        id: productBase.id,
        title: translation?.title || productBase.slug || '',
        description: translation?.description || '',
        website_url: productBase.website_url,
        slug: productBase.slug,
        image_url: productBase.image_url,
        hero_image: productBase.hero_image,
        display_order: productBase.display_order,
        page_title: translation?.page_title || null,
        page_subtitle: translation?.page_subtitle || null,
        page_description: translation?.page_description || null,
        page_background_color: productBase.page_background_color || '',
        highlight_color: productBase.highlight_color || '',
        features: (productBase.features as any[]) || [],
        stats: (productBase.stats as any[]) || [],
        testimonials: (productBase.testimonials as any[]) || [],
        cta_section_title: translation?.cta_section_title || null,
        cta_section_description: translation?.cta_section_description || null,
        cta_button_text: translation?.cta_button_text || null,
      };

      return combinedProduct;
    }

    // RPC succeeded
    const product = rpcResult.data;
    const productData = Array.isArray(product) ? product[0] : product;
    
    if (!productData) {
      console.warn(`⚠️ ProductService: No product data found with slug: ${slug}`);
      return null;
    }

    return {
      id: productData.id,
      title: productData.title || '',
      description: productData.description || '',
      website_url: productData.website_url,
      slug: productData.slug,
      image_url: productData.image_url,
      hero_image: productData.hero_image,
      display_order: productData.display_order,
      page_title: productData.page_title || null,
      page_subtitle: productData.page_subtitle || null,
      page_description: productData.page_description || null,
      page_background_color: productData.page_background_color || '',
      highlight_color: productData.highlight_color || '',
      features: (productData.features as any[]) || [],
      stats: (productData.stats as any[]) || [],
      testimonials: (productData.testimonials as any[]) || [],
      cta_section_title: productData.cta_section_title,
      cta_section_description: productData.cta_section_description,
      cta_button_text: productData.cta_button_text,
    };
  } catch (err) {
    console.error(`💥 ProductService: Exception fetching product with slug ${slug}:`, err);
    return null;
  }
};

