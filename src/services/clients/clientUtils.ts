
import { getPlaceholderImage } from "@/utils/fileUtils";
import { Client } from "./types";

// Format client data from database response
export const formatClientData = (data: any): Client => {
  // Get the translated fields from clients_translations
  const translatedData = data.clients_translations?.[0] || {};
  
  // Extract categories from the client_categories relationship
  const categories = data.client_categories?.map((cat: any) => cat.category) || [];
  
  return {
    id: data.id,
    name: translatedData.name || data.name,
    logo: data.logo || getPlaceholderImage(data.name),
    slug: data.slug || '',
    description: translatedData.description || data.description,
    background_image: data.background_image,
    website: data.website,
    featured: data.featured,
    industry: data.industry,
    country: data.country,
    product_category: data.product_category,
    product_categories: categories.length > 0 ? categories : (data.product_category ? [data.product_category] : []),
    case_study_challenge: translatedData.case_study_challenge || data.case_study_challenge,
    case_study_solution: translatedData.case_study_solution || data.case_study_solution,
    case_study_team_size: data.case_study_team_size,
    case_study_timeline: data.case_study_timeline,
    case_study_images: data.case_study_images || [],
    case_study_videos: data.case_study_videos || [],
    case_study_results: data.case_study_results || [],
    display_order: data.display_order || 0,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Format multiple clients from database
export const formatClientsData = (data: any[]): Client[] => {
  return data.map(client => formatClientData(client));
};
