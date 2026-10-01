import { useState, useEffect, useCallback, useRef } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  fallbackText?: string;
}

const Image = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  onError,
  fallbackText
}: ImageProps) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const forceShowRef = useRef<NodeJS.Timeout>();

  // Optimized state management - single state instead of two booleans
  const isLoading = imageState === 'loading';
  const hasError = imageState === 'error';
  const isLoaded = imageState === 'loaded';

  // Combined useEffect for better performance
  useEffect(() => {
    // Clear any existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (forceShowRef.current) clearTimeout(forceShowRef.current);

    // Reset state when src changes
    setImageState('loading');

    // Force show after 1 second (handles CORS blocking)
    forceShowRef.current = setTimeout(() => {
      if (imageState === 'loading') {
        setImageState('loaded');
      }
    }, 1000);

    // Final timeout after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setImageState('loaded');
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (forceShowRef.current) clearTimeout(forceShowRef.current);
    };
  }, [src]); // Only depend on src changes

  // Memoized event handlers for better performance
  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageState('error');
    onError?.(e);
  }, [onError]);

  const handleLoad = useCallback(() => {
    // Clear timers when image loads successfully
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (forceShowRef.current) clearTimeout(forceShowRef.current);
    setImageState('loaded');
  }, []);

  // Early return for error state with fallback
  if (hasError && fallbackText) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-500 font-medium text-center px-2 ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          aspectRatio: `${width}/${height}`
        }}
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        {fallbackText}
      </div>
    );
  }

  const aspectRatio = `${width}/${height}`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-100 animate-pulse"
          style={{ aspectRatio }}
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        crossOrigin="anonymous"
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ aspectRatio }}
        onError={handleError}
        onLoad={handleLoad}
        decoding="async"
      />
    </div>
  );
};

export default Image;