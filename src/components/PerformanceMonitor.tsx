import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

const PerformanceMonitor = () => {
  useEffect(() => {
    const reportMetrics = (metrics: PerformanceMetrics) => {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.group('🚀 Performance Metrics');
        if (metrics.fcp) console.log(`First Contentful Paint: ${metrics.fcp.toFixed(2)}ms`);
        if (metrics.lcp) console.log(`Largest Contentful Paint: ${metrics.lcp.toFixed(2)}ms`);
        if (metrics.fid) console.log(`First Input Delay: ${metrics.fid.toFixed(2)}ms`);
        if (metrics.cls) console.log(`Cumulative Layout Shift: ${metrics.cls.toFixed(4)}`);
        if (metrics.ttfb) console.log(`Time to First Byte: ${metrics.ttfb.toFixed(2)}ms`);
        console.groupEnd();
      }
    };

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      const metrics: PerformanceMetrics = {};
      
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
            break;
          case 'largest-contentful-paint':
            metrics.lcp = entry.startTime;
            break;
          case 'first-input':
            metrics.fid = (entry as any).processingStart - entry.startTime;
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              metrics.cls = (metrics.cls || 0) + (entry as any).value;
            }
            break;
          case 'navigation':
            const navEntry = entry as PerformanceNavigationTiming;
            metrics.ttfb = navEntry.responseStart - navEntry.fetchStart;
            break;
        }
      }
      
      reportMetrics(metrics);
    });

    // Observe different performance entry types
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] });
    } catch (error) {
      // Fallback for browsers that don't support all entry types
      console.warn('Some performance metrics not supported:', error);
    }

    // Monitor bundle sizes and loading times
    const monitorBundlePerformance = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(r => r.name.includes('.js'));
      const cssResources = resources.filter(r => r.name.includes('.css'));
      
      if (process.env.NODE_ENV === 'development') {
        console.group('📦 Bundle Performance');
        console.log(`JS Resources: ${jsResources.length}`);
        console.log(`CSS Resources: ${cssResources.length}`);
        
        const totalJSSize = jsResources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
        const totalCSSSize = cssResources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
        
        console.log(`Total JS Size: ${(totalJSSize / 1024).toFixed(2)} KB`);
        console.log(`Total CSS Size: ${(totalCSSSize / 1024).toFixed(2)} KB`);
        console.groupEnd();
      }
    };

    // Monitor after page load
    window.addEventListener('load', () => {
      setTimeout(monitorBundlePerformance, 1000);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
