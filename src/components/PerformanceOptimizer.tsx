// Performance optimization utilities
import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources after LCP
    const preloadCriticalResources = () => {
      // Preload hero images that might be used
      const heroImageUrls = [
        '/hero-fallback.jpg',
        // Add other critical images here
      ];

      heroImageUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
      });

      // Preload critical API endpoints
      const criticalEndpoints = [
        '/api/hero-content',
        '/api/products',
        // Add other critical API endpoints
      ];

      criticalEndpoints.forEach(endpoint => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = endpoint;
        document.head.appendChild(link);
      });
    };

    // Run after a delay to not interfere with critical path
    const timer = setTimeout(preloadCriticalResources, 2000);

    // Optimize scroll performance
    let ticking = false;
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Handle scroll-based optimizations here
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', optimizedScrollHandler);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;