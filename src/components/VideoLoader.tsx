import { useState, useMemo, memo } from 'react';

interface VideoLoaderProps {
  desktopVideoId?: string;
  mobileVideoId?: string;
  isMobile: boolean;
  className?: string;
  fallbackGradient?: string;
  onVideoReady?: () => void;
}

// Direct CDN URL generation - no async, no dynamic imports
const CDN_HOSTNAME = 'vz-21732ef9-3d0.b-cdn.net';

const VideoLoader = memo(({ 
  desktopVideoId, 
  mobileVideoId, 
  isMobile, 
  className = "absolute inset-0 w-full h-full object-cover",
  fallbackGradient = "bg-black",
  onVideoReady
}: VideoLoaderProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Synchronous URL generation - no async loading
  const videoUrl = useMemo(() => {
    const videoId = isMobile 
      ? (mobileVideoId || desktopVideoId) 
      : (desktopVideoId || mobileVideoId);
    
    if (!videoId) return null;
    
    const quality = isMobile ? '480p' : '720p';
    return `https://${CDN_HOSTNAME}/${videoId}/play_${quality}.mp4`;
  }, [desktopVideoId, mobileVideoId, isMobile]);

  // No video URL available
  if (!videoUrl || hasError) {
    return <div className={`absolute inset-0 ${fallbackGradient}`} />;
  }

  // Render video with fade-in transition - no loader spinner
  return (
    <>
      {/* Black background until video loads */}
      <div className={`absolute inset-0 ${fallbackGradient}`} />
      
      {/* Video with fade-in */}
      <video
        key={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`${className} transition-opacity duration-500 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoadedData={() => {
          setIsVideoLoaded(true);
          onVideoReady?.();
        }}
        onCanPlay={(e) => {
          const video = e.target as HTMLVideoElement;
          video.muted = true;
          video.play().catch(() => {
            // Silent fail - autoplay restrictions are common
          });
        }}
        onError={() => {
          setHasError(true);
        }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </>
  );
});

VideoLoader.displayName = 'VideoLoader';

export default VideoLoader;
