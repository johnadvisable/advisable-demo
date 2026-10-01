
export type Client = {
  id: string;
  name: string;
  logo: string;
  slug?: string;
  background_image: string | null;
  description: string | null;
  website: string | null;
  industry: string | null;
  country: string | null;
  product_category: string;
  product_categories?: string[];
  featured: boolean;
  case_study_challenge: string | null;
  case_study_solution: string | null;
  case_study_team_size: string | null;
  case_study_timeline: string | null;
  case_study_images: any[] | null;
  case_study_videos: any[] | null;
  case_study_results: any[] | null;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
};

// For API responses from the /client-categories endpoint
export type ClientCategory = string;
