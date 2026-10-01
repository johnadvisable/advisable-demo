import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Bunny CDN configuration
const BUNNY_CDN_CONFIG = {
  VIDEO_LIBRARY_ID: '485602',
  CDN_HOSTNAME: 'vz-21732ef9-3d0.b-cdn.net',
  PULL_ZONE: 'vz-21732ef9-3d0',
  STORAGE_HOSTNAME: 'storage.bunnycdn.com',
  STREAM_API_HOSTNAME: 'video.bunnycdn.com',
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000,
  PROCESSING_TIMEOUT: 30000
};

// Helper function to sleep
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to truncate title at first punctuation mark
function truncateAtFirstPunctuation(text: string): string {
  if (!text) return text;
  
  // Find the first punctuation mark (excluding emojis at the start)
  const punctuationMarks = /[.!?;:…]/;
  const match = text.match(punctuationMarks);
  
  if (match && match.index !== undefined) {
    // Include the punctuation mark in the result
    return text.substring(0, match.index + 1).trim();
  }
  
  // If no punctuation found, return the original text (fallback to character limit)
  return text.length > 100 ? text.substring(0, 100) + '...' : text;
}

// Helper function to generate URL-friendly slugs from text
function generateSlug(text: string, maxLength: number = 50): string {
  if (!text) return 'untitled-post';
  
  return text
    .toLowerCase()
    // Remove emojis and special characters
    .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    // Replace spaces and special characters with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length
    .substring(0, maxLength)
    // Remove trailing hyphen if created by substring
    .replace(/-$/, '')
    // Fallback if empty
    || 'untitled-post';
}

// Helper function to ensure slug uniqueness by checking database
async function ensureUniqueSlug(supabase: any, baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    // Check if slug exists
    const { data: existingPost } = await supabase
      .from('news')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (!existingPost) {
      // Slug is unique
      return slug;
    }
    
    // Slug exists, try with counter
    slug = `${baseSlug}-${counter}`;
    counter++;
    
    // Prevent infinite loop
    if (counter > 100) {
      return `${baseSlug}-${Date.now()}`;
    }
  }
}

// Helper function to validate configuration
function validateBunnyConfig(): void {
  const requiredKeys = ['BUNNY_CDN_API_KEY'];
  const missingKeys = requiredKeys.filter(key => !Deno.env.get(key));
  
  if (missingKeys.length > 0) {
    throw new Error(`Missing required Bunny CDN configuration: ${missingKeys.join(', ')}`);
  }

}

interface InstagramPost {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  permalink: string;
  timestamp: string;
  thumbnail_url?: string;
  username?: string;
}

// Function to translate text using Gemini API with rate limiting
async function translateWithGemini(text: string, maxRetries: number = 3): Promise<{ title: string; excerpt: string; content: string }> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    const title = truncateAtFirstPunctuation(text);
    const excerpt = text.length > 200 ? text.substring(0, 200) + '...' : text;
    return { title, excerpt, content: text };
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Translate the following Greek text to English. Provide:
1. A short title (max 100 characters) suitable for a news headline - truncate at first punctuation mark if possible
2. A brief excerpt (max 200 characters) for preview
3. The full translated content

Text to translate: "${text}"

Format your response as JSON:
{
  "title": "your title here",
  "excerpt": "your excerpt here", 
  "content": "your full translation here"
}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1000,
          },
        }),
      });

      if (response.status === 429) {
        // Rate limit hit - wait before retry
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.warn(`🚫 Gemini API rate limit hit (429). Waiting ${waitTime}ms before retry...`);
        if (attempt < maxRetries) {
          await sleep(waitTime);
          continue;
        } else {
          throw new Error('Gemini API rate limit exceeded, max retries reached');
        }
      }

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No translation received from Gemini');
      }

      // Clean up the response from markdown code blocks
      let cleanedText = generatedText.trim();
      
      // Remove markdown code blocks if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Try to parse JSON response
      try {
        const parsed = JSON.parse(cleanedText);
        if (parsed.title && parsed.excerpt && parsed.content) {
          return {
            title: parsed.title.substring(0, 100),
            excerpt: parsed.excerpt.substring(0, 200),
            content: parsed.content
          };
        }
      } catch (parseError) {
        console.warn(parseError);
      }

      // Fallback: use the raw translation
      const title = generatedText.length > 100 ? generatedText.substring(0, 100) + '...' : generatedText;
      const excerpt = generatedText.length > 200 ? generatedText.substring(0, 200) + '...' : generatedText;
      
      return {
        title,
        excerpt,
        content: generatedText
      };

    } catch (error) {
      console.error(`Gemini translation attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        console.error('❌ All Gemini translation attempts failed, using original text');
        // Fallback to original text
        const title = truncateAtFirstPunctuation(text);
        const excerpt = text.length > 200 ? text.substring(0, 200) + '...' : text;
        return { title, excerpt, content: text };
      }
      // Wait before next attempt
      await sleep(1000 * attempt);
    }
  }

  // This should never be reached, but TypeScript requires it
  const title = truncateAtFirstPunctuation(text);
  const excerpt = text.length > 200 ? text.substring(0, 200) + '...' : text;
  return { title, excerpt, content: text };
}

// Helper function to validate media format
function validateMediaFormat(mediaBlob: Blob, isVideo: boolean): boolean {
  const supportedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
  const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (isVideo) {
    return supportedVideoTypes.includes(mediaBlob.type) || mediaBlob.type.startsWith('video/');
  } else {
    return supportedImageTypes.includes(mediaBlob.type) || mediaBlob.type.startsWith('image/');
  }
}

// Helper function to retry with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = BUNNY_CDN_CONFIG.MAX_RETRIES,
  baseDelay: number = BUNNY_CDN_CONFIG.RETRY_DELAY
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await sleep(delay);
    }
  }
  
  throw lastError!;
}

// Helper function to check video processing status
async function checkVideoProcessingStatus(videoId: string, bunnyApiKey: string): Promise<{ status: string; playbackUrl?: string }> {
  const response = await fetch(`https://${BUNNY_CDN_CONFIG.STREAM_API_HOSTNAME}/library/${BUNNY_CDN_CONFIG.VIDEO_LIBRARY_ID}/videos/${videoId}`, {
    method: 'GET',
    headers: {
      'AccessKey': bunnyApiKey,
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to check video status: ${response.statusText}`);
  }

  const videoData = await response.json();

  return {
    status: videoData.status,
    playbackUrl: videoData.hasMP4Fallback ? `https://${BUNNY_CDN_CONFIG.CDN_HOSTNAME}/${videoId}/play_720p.mp4` : undefined
  };
}

// Helper function to upload images to Supabase Storage with duplicate checking
async function uploadToSupabaseStorage(mediaUrl: string, filename: string, existingImageUrl?: string): Promise<string> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // If we have an existing image URL from Supabase Storage, reuse it
  if (existingImageUrl && existingImageUrl.includes('supabase.co/storage/v1/object/public/instagram-media/')) {
    return existingImageUrl;
  }
  

  try {
    // Check if file already exists
    const { data: existingFile } = await supabase.storage
      .from('instagram-media')
      .list('', {
        search: filename.split('_')[1] // Search by Instagram post ID
      });
    
    if (existingFile && existingFile.length > 0) {
      // File already exists, get its public URL
      const existingFilename = existingFile[0].name;
      const { data: { publicUrl } } = supabase.storage
        .from('instagram-media')
        .getPublicUrl(existingFilename);
      return publicUrl;
    }
    
    // Download the image from Instagram
    const mediaResponse = await fetch(mediaUrl);
    if (!mediaResponse.ok) {
      throw new Error(`Failed to download image: ${mediaResponse.status} - ${mediaResponse.statusText}`);
    }
    
    const mediaBlob = await mediaResponse.blob();

    // Convert blob to array buffer for upload
    const arrayBuffer = await mediaBlob.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('instagram-media')
      .upload(filename, arrayBuffer, {
        contentType: mediaBlob.type || 'image/jpeg',
        upsert: true
      });
    
    if (error) {
      console.error('❌ Supabase storage upload failed:', error);
      throw error;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('instagram-media')
      .getPublicUrl(filename);
    
    return publicUrl;
    
  } catch (error) {
    console.error(`💥 Error uploading to Supabase Storage:`, error);
    return mediaUrl;
  }
}

// Helper function to check if video exists in Bunny CDN
async function checkVideoExistsInBunny(videoId: string, bunnyApiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`https://${BUNNY_CDN_CONFIG.STREAM_API_HOSTNAME}/library/${BUNNY_CDN_CONFIG.VIDEO_LIBRARY_ID}/videos/${videoId}`, {
      method: 'GET',
      headers: {
        'AccessKey': bunnyApiKey,
        'accept': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.warn(`⚠️ Could not check video existence:`, error);
    return false;
  }
}

// Function to upload videos ONLY to Bunny CDN with enhanced error handling and monitoring
async function uploadToBunnyCDN(mediaUrl: string, filename: string): Promise<{ url: string; videoId?: string }> {
  // Validate configuration first
  try {
    validateBunnyConfig();
  } catch (configError) {
    console.error('Bunny CDN configuration error:', configError);
    return { url: mediaUrl };
  }

  const bunnyApiKey = Deno.env.get('BUNNY_CDN_API_KEY')!;
  
  try {
    const { mediaBlob, mediaArrayBuffer } = await retryWithBackoff(async () => {
      const mediaResponse = await fetch(mediaUrl);
      if (!mediaResponse.ok) {
        throw new Error(`Failed to download video: ${mediaResponse.status} - ${mediaResponse.statusText}`);
      }

      const blob = await mediaResponse.blob();
      const arrayBuffer = await blob.arrayBuffer();
      
      // Validate video format
      if (!validateMediaFormat(blob, true)) {
        console.warn(`⚠️ Potentially unsupported video format: ${blob.type}`);
      }
      
      return { mediaBlob: blob, mediaArrayBuffer: arrayBuffer };
    });

    // Step 1: Create video entry
    const videoCreationResult = await retryWithBackoff(async () => {
      const response = await fetch(`https://${BUNNY_CDN_CONFIG.STREAM_API_HOSTNAME}/library/${BUNNY_CDN_CONFIG.VIDEO_LIBRARY_ID}/videos`, {
        method: 'POST',
        headers: {
          'AccessKey': bunnyApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: filename.replace(/\.[^/.]+$/, ""), // Remove extension from title
          collection: 'Instagram Sync'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Video creation failed:', errorText);
        throw new Error(`Failed to create video: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    });

    const videoId = videoCreationResult.guid;
    // Step 2: Upload video content
    await retryWithBackoff(async () => {
      const uploadResponse = await fetch(`https://${BUNNY_CDN_CONFIG.STREAM_API_HOSTNAME}/library/${BUNNY_CDN_CONFIG.VIDEO_LIBRARY_ID}/videos/${videoId}`, {
        method: 'PUT',
        headers: {
          'AccessKey': bunnyApiKey,
          'Content-Type': 'application/octet-stream',
        },
        body: mediaArrayBuffer,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('❌ Video upload failed:', errorText);
        throw new Error(`Failed to upload video content: ${uploadResponse.status} - ${uploadResponse.statusText}`);
      }
      
    });

    let processingComplete = false;
    let playbackUrl: string | undefined;
    const startTime = Date.now();

    while (!processingComplete && (Date.now() - startTime) < BUNNY_CDN_CONFIG.PROCESSING_TIMEOUT) {
      try {
        const statusResult = await checkVideoProcessingStatus(videoId, bunnyApiKey);
        
        if (Number(statusResult.status) === 4 || String(statusResult.status) === 'finished') { // Status 4 = Finished
          processingComplete = true;
          playbackUrl = statusResult.playbackUrl;
        } else if (Number(statusResult.status) === 5 || String(statusResult.status) === 'error') { // Status 5 = Error
          console.error(`❌ Video processing failed with status: ${statusResult.status}`);
          break;
        } else {
          await sleep(3000); // Wait 3 seconds before next check
        }
      } catch (statusError) {
        console.warn(`⚠️ Could not check video status:`, statusError);
        break;
      }
    }

    // Return URL and video ID
    const finalUrl = playbackUrl || `https://${BUNNY_CDN_CONFIG.CDN_HOSTNAME}/${videoId}/play_720p.mp4`;
    return { url: finalUrl, videoId };

  } catch (error) {
    console.error(`💥 Critical error uploading video to Bunny CDN:`, error);
    return { url: mediaUrl };
}
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Instagram access token from secrets
    const instagramAccessToken = Deno.env.get('INSTAGRAM_ACCESS_TOKEN');
    if (!instagramAccessToken) {
      throw new Error('Instagram access token not configured');
    }


    // Fetch Instagram posts using Basic Display API
    const instagramResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,thumbnail_url,username&access_token=${instagramAccessToken}&limit=10`
    );

    if (!instagramResponse.ok) {
      const errorText = await instagramResponse.text();
      console.error('Instagram API error:', errorText);
      throw new Error(`Instagram API error: ${instagramResponse.status} - ${errorText}`);
    }

    const instagramData = await instagramResponse.json();

    if (!instagramData.data || instagramData.data.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No Instagram posts found',
          insertedCount: 0,
          updatedCount: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get both English and Greek language IDs
    const { data: languagesData, error: languageError } = await supabase
      .from('languages')
      .select('id, code')
      .in('code', ['en', 'el']);

    if (languageError) {
      console.error('Error fetching languages:', languageError);
      throw new Error('Could not fetch required languages');
    }

    const englishLang = languagesData.find(lang => lang.code === 'en');
    const greekLang = languagesData.find(lang => lang.code === 'el');

    if (!englishLang || !greekLang) {
      throw new Error('Required languages (English and Greek) not found in database');
    }

    const englishLanguageId = englishLang.id;
    const greekLanguageId = greekLang.id;
    
    let insertedCount = 0;
    let updatedCount = 0;

    // Process each Instagram post
    for (const post of instagramData.data as InstagramPost[]) {
      try {

        // Check if this post already exists by looking for the Instagram permalink in video_url
        const { data: existingPost, error: checkError } = await supabase
          .from('news')
          .select('id, bunny_video_id, featured_image, thumbnail_url')
          .eq('video_url', post.permalink)
          .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
          console.error('Error checking existing post:', checkError);
          continue;
        }

        // Prepare post data - original Greek caption
        const originalCaption = post.caption || 'Latest update from Advisable';
        
        // Create Greek content (original)
        const greekTitle = truncateAtFirstPunctuation(originalCaption);
        const greekExcerpt = originalCaption.length > 200 ? originalCaption.substring(0, 200) + '...' : originalCaption;
        const greekContent = originalCaption;

        // Check if we need to translate (only for new posts or if English translation doesn't exist)
        let englishTitle = greekTitle;
        let englishExcerpt = greekExcerpt; 
        let englishContent = greekContent;
        let needsTranslation = true;

        if (existingPost) {
          // Check if English translation already exists
          const { data: existingEnglishTranslation } = await supabase
            .from('news_translations')
            .select('title, excerpt, content')
            .eq('news_id', existingPost.id)
            .eq('language_id', englishLanguageId)
            .single();

          if (existingEnglishTranslation) {
            englishTitle = existingEnglishTranslation.title;
            englishExcerpt = existingEnglishTranslation.excerpt;
            englishContent = existingEnglishTranslation.content;
            needsTranslation = false;
          }
        }

        // Translate to English only if needed
        if (needsTranslation) {
          const translation = await translateWithGemini(originalCaption);
          englishTitle = translation.title;
          englishExcerpt = translation.excerpt;
          englishContent = translation.content;
        }
        
        const isVideo = post.media_type === 'VIDEO';
        const originalMediaUrl = post.media_url; // Always use media_url for actual content
        
        // Generate filename for CDN upload
        const fileExtension = isVideo ? 'mp4' : 'jpg';
        const filename = `instagram_${post.id}_${Date.now()}.${fileExtension}`;
        
        let featuredImage: string;
        let thumbnailUrl: string | null = null;
        let bunnyVideoId: string | null = null;
        
        if (isVideo) {
          // For videos: reuse existing bunny_video_id if available, otherwise upload new
          if (existingPost?.bunny_video_id) {
            featuredImage = `https://${BUNNY_CDN_CONFIG.CDN_HOSTNAME}/${existingPost.bunny_video_id}/play_720p.mp4`;
            bunnyVideoId = existingPost.bunny_video_id;
          } else {
            const uploadResult = await uploadToBunnyCDN(originalMediaUrl, filename);
            featuredImage = uploadResult.url;
            bunnyVideoId = uploadResult.videoId || null;
          }
          
          // For video thumbnails, upload to Supabase Storage if available
          if (post.thumbnail_url) {
            const thumbnailFilename = `instagram_${post.id}_thumb_${Date.now()}.jpg`;
            thumbnailUrl = await uploadToSupabaseStorage(post.thumbnail_url, thumbnailFilename);
          }
        } else {
          featuredImage = await uploadToSupabaseStorage(originalMediaUrl, filename, existingPost?.featured_image);
        }

        if (existingPost) {
          // Update existing post
          const { error: updateError } = await supabase
            .from('news')
            .update({
              updated_at: new Date().toISOString(),
              featured_image: featuredImage,
              thumbnail_url: thumbnailUrl,
              bunny_video_id: bunnyVideoId
            })
            .eq('id', existingPost.id);

          if (updateError) {
            console.error('Error updating news item:', updateError);
            continue;
          }

          // Update or insert Greek translation (original content)
          const { error: updateGreekError } = await supabase
            .from('news_translations')
            .upsert({
              news_id: existingPost.id,
              language_id: greekLanguageId,
              title: greekTitle,
              excerpt: greekExcerpt,
              content: greekContent,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'news_id,language_id'
            });

          if (updateGreekError) {
            console.error('Error updating Greek translation:', updateGreekError);
          }

          // Update or insert English translation (translated content)
          const { error: updateEnglishError } = await supabase
            .from('news_translations')
            .upsert({
              news_id: existingPost.id,
              language_id: englishLanguageId,
              title: englishTitle,
              excerpt: englishExcerpt,
              content: englishContent,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'news_id,language_id'
            });

          if (updateEnglishError) {
            console.error('Error updating English translation:', updateEnglishError);
          } else {
            updatedCount++;
          }
        } else {
          // Generate meaningful slug from content
          const titleForSlug = englishTitle !== greekTitle ? englishTitle : greekTitle;
          const baseSlug = generateSlug(titleForSlug);
          const uniqueSlug = await ensureUniqueSlug(supabase, baseSlug);
          const { data: newsItem, error: insertError } = await supabase
            .from('news')
            .insert({
              type: 'media',
              featured_image: featuredImage,
              thumbnail_url: thumbnailUrl,
              bunny_video_id: bunnyVideoId,
              video_url: post.permalink,
              published_date: post.timestamp,
              slug: uniqueSlug
            })
            .select('id')
            .single();

          if (insertError) {
            console.error('Error inserting news item:', insertError);
            continue;
          }

          // Insert Greek translation (original content)
          const { error: greekTranslationError } = await supabase
            .from('news_translations')
            .insert({
              news_id: newsItem.id,
              language_id: greekLanguageId,
              title: greekTitle,
              excerpt: greekExcerpt,
              content: greekContent
            });

          if (greekTranslationError) {
            console.error('Error inserting Greek translation:', greekTranslationError);
            // Clean up the news item if translation fails
            await supabase
              .from('news')
              .delete()
              .eq('id', newsItem.id);
            continue;
          }

          // Insert English translation (translated content)
          const { error: englishTranslationError } = await supabase
            .from('news_translations')
            .insert({
              news_id: newsItem.id,
              language_id: englishLanguageId,
              title: englishTitle,
              excerpt: englishExcerpt,
              content: englishContent
            });

          if (englishTranslationError) {
            console.error('Error inserting English translation:', englishTranslationError);
            // Clean up the news item and Greek translation if English translation fails
            await supabase
              .from('news')
              .delete()
              .eq('id', newsItem.id);
            continue;
          }

          insertedCount++;
        }
      } catch (postError) {
        console.error(`Error processing post ${post.id}:`, postError);
        continue;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Instagram sync completed successfully. Inserted ${insertedCount} new posts, updated ${updatedCount} existing posts.`,
        insertedCount,
        updatedCount,
        totalProcessed: insertedCount + updatedCount
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in sync-instagram-feed function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to sync Instagram feed. Please try again.',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});