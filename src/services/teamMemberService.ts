import { supabase } from "@/integrations/supabase/client";

export type TeamMember = {
  id: string;
  name: string;
  job_position: string;
  bio: string | null;
  image_url: string | null;
  // SECURITY: All personal social media removed from public access for maximum privacy protection
  // linkedin_url, twitter_url, github_url, instagram_url are now completely removed
  display_order: number | null;
  is_leadership: boolean | null;
  role_description: string | null;
  achievements: string[] | null;
  specializations: string[] | null;
};

// Frontend override for specific team members (until DB is updated)
const IMAGE_OVERRIDES: Record<string, string> = {
  'marios akrivos': '/images/team/marios-akrivos.jpg?v=2',
};

const applyImageOverrides = <T extends { name?: string | null; image_url?: string | null }>(
  members: T[]
): T[] =>
  members.map((m) => {
    const key = (m?.name ?? '').trim().toLowerCase();
    return key && IMAGE_OVERRIDES[key]
      ? { ...m, image_url: IMAGE_OVERRIDES[key] }
      : m;
  });

export const getAllTeamMembers = async (language: string = 'en'): Promise<TeamMember[]> => {
  const { data, error } = await supabase.rpc('get_all_team_members_public', {
    p_language_code: language
  });

  if (error) {
    console.error("Error fetching team members:", error);
    throw new Error(error.message);
  }

  return applyImageOverrides(data || []);
};


// Admin-only function that includes sensitive personal information
export const getAllTeamMembersAdmin = async (language: string = 'en') => {
  const { data, error } = await supabase.rpc('get_all_team_members_admin', {
    p_language_code: language
  });

  if (error) {
    console.error("Error fetching team members (admin):", error);
    throw new Error(error.message);
  }

  return applyImageOverrides(data || []);
};
