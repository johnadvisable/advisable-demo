import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component will scroll the window to the top whenever
 * the pathname in the URL changes, and will scroll to the element
 * with the matching ID if a hash is present in the URL
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  
  // Use useLayoutEffect for immediate scroll before paint
  useLayoutEffect(() => {
    // If there's no hash, scroll to top immediately
    if (!hash) {
      // Instant scroll to top - no smooth behavior for page changes
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  
  useEffect(() => {
    // If there's a hash, scroll to that element
    if (hash) {
      // Give the browser a little time to render the page
      setTimeout(() => {
        // First try with the exact hash
        let hashId = hash.substring(1);
        let element = document.getElementById(hashId);

        // If the element doesn't exist, try some common variations
        if (!element) {
          // For hash formats like #MarkeData (try marketdata)
          element = document.getElementById(hashId.toLowerCase());
        }
        
        if (!element) {
          // For hash formats like #AIRecommendations (try ai-recommendations)
          element = document.getElementById(hashId.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''));
        }
        
        if (!element) {
          // For hash formats like #E Prescription Cloud ERP (try e-prescription)
          const simplifiedId = hashId.replace(/\s+/g, '-').toLowerCase();
          element = document.getElementById(simplifiedId);
        }

        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          // If element doesn't exist yet, try again after a longer delay
          setTimeout(() => {
            // Try all the variations again after delay
            hashId = hash.substring(1);
            let retryElement = document.getElementById(hashId);
            
            if (!retryElement) {
              retryElement = document.getElementById(hashId.toLowerCase());
            }
            
            if (!retryElement) {
              retryElement = document.getElementById(hashId.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''));
            }
            
            if (!retryElement) {
              const simplifiedId = hashId.replace(/\s+/g, '-').toLowerCase();
              retryElement = document.getElementById(simplifiedId);
            }
            
            if (retryElement) {
              retryElement.scrollIntoView({ behavior: 'smooth' });
            } else {
              // Scroll to top instantly
              window.scrollTo(0, 0);
            }
          }, 500);
        }
      }, 100);
    }
  }, [pathname, hash]);
  
  return null;
};

export default ScrollToTop;
