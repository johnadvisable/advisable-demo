import { useEffect } from 'react';

const CriticalResourceLoader = () => {
  useEffect(() => {
    // Add critical CSS as inline styles to prevent render-blocking
    const criticalStyle = document.createElement('style');
    criticalStyle.innerHTML = `
      /* Critical above-the-fold CSS */
      .hero-section { 
        min-height: 100vh; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
      }
      .metrics-grid { 
        display: grid; 
        grid-template-columns: repeat(3, 1fr); 
        gap: 2rem;
        height: 140px;
      }
      .client-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); 
        gap: 1.5rem; 
      }
      .image-placeholder { 
        aspect-ratio: 1/1; 
        background: #f3f4f6; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
      }
      
      @media (max-width: 768px) {
        .metrics-grid { grid-template-columns: 1fr; height: auto; }
        .client-grid { grid-template-columns: repeat(2, 1fr); }
      }
    `;
    document.head.appendChild(criticalStyle);

    // Preload critical fonts
    const fontPreloads = [
      'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2',
      'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4.woff2',
    ];

    fontPreloads.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = href;
      document.head.appendChild(link);
    });

    // DNS prefetch for external domains
    const dnsPrefetches = [
      'https://www.gstatic.com',
      'https://www.google.com',
      'https://vz-f673a44e-c26.b-cdn.net',
    ];

    dnsPrefetches.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = href;
      document.head.appendChild(link);
    });

  }, []);

  return null;
};

export default CriticalResourceLoader;