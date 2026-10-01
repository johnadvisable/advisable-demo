import { supabase } from "@/integrations/supabase/client";

export interface BunnyVideoConfig {
  videoId: string;
  libraryId: string;
  collectionId?: string;
  quality?: '240p' | '360p' | '480p' | '720p' | '1080p';
}

export interface BunnyVideoData {
  videoId: string;
  title: string;
  status: string;
  duration: number;
  thumbnailUrl: string;
  playbackUrls: {
    [quality: string]: string;
  };
  hasMP4Fallback: boolean;
}

export class BunnyVideoService {
  private static readonly LIBRARY_ID = '485602';
  private static readonly COLLECTION_ID = 'c3c5e4de-b982-40b3-ae40-3da7216e1837';
  private static readonly CDN_HOSTNAME = 'vz-21732ef9-3d0.b-cdn.net';

  /**
   * Get video streaming URL via Supabase Edge Function
   */
  static async getVideoStreamUrl(videoId: string, quality: string = '720p'): Promise<string> {
    try {

      const { data, error } = await supabase.functions.invoke('bunny-video-stream', {
        body: {
          videoId,
          quality,
          libraryId: this.LIBRARY_ID,
          collectionId: this.COLLECTION_ID
        }
      });

      if (error) {
        console.error('❌ Error getting video stream URL:', error);
        throw error;
      }

      if (data?.streamUrl) {
        return data.streamUrl;
      }

      // Fallback to direct CDN URL if edge function fails
      return this.getDirectCdnUrl(videoId, quality);
      
    } catch (error) {
      console.error('❌ Failed to get video stream URL:', error);
      // Return fallback URL
      return this.getDirectCdnUrl(videoId, quality);
    }
  }

  /**
   * Get direct CDN URL as fallback
   */
  static getDirectCdnUrl(videoId: string, quality: string = '720p'): string {
    return `https://${this.CDN_HOSTNAME}/${videoId}/play_${quality}.mp4`;
  }

  /**
   * Get video metadata
   */
  static async getVideoMetadata(videoId: string): Promise<BunnyVideoData | null> {
    try {
      const { data, error } = await supabase.functions.invoke('bunny-video-stream', {
        body: {
          videoId,
          action: 'metadata',
          libraryId: this.LIBRARY_ID
        }
      });

      if (error) {
        console.error('❌ Error getting video metadata:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to get video metadata:', error);
      return null;
    }
  }

  /**
   * Get optimized video URL based on device type
   * OPTIMIZED: Skip HEAD request validation, use direct CDN URLs for faster loading
   */
  static async getOptimizedVideoUrl(
    desktopVideoId: string, 
    mobileVideoId: string, 
    isMobile: boolean
  ): Promise<string> {
    // Prefer the device-specific video, fallback to the other if needed
    const primaryVideoId = isMobile ? mobileVideoId : desktopVideoId;
    const fallbackVideoId = isMobile ? desktopVideoId : mobileVideoId;
    
    if (!primaryVideoId && !fallbackVideoId) {
      throw new Error('No video IDs available for any device type');
    }
    
    // PERFORMANCE: Use direct CDN URL immediately - no HEAD request needed
    // CDN handles 404s gracefully, and video element will fall back naturally
    const videoId = primaryVideoId || fallbackVideoId;
    const quality = isMobile ? '480p' : '720p'; // Lower quality for mobile
    
    return this.getDirectCdnUrl(videoId, quality);
  }

  /**
   * Preload video for better user experience
   */
  static async preloadVideo(videoId: string, quality: string = '720p'): Promise<void> {
    try {
      const url = await this.getVideoStreamUrl(videoId, quality);
      
      // Create a hidden video element to preload
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = url;
      video.muted = true;
      video.style.display = 'none';
      document.body.appendChild(video);
      
      // Remove after loading
      video.addEventListener('loadedmetadata', () => {
        document.body.removeChild(video);
      });
      
      video.addEventListener('error', () => {
        document.body.removeChild(video);
      });
      
    } catch (error) {
      console.error('❌ Failed to preload video:', error);
    }
  }
}