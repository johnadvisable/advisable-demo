
import { supabase } from "@/integrations/supabase/client";

export type HeroContent = {
  id: string;
  page_name: string;
  heading: string;
  subheading: string | null;
  cta_text: string | null;
  cta_link: string | null;
  background_type: string | null;
  background_image: string | null;
  background_video: string | null;
  desktop_video_id?: string | null;
  mobile_video_id?: string | null;
  bunny_video_desktop?: string | null;
  bunny_video_mobile?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export const fetchHeroContents = async (): Promise<HeroContent[]> => {
  const { data, error } = await supabase
    .from("hero_content")
    .select("*")
    .order("page_name");

  if (error) {
    console.error("Error fetching hero content:", error);
    throw error;
  }

  const formattedData: HeroContent[] = data?.map(item => ({
    id: item.id,
    page_name: item.page_name,
    heading: (item as any).heading || 'Default Heading',
    subheading: (item as any).subheading,
    cta_text: (item as any).cta_text,
    cta_link: item.cta_link,
    background_type: item.background_type,
    background_image: item.background_image,
    background_video: item.background_video,
    desktop_video_id: item.desktop_video_id,
    mobile_video_id: item.mobile_video_id,
    bunny_video_desktop: item.bunny_video_desktop,
    bunny_video_mobile: item.bunny_video_mobile,
    created_at: item.created_at,
    updated_at: item.updated_at
  })) || [];

  return formattedData;
};

export const fetchHeroContent = async (id: string): Promise<HeroContent | null> => {
  const { data, error } = await supabase
    .from("hero_content")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error(`Error fetching hero content with id ${id}:`, error);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    page_name: data.page_name,
    heading: (data as any).heading || 'Default Heading',
    subheading: (data as any).subheading,
    cta_text: (data as any).cta_text,
    cta_link: data.cta_link,
    background_type: data.background_type,
    background_image: data.background_image,
    background_video: data.background_video,
    desktop_video_id: data.desktop_video_id,
    mobile_video_id: data.mobile_video_id,
    bunny_video_desktop: data.bunny_video_desktop,
    bunny_video_mobile: data.bunny_video_mobile,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

/**
 * Fetch hero content by page name with translations
 */
export const fetchHeroContentByPage = async (pageName: string, languageCode: string = 'en'): Promise<HeroContent | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_hero_content_by_page_with_translation', {
        p_page_name: pageName,
        p_language_code: languageCode
      });

    if (error) {
      console.error(`Error fetching hero content for page ${pageName}:`, error);
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error in fetchHeroContentByPage:', error);
    throw error;
  }
};

export const updateHeroContent = async (heroContent: HeroContent): Promise<void> => {
  const { error } = await supabase
    .from("hero_content")
    .update({
      cta_link: heroContent.cta_link,
      background_type: heroContent.background_type,
      background_image: heroContent.background_image,
      background_video: heroContent.background_video,
      desktop_video_id: heroContent.desktop_video_id,
      mobile_video_id: heroContent.mobile_video_id,
      bunny_video_desktop: heroContent.bunny_video_desktop,
      bunny_video_mobile: heroContent.bunny_video_mobile,
      updated_at: new Date().toISOString(),
    })
    .eq("id", heroContent.id);

  if (error) {
    console.error("Error updating hero content:", error);
    throw error;
  }
};

export const createHeroContent = async (heroContent: HeroContent): Promise<void> => {
  const { error } = await supabase.from("hero_content").insert([
    {
      page_name: heroContent.page_name,
      cta_link: heroContent.cta_link,
      background_type: heroContent.background_type,
      background_image: heroContent.background_image,
      background_video: heroContent.background_video,
      desktop_video_id: heroContent.desktop_video_id,
      mobile_video_id: heroContent.mobile_video_id,
      bunny_video_desktop: heroContent.bunny_video_desktop,
      bunny_video_mobile: heroContent.bunny_video_mobile,
    },
  ]);

  if (error) {
    console.error("Error creating hero content:", error);
    throw error;
  }
};

export const deleteHeroContent = async (id: string): Promise<void> => {
  const { error } = await supabase.from("hero_content").delete().eq("id", id);

  if (error) {
    console.error("Error deleting hero content:", error);
    throw error;
  }
};
