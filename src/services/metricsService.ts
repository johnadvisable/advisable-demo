import { supabase } from '@/integrations/supabase/client';

export type Metric = {
  id: string;
  key: string;
  value: number;
  translations: {
    label: string;
    description: string;
  };
  created_at?: string;
  updated_at?: string;
};

// Get all metrics with translations using RPC function
export const getAllMetrics = async (languageCode: string): Promise<Metric[]> => {
  const { data, error } = await supabase.rpc('get_all_metrics_with_translation', {
    p_language_code: languageCode
  });
  
  if (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }
  
  // Transform the data to match our Metric type
  const transformedData = (data || []).map((metric: any) => ({
    id: metric.id,
    key: metric.key,
    value: metric.value,
    translations: {
      label: metric.label || '',
      description: metric.description || ''
    },
    created_at: metric.created_at || undefined,
    updated_at: metric.updated_at || undefined
  }));
  
  return transformedData;
};

// Get metric by ID
export const getMetricById = async (id: string, languageId: number): Promise<Metric | null> => {
  const { data, error } = await supabase
    .from('metrics')
    .select(`
      *,
      translations:metric_translations!inner(
        label,
        description
      )
    `)
    .eq('id', id)
    .eq('metric_translations.language_id', languageId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching metric by ID:', error);
    return null;
  }
  
  if (!data) {
    console.error('Metric not found');
    return null;
  }
  
  // Transform the data to match our Metric type
  const transformedData = {
    id: data.id,
    key: data.key,
    value: data.value,
    translations: {
      label: (data.translations[0] || {}).label || '',
      description: (data.translations[0] || {}).description || ''
    },
    created_at: data.created_at || undefined,
    updated_at: data.updated_at || undefined
  };
  
  return transformedData;
};

// Save (create or update) a metric
export const saveMetric = async (metric: Partial<Metric> & { languageId: number }): Promise<{ data: Metric | null, error: Error | null }> => {

  try {
    // Ensure required fields are present
    if (!metric.key || !metric.translations?.label || metric.value === undefined) {
      throw new Error("Metric key, label, and value are required");
    }
    
    // Prepare metric data
    const metricData = {
      key: metric.key,
      value: metric.value,
    };
    
    // For existing metric
    if (metric.id) {

      // Update base metric data
      const { data, error } = await supabase
        .from('metrics')
        .update(metricData)
        .eq('id', metric.id)
        .select();
      
      if (error) {
        console.error("Error updating metric:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error("Failed to update metric: No data returned");
      }

      // Check if translation exists
      const { data: existingTranslation, error: checkError } = await supabase
        .from('metric_translations')
        .select('id')
        .eq('metric_id', metric.id)
        .eq('language_id', metric.languageId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingTranslation) {
        // Update existing translation
        const { error: transError } = await supabase
          .from('metric_translations')
          .update({
            label: metric.translations.label,
            description: metric.translations.description
          })
          .eq('id', existingTranslation.id);

        if (transError) throw transError;
      } else {
        // Insert new translation
        const { error: transError } = await supabase
          .from('metric_translations')
          .insert({
            metric_id: metric.id,
            language_id: metric.languageId,
            label: metric.translations.label,
            description: metric.translations.description
          });

        if (transError) throw transError;
      }
      
      return { 
        data: { 
          ...data[0], 
          translations: { label: metric.translations.label, description: metric.translations.description },
          created_at: data[0].created_at || undefined,
          updated_at: data[0].updated_at || undefined
        }, 
        error: null 
      };
    } 
    // For new metric
    else {

      // Insert base metric data
      const { data, error } = await supabase
        .from('metrics')
        .insert(metricData)
        .select();
      
      if (error) {
        console.error("Error creating metric:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error("Failed to create metric: No data returned");
      }

      // Insert translation
      const { error: transError } = await supabase
        .from('metric_translations')
        .insert({
          metric_id: data[0].id,
          language_id: metric.languageId,
          label: metric.translations.label,
          description: metric.translations.description
        });

      if (transError) throw transError;
      
      return { 
        data: { 
          ...data[0], 
          translations: { label: metric.translations.label, description: metric.translations.description },
          created_at: data[0].created_at || undefined,
          updated_at: data[0].updated_at || undefined
        }, 
        error: null 
      };
    }
  } catch (error: any) {
    console.error("Error in saveMetric function:", error);
    return { data: null, error };
  }
};

// Delete a metric
export const deleteMetric = async (id: string): Promise<{ success: boolean, error: Error | null }> => {

  try {
    const { error } = await supabase
      .from('metrics')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting metric:", error);
      throw error;
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error in deleteMetric function:", error);
    return { success: false, error };
  }
};
