import { supabase } from '@/integrations/supabase/client';

export type CompanyInfo = {
  id: string;
  title?: string;
  content?: string;
  mission?: string;
  vision?: string;
  history?: string;
  approach?: string;
  team_intro?: string;
  founded_year?: number;
  image_url?: string;
};

export type CompanyValue = {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number | null;
};

export const fetchCompanyInfo = async (languageCode: string = 'en'): Promise<CompanyInfo> => {
  try {
    const { data, error } = await supabase.rpc('get_all_company_info_with_translation', {
      p_language_code: languageCode
    });

    if (error) {
      console.error('Error fetching company info:', error);
      throw error;
    }

    // Return the first (and only) result from the RPC function
    const companyData = data?.[0];
    
    if (!companyData) {
      console.warn('No company info found in database');
      return {
        id: '',
        title: 'Advisable',
        content: '',
        mission: '',
        vision: '',
        history: '',
        approach: '',
        team_intro: '',
        founded_year: undefined,
        image_url: undefined
      };
    }

    return {
      id: companyData.id,
      title: companyData.title || 'Advisable',
      content: companyData.content || '',
      mission: companyData.mission || '',
      vision: companyData.vision || '',
      history: companyData.history || '',
      approach: companyData.approach || '',
      team_intro: companyData.team_intro || '',
        founded_year: companyData.founded_year ?? undefined,
        image_url: companyData.image_url ?? undefined
    };
  } catch (error) {
    console.error('Error fetching company info:', error);
    // Return default data if there's an error
    return {
      id: '',
      title: 'Advisable',
      content: '',
      mission: '',
      vision: '',
      history: '',
      approach: '',
      team_intro: '',
      founded_year: undefined,
      image_url: undefined
    };
  }
};

export const updateCompanyInfo = async (data: Partial<CompanyInfo>, languageCode: string = 'en'): Promise<void> => {
  try {
    // First get the language ID for the provided language code
    const { data: languageData, error: langError } = await supabase
      .from('languages')
      .select('id')
      .eq('code', languageCode)
      .single();

    if (langError) throw langError;

    // Update base company info
    const baseData = {
      founded_year: data.founded_year,
      image_url: data.image_url,
    };

    const { error: updateError } = await supabase
      .from('company_info')
      .update(baseData)
      .eq('id', data.id!);

    if (updateError) throw updateError;

    // Check if translation exists
    const { data: existingTranslation, error: checkError } = await supabase
      .from('company_info_translations')
      .select('id')
      .eq('company_info_id', data.id!)
      .eq('language_id', languageData.id)
      .maybeSingle();

    if (checkError) throw checkError;

    const translationData = {
      title: data.title,
      content: data.content,
      mission: data.mission,
      vision: data.vision,
      history: data.history,
      approach: data.approach,
      team_intro: data.team_intro,
    };

    if (existingTranslation) {
      // Update existing translation
      const { error: transError } = await supabase
        .from('company_info_translations')
        .update(translationData)
        .eq('id', existingTranslation.id);

      if (transError) throw transError;
    } else {
      // Insert new translation
      const { error: transError } = await supabase
        .from('company_info_translations')
        .insert({
          company_info_id: data.id!,
          language_id: languageData.id,
          ...translationData
        });

      if (transError) throw transError;
    }
  } catch (error) {
    console.error('Error updating company info:', error);
    throw error;
  }
};

// Content templates for auto-population
const COMPANY_STORY_CONTENT = {
  en: `Advisable was founded in 2015 by Vasilis Kallaras (CEO) and Panos Kallaras (COO). We started as a Digital Agency, aiming to empower eCommerce with innovative solutions. Our first product, ECOMMERCEN, evolved into an award-winning eCommerce platform, helping hundreds of businesses grow online.

Over the years, Advisable transformed into a Technology Provider, focusing on data-driven & AI-powered products such as Recommendable, SizeTheMarket, and Esyntagi.

With offices in Athens and Patras, we have delivered over 250+ projects to clients across over 4 countries, monitoring over €200M+ in digital revenue annually. We continue to deliver technology solutions that create real impact and measurable value for our partners.`,
  el: `Η Advisable ιδρύθηκε το 2015 από τους Βασίλη Καλλάρα (CEO) και Πάνο Καλλάρα (COO). Ξεκινήσαμε ως Digital Agency με στόχο να ενδυναμώσουμε το ηλεκτρονικό εμπόριο μέσα από καινοτόμες λύσεις. Το πρώτο μας προϊόν, το ECOMMERCEN, εξελίχθηκε σε πολυβραβευμένη πλατφόρμα eCommerce, βοηθώντας εκατοντάδες επιχειρήσεις να αναπτυχθούν online.

Στα χρόνια που ακολούθησαν, η Advisable μεταμορφώθηκε σε Technology Provider, δίνοντας έμφαση σε data-driven & AI προϊόντα όπως το Recommendable, το SizeTheMarket και το Esyntagi.

Με γραφεία σε Αθήνα και Πάτρα, έχουμε παραδώσει πάνω από 250+ έργα σε πελάτες σε πάνω από 4 χώρες, παρακολουθώντας άνω των 200M+ € digital revenue ετησίως. Συνεχίζουμε να δημιουργούμε τεχνολογικές λύσεις με πραγματικό αντίκτυπο και αξία για τους συνεργάτες μας.`
};

const COMPANY_VALUES_DATA = [
  {
    title: { 
      en: 'Innovation First', 
      el: 'Innovation First' 
    },
    description: { 
      en: 'Innovation is in our DNA.', 
      el: 'Η καινοτομία είναι στο DNA μας.' 
    },
    icon_name: 'Lightbulb',
    display_order: 1
  },
  {
    title: { 
      en: 'Data-Driven Decisions', 
      el: 'Data-Driven Decisions' 
    },
    description: { 
      en: 'We measure success with KPIs and tangible results.', 
      el: 'Μετράμε την επιτυχία μας με KPIs και απτά αποτελέσματα.' 
    },
    icon_name: 'BarChart3',
    display_order: 2
  },
  {
    title: { 
      en: 'Trust & Collaboration', 
      el: 'Trust & Collaboration' 
    },
    description: { 
      en: 'We build long-lasting relationships based on transparency and trust.', 
      el: 'Χτίζουμε διαρκείς σχέσεις εμπιστοσύνης με τους πελάτες μας.' 
    },
    icon_name: 'Handshake',
    display_order: 3
  },
  {
    title: { 
      en: 'Excellence in Execution', 
      el: 'Excellence in Execution' 
    },
    description: { 
      en: 'We strive for top quality in every project.', 
      el: 'Δίνουμε προσοχή στη λεπτομέρεια σε κάθε project.' 
    },
    icon_name: 'Target',
    display_order: 4
  },
  {
    title: { 
      en: 'Growth Mindset', 
      el: 'Growth Mindset' 
    },
    description: { 
      en: 'We continuously evolve, investing in new technologies and people.', 
      el: 'Εξελισσόμαστε συνεχώς, επενδύοντας σε νέες τεχνολογίες και ανθρώπους.' 
    },
    icon_name: 'TrendingUp',
    display_order: 5
  }
];

// Transform COMPANY_VALUES_DATA to fallback format
const getFallbackCompanyValues = (languageCode: string = 'en'): CompanyValue[] => {
  return COMPANY_VALUES_DATA.map((value, index) => ({
    id: `fallback-${index + 1}`,
    title: value.title[languageCode as keyof typeof value.title] || value.title.en,
    description: value.description[languageCode as keyof typeof value.description] || value.description.en,
    icon_name: value.icon_name,
    display_order: value.display_order
  }));
};

export const fetchCompanyValues = async (languageCode: string = 'en'): Promise<CompanyValue[]> => {
  try {
    const { data, error } = await supabase.rpc('get_all_company_values_with_translation', {
      p_language_code: languageCode
    });

    if (error) {
      console.error('Error fetching company values:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No company values found in database, returning fallback data');
      return getFallbackCompanyValues(languageCode);
    }

    return data.map((value: any) => ({
      id: value.id,
      title: value.title || '',
      description: value.description || '',
      icon_name: value.icon_name || 'Star',
      display_order: value.display_order || 0
    }));
  } catch (error) {
    console.error('Error fetching company values:', error);
    return getFallbackCompanyValues(languageCode);
  }
};

// Enhanced update function that auto-populates content for all languages
export const updateCompanyInfoWithAutoContent = async (data: Partial<CompanyInfo>, languageCode: string = 'en'): Promise<void> => {
  try {
    // First, get all active languages
    const { data: languagesData, error: languagesError } = await supabase
      .from('languages')
      .select('*')
      .eq('is_active', true);

    if (languagesError) throw languagesError;

    // Get the base company info ID
    let companyInfoId = data.id;
    
    // If no ID exists, create the base company info record
    if (!companyInfoId) {
      const { data: newCompanyData, error: createError } = await supabase
        .from('company_info')
        .insert({
          founded_year: data.founded_year,
          image_url: data.image_url,
        })
        .select()
        .single();

      if (createError) throw createError;
      companyInfoId = newCompanyData.id;
    } else {
      // Update existing base data
      const { error: updateError } = await supabase
        .from('company_info')
        .update({
          founded_year: data.founded_year,
          image_url: data.image_url,
        })
        .eq('id', companyInfoId);

      if (updateError) throw updateError;
    }

    // Update translations for all languages
    for (const language of languagesData) {
      const isCurrentLanguage = language.code === languageCode;
      const isGreek = language.code === 'el';
      
      // Determine content based on language
      const storyContent = isGreek ? 
        COMPANY_STORY_CONTENT.el : 
        COMPANY_STORY_CONTENT.en;

      const translationData = {
        title: isCurrentLanguage ? data.title : 'Advisable',
        content: isCurrentLanguage ? (data.content || storyContent) : storyContent,
        mission: isCurrentLanguage ? data.mission : '',
        vision: isCurrentLanguage ? data.vision : '',
        history: isCurrentLanguage ? data.history : '',
        approach: isCurrentLanguage ? data.approach : '',
        team_intro: isCurrentLanguage ? data.team_intro : '',
      };

      // Check if translation exists
      const { data: existingTranslation, error: checkError } = await supabase
        .from('company_info_translations')
        .select('id')
        .eq('company_info_id', companyInfoId)
        .eq('language_id', language.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingTranslation) {
        // Update existing translation
        const { error: transError } = await supabase
          .from('company_info_translations')
          .update(translationData)
          .eq('id', existingTranslation.id);

        if (transError) throw transError;
      } else {
        // Insert new translation
        const { error: transError } = await supabase
          .from('company_info_translations')
          .insert({
            company_info_id: companyInfoId,
            language_id: language.id,
            ...translationData
          });

        if (transError) throw transError;
      }
    }

    // Auto-create company values
    await createCompanyValues();

  } catch (error) {
    console.error('Error updating company info with auto content:', error);
    throw error;
  }
};

// Function to create/update company values with translations
export const createCompanyValues = async (): Promise<void> => {
  try {
    // Get all active languages
    const { data: languagesData, error: languagesError } = await supabase
      .from('languages')
      .select('*')
      .eq('is_active', true);

    if (languagesError) throw languagesError;

    // Create each company value
    for (const valueData of COMPANY_VALUES_DATA) {
      // Check if value already exists (by display_order to avoid duplicates)
      const { data: existingValue, error: checkError } = await supabase
        .from('company_values')
        .select('id')
        .eq('display_order', valueData.display_order)
        .maybeSingle();

      if (checkError) throw checkError;

      let valueId = existingValue?.id;

      if (!valueId) {
        // Create new value
        const { data: newValue, error: createError } = await supabase
          .from('company_values')
          .insert({
            icon_name: valueData.icon_name,
            display_order: valueData.display_order
          })
          .select()
          .single();

        if (createError) throw createError;
        valueId = newValue.id;
      }

      // Create translations for all languages
      for (const language of languagesData) {
        const isGreek = language.code === 'el';
        const title = valueData.title[isGreek ? 'el' : 'en'];
        const description = valueData.description[isGreek ? 'el' : 'en'];

        // Check if translation exists
        const { data: existingTranslation, error: transCheckError } = await supabase
          .from('company_value_translations')
          .select('id')
          .eq('company_value_id', valueId)
          .eq('language_id', language.id)
          .maybeSingle();

        if (transCheckError) throw transCheckError;

        if (existingTranslation) {
          // Update existing translation
          const { error: updateTransError } = await supabase
            .from('company_value_translations')
            .update({ title, description })
            .eq('id', existingTranslation.id);

          if (updateTransError) throw updateTransError;
        } else {
          // Insert new translation
          const { error: insertTransError } = await supabase
            .from('company_value_translations')
            .insert({
              company_value_id: valueId,
              language_id: language.id,
              title,
              description
            });

          if (insertTransError) throw insertTransError;
        }
      }
    }
  } catch (error) {
    console.error('Error creating company values:', error);
    throw error;
  }
};
