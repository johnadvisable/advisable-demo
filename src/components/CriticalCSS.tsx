// Critical CSS component for above-the-fold content
const CriticalCSS = () => {
  return (
    <style>{`
      /* Critical path CSS - inline for immediate loading */
      .hero-loading {
        position: relative;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
        color: white;
      }
      
      /* Prevent layout shifts with fixed dimensions */
      .metrics-container {
        height: 140px;
        width: 100%;
      }
      
      .client-logo-container {
        aspect-ratio: 1/1;
        height: 160px;
        width: 160px;
      }
      
      .hero-loading-content {
        text-align: center;
        animation: fadeIn 0.5s ease-in;
      }
      
      .hero-loading-title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        opacity: 0.9;
      }
      
      .hero-loading-subtitle {
        font-size: 1.25rem;
        opacity: 0.8;
        max-width: 48rem;
        margin: 0 auto;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @media (min-width: 768px) {
        .hero-loading-title {
          font-size: 4.5rem;
        }
        .hero-loading-subtitle {
          font-size: 1.5rem;
        }
      }
    `}</style>
  );
};

export default CriticalCSS;