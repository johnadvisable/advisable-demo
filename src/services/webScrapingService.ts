import { supabase } from '@/integrations/supabase/client';

export interface ScrapingResult {
  success: boolean;
  htmlContent?: string;
  error?: string;
}

// Scrape HTML content from a given URL
export const scrapeWebsiteContent = async (url: string): Promise<ScrapingResult> => {
  try {

    const { data, error } = await supabase.functions.invoke('scrape-partners-page', {
      body: { url }
    });

    if (error) {
      console.error('Edge function error:', error);
      return {
        success: false,
        error: `Scraping failed: ${error.message}`
      };
    }

    if (!data.success) {
      console.error('Scraping failed:', data.error);
      return {
        success: false,
        error: data.error || 'Unknown scraping error'
      };
    }

    return {
      success: true,
      htmlContent: data.htmlContent
    };

  } catch (error) {
    console.error('Error in scraping service:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

// Extract partner content from full HTML by looking for the specific structure
export const extractPartnerContent = (htmlContent: string): string | null => {
  try {
    // Look for the specific HTML structure containing partner logos
    const partnerBlockRegex = /<div[^>]*class="[^"]*advClientBlock[^"]*"[^>]*>.*?<\/div>/gs;
    const matches = htmlContent.match(partnerBlockRegex);
    
    if (!matches || matches.length === 0) {
      console.warn('No partner blocks found in the scraped content');
      return null;
    }

    // Join all found partner blocks
    const partnerContent = `<div class="row row-mlr-0">${matches.join(' ')}</div>`;

    return partnerContent;
  } catch (error) {
    console.error('Error extracting partner content:', error);
    return null;
  }
};

// Main function to scrape and extract partner data
export const scrapeAndExtractPartners = async (url: string): Promise<ScrapingResult> => {
  const scrapingResult = await scrapeWebsiteContent(url);
  
  if (!scrapingResult.success || !scrapingResult.htmlContent) {
    return scrapingResult;
  }

  const extractedContent = extractPartnerContent(scrapingResult.htmlContent);
  
  if (!extractedContent) {
    return {
      success: false,
      error: 'No partner content found in the scraped page. Please check if the page structure has changed.'
    };
  }

  return {
    success: true,
    htmlContent: extractedContent
  };
};