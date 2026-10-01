import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HierarchicalService {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  icon_name: string | null;
  is_parent: boolean;
  parent_service_id: string | null;
  parent_slug: string | null;
  display_order: number;
  featured_image: string | null;
}

export interface ServiceGroup {
  parent: HierarchicalService;
  children: HierarchicalService[];
}

export const useHierarchicalServices = (categorySlug: string, language: string = 'en') => {
  return useQuery({
    queryKey: ['hierarchicalServices', categorySlug, language],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_services_hierarchical', { 
          p_category_slug: categorySlug, 
          p_language: language 
        });

      if (error) {
        console.error('Error fetching hierarchical services:', error);
        throw error;
      }

      // Group services by parent
      const services = data as HierarchicalService[];
      const parents = services.filter(s => s.is_parent);
      const children = services.filter(s => !s.is_parent);

      const groups: ServiceGroup[] = parents.map(parent => ({
        parent,
        children: children.filter(child => child.parent_slug === parent.slug)
          .sort((a, b) => a.display_order - b.display_order)
      }));

      return {
        groups,
        allServices: services,
        parents,
        children
      };
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 45 * 60 * 1000, // 45 minutes
  });
};

export const useParentServices = (categorySlug: string, language: string = 'en') => {
  const { data, ...rest } = useHierarchicalServices(categorySlug, language);
  return {
    data: data?.parents || [],
    groups: data?.groups || [],
    ...rest
  };
};
