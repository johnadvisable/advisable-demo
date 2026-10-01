import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BUNNY_CDN_CONFIG = {
  VIDEO_LIBRARY_ID: '485602',
  CDN_HOSTNAME: 'vz-21732ef9-3d0.b-cdn.net',
  STREAM_API_HOSTNAME: 'video.bunnycdn.com',
  COLLECTION_ID: 'c3c5e4de-b982-40b3-ae40-3da7216e1837'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId, quality = '720p', action = 'stream', libraryId, collectionId } = await req.json();
    
    if (!videoId) {
      throw new Error('Video ID is required');
    }

    const bunnyApiKey = Deno.env.get('BUNNY_CDN_API_KEY');
    if (!bunnyApiKey) {
      throw new Error('Bunny CDN API key not configured');
    }

    const actualLibraryId = libraryId || BUNNY_CDN_CONFIG.VIDEO_LIBRARY_ID;
    
    if (action === 'metadata') {
      // Get video metadata from Bunny CDN API
      const metadataResponse = await fetch(
        `https://${BUNNY_CDN_CONFIG.STREAM_API_HOSTNAME}/library/${actualLibraryId}/videos/${videoId}`,
        {
          method: 'GET',
          headers: {
            'AccessKey': bunnyApiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!metadataResponse.ok) {
        console.error(`❌ Bunny CDN API error: ${metadataResponse.status}`);
        throw new Error(`Failed to fetch video metadata: ${metadataResponse.status}`);
      }

      const videoData = await metadataResponse.json();
      
      // Format response with available qualities
      const playbackUrls: { [quality: string]: string } = {};
      const availableQualities = ['240p', '360p', '480p', '720p', '1080p'];
      
      availableQualities.forEach(q => {
        playbackUrls[q] = `https://${BUNNY_CDN_CONFIG.CDN_HOSTNAME}/${videoId}/play_${q}.mp4`;
      });

      const response = {
        videoId: videoData.guid,
        title: videoData.title || 'Untitled Video',
        status: videoData.status,
        duration: videoData.length || 0,
        thumbnailUrl: videoData.thumbnailFileName 
          ? `https://${BUNNY_CDN_CONFIG.CDN_HOSTNAME}/${videoId}/${videoData.thumbnailFileName}`
          : `https://${BUNNY_CDN_CONFIG.CDN_HOSTNAME}/${videoId}/thumbnail.jpg`,
        playbackUrls,
        hasMP4Fallback: videoData.hasMP4Fallback || false
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get metadata first to check available qualities
    try {
      const metadataResponse = await fetch(
        `https://${BUNNY_CDN_CONFIG.STREAM_API_HOSTNAME}/library/${actualLibraryId}/videos/${videoId}`,
        {
          method: 'GET',
          headers: {
            'AccessKey': bunnyApiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      let availableQualities = ['720p', '480p', '360p'];
      if (metadataResponse.ok) {
        const videoData = await metadataResponse.json();

        // Check if higher qualities are available
        if (videoData.hasMP4Fallback) {
          availableQualities.unshift('1080p');
        }
      }

      // Try requested quality first, then fallback through available qualities
      const qualityPriority = quality === '1080p' ? ['1080p', '720p', '480p'] : [quality, '720p', '480p'];
      
      for (const testQuality of qualityPriority) {
        if (availableQualities.includes(testQuality)) {
          const testUrl = `https://${BUNNY_CDN_CONFIG.CDN_HOSTNAME}/${videoId}/play_${testQuality}.mp4`;
          
          try {
            const headResponse = await fetch(testUrl, { method: 'HEAD' });
            if (headResponse.ok) {
              return new Response(JSON.stringify({
                streamUrl: testUrl,
                quality: testQuality,
                videoId,
                requested: quality,
                fallback: testQuality !== quality,
                cdnHostname: BUNNY_CDN_CONFIG.CDN_HOSTNAME
              }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              });
            }
          } catch (testError: unknown) {
            console.warn(`⚠️ Quality ${testQuality} test failed:`, testError instanceof Error ? testError.message : String(testError));
          }
        }
      }
    } catch (metadataError: unknown) {
      console.warn(`⚠️ Metadata fetch failed, trying direct URL:`, metadataError instanceof Error ? metadataError.message : String(metadataError));
    }

    const streamUrl = `https://${BUNNY_CDN_CONFIG.CDN_HOSTNAME}/${videoId}/play_${quality}.mp4`;

    return new Response(JSON.stringify({ 
      streamUrl,
      quality,
      videoId,
      fallback: true,
      cdnHostname: BUNNY_CDN_CONFIG.CDN_HOSTNAME
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('❌ Bunny video stream error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : String(error),
      fallbackUrl: `https://${BUNNY_CDN_CONFIG.CDN_HOSTNAME}/fallback/play_720p.mp4`
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});