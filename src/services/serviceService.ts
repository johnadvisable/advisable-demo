import { supabase } from '@/integrations/supabase/client';

export type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  seo_title?: string | null;
  seo_description?: string | null;
  hero_image?: string | null;
  icon_name?: string | null;
};

export type Service = {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  icon_name: string | null;
  short_description: string;
  description: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  display_order: number;
  featured_image?: string | null;
  child_services_intro?: string | null;
  seo_h2_title?: string | null;
};

export const getServiceBySlug = async (slug: string, language = 'en'): Promise<Service | null> => {

  try {
    const { data, error } = await supabase
      .rpc('get_service_by_slug_simple', { p_slug: slug, p_language_code: language });

    if (error) {
      console.error(`[ServiceService] Database error for slug ${slug}:`, error);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn(`[ServiceService] No service found with slug: ${slug}`);
      return null;
    }

    const service = data[0];

    return {
      id: service.id,
      category_id: service.category_id,
      title: service.title,
      slug: service.slug,
      icon_name: service.icon_name,
      short_description: service.short_description,
      description: service.long_description,
      seo_title: service.seo_title,
      meta_description: service.meta_description,
      display_order: service.display_order,
      featured_image: service.featured_image,
      child_services_intro: service.child_services_intro,
      seo_h2_title: service.seo_h2_title,
    };
  } catch (err) {
    console.error(`[ServiceService] Exception fetching service with slug ${slug}:`, err);
    return null;
  }
};

export const getServiceCategoryBySlug = async (slug: string, language = 'en'): Promise<ServiceCategory | null> => {
  try {
    // First get the category with SEO fields directly
    const { data: categoryData, error: categoryError } = await supabase
      .from('service_categories')
      .select('id, slug, name, description, seo_title, seo_description, hero_image, icon_name')
      .eq('slug', slug)
      .single();

    if (categoryError || !categoryData) {
      console.error(`[ServiceService] Database error for category slug ${slug}:`, categoryError);
      return null;
    }

    // Try to get translation if not English
    if (language !== 'en') {
      const { data: langData } = await supabase
        .from('languages')
        .select('id')
        .eq('code', language)
        .single();

      if (langData) {
        const { data: translationData } = await supabase
          .from('service_category_translations')
          .select('name, description')
          .eq('service_category_id', categoryData.id)
          .eq('language_id', langData.id)
          .single();

        if (translationData) {
          return {
            id: categoryData.id,
            slug: categoryData.slug,
            name: translationData.name || categoryData.name || '',
            description: translationData.description || categoryData.description || '',
            seo_title: categoryData.seo_title,
            seo_description: categoryData.seo_description,
            hero_image: categoryData.hero_image,
            icon_name: categoryData.icon_name,
          };
        }
      }
    }

    return {
      id: categoryData.id,
      slug: categoryData.slug,
      name: categoryData.name || '',
      description: categoryData.description || '',
      seo_title: categoryData.seo_title,
      seo_description: categoryData.seo_description,
      hero_image: categoryData.hero_image,
      icon_name: categoryData.icon_name,
    };
  } catch (err) {
    console.error(`[ServiceService] Exception fetching category with slug ${slug}:`, err);
    return null;
  }
};

export const getServicesByCategorySlug = async (categorySlug: string, language = 'en'): Promise<Service[]> => {

  try {
    const { data, error } = await supabase
      .rpc('get_services_by_category_simple', { p_category_slug: categorySlug, p_language: language });

    if (error) {
      console.error(`[ServiceService] Database error for category services ${categorySlug}:`, error);
      return [];
    }

    if (!data) {
      console.warn(`[ServiceService] No services found for category: ${categorySlug}`);
      return [];
    }

    return data.map(service => ({
      id: service.id,
      category_id: service.category_id,
      title: service.title,
      slug: service.slug,
      icon_name: service.icon_name,
      short_description: service.short_description,
      description: service.description,
      display_order: service.display_order,
      featured_image: service.featured_image,
    }));
  } catch (err) {
    console.error(`[ServiceService] Exception fetching services for category ${categorySlug}:`, err);
    return [];
  }
};