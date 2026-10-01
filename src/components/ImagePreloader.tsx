import { useEffect } from 'react';

interface ImagePreloaderProps {
  images: string[];
  priority?: boolean;
}

const ImagePreloader = ({ images, priority = false }: ImagePreloaderProps) => {
  useEffect(() => {
    if (!images.length) return;

    const preloadImages = () => {
      images.forEach(src => {
        const link = document.createElement('link');
        link.rel = priority ? 'preload' : 'prefetch';
        link.as = 'image';
        link.href = src;
        
        // Add to head
        document.head.appendChild(link);
      });
    };

    // Delay non-priority preloading to not interfere with critical resources
    if (priority) {
      preloadImages();
    } else {
      const timer = setTimeout(preloadImages, 3000);
      return () => clearTimeout(timer);
    }
  }, [images, priority]);

  return null;
};

export default ImagePreloader;