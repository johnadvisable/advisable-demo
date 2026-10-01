import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type SeoService = {
  slug: string;
  title: string;
  short_description?: string;
};

export const useSeoOnlyServices = (categorySlug: string, language: string) => {
  return useQuery({
    queryKey: ['seoOnlyServices', categorySlug, language],
    queryFn: async (): Promise<SeoService[]> => {
      const { data, error } = await supabase
        .from('services')
        .select(`
          slug,
          service_translations!inner(title, short_description),
          service_categories!inner(slug)
        `)
        .eq('is_seo_only', true)
        .eq('service_categories.slug', categorySlug)
        .eq('service_translations.language_id', 
          language === 'en' ? 1 : language === 'es' ? 2 : language === 'el' ? 3 : language === 'de' ? 4 : language === 'fr' ? 5 : language === 'it' ? 6 : 1
        )
        .order('slug');

      if (error) {
        console.error('[useSeoOnlyServices] Error:', error);
        return [];
      }

      return (data || []).map((s: any) => ({
        slug: s.slug,
        title: s.service_translations?.[0]?.title || s.slug,
        short_description: s.service_translations?.[0]?.short_description || '',
      })).sort((a: SeoService, b: SeoService) => a.title.localeCompare(b.title));
    },
    enabled: !!categorySlug,
    staleTime: 10 * 60 * 1000,
  });
};
