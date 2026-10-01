import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ChildService {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  icon_name: string | null;
  display_order: number;
  featured_image: string | null;
}

export const useChildServices = (parentServiceId: string | undefined, categorySlug: string, language: string = 'en') => {
  return useQuery({
    queryKey: ['childServices', parentServiceId, categorySlug, language],
    queryFn: async () => {
      if (!parentServiceId) return [];

      // Use the existing hierarchical services RPC
      const { data, error } = await supabase
        .rpc('get_services_hierarchical', { 
          p_category_slug: categorySlug, 
          p_language: language 
        });

      if (error) {
        console.error('Error fetching child services:', error);
        return [];
      }

      // Filter to get only children of this parent
      const children = (data || []).filter((s: any) => 
        !s.is_parent && s.parent_service_id === parentServiceId
      ).sort((a: any, b: any) => a.display_order - b.display_order);

      return children.map((s: any) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        short_description: s.short_description,
        icon_name: s.icon_name,
        display_order: s.display_order,
        featured_image: s.featured_image,
      })) as ChildService[];
    },
    enabled: !!parentServiceId && !!categorySlug,
    staleTime: 15 * 60 * 1000,
    gcTime: 45 * 60 * 1000,
  });
};
