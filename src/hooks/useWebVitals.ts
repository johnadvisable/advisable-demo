// Web Vitals performance monitoring hook
import { useEffect } from 'react';

interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  navigationType: string;
}

const useWebVitals = () => {
  useEffect(() => {
    // Only load web-vitals in production or when performance monitoring is needed
    if (typeof window === 'undefined') return;

    const reportWebVitals = (metric: WebVitalsMetric) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 ${metric.name}:`, {
          value: `${Math.round(metric.value)}ms`,
          delta: `${Math.round(metric.delta)}ms`,
          id: metric.id,
          navigationType: metric.navigationType
        });
      }

      // Send to analytics service (implement as needed)
      // analytics.track('web_vital', {
      //   metric_name: metric.name,
      //   value: metric.value,
      //   delta: metric.delta,
      //   page: window.location.pathname
      // });
    };

    // Dynamically import web-vitals to avoid blocking initial load
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(reportWebVitals);
      onINP(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
    }).catch((error) => {
      console.warn('Failed to load web-vitals:', error);
    });
  }, []);
};

export default useWebVitals;