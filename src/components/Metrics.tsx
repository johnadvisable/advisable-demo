import { useState, useEffect } from 'react';
import { getAllMetrics } from '../services/metricsService';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';

const Metrics = ({ variant = 'dark' }: { variant?: 'dark' | 'light' }) => {
  const isLight = variant === 'light';
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation('index');
  const [metrics, setMetrics] = useState<{
    companies: number;
    tracking: number;
    advisablers: number;
  }>({
    companies: 0,
    tracking: 0,
    advisablers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetMetrics, setTargetMetrics] = useState<typeof metrics | null>(null);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getAllMetrics(currentLanguage);
        const metricsObject = data.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
        setTargetMetrics({
          companies: metricsObject.companies || 0,
          tracking: metricsObject.tracking || 0,
          advisablers: metricsObject.advisablers || 0
        });
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError(t('metrics.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [currentLanguage, t]);
  
  useEffect(() => {
    if (!loading && !error && targetMetrics) {
      const duration = 2000;
      const frameRate = 60;
      const totalFrames = duration / 1000 * frameRate;
      let frame = 0;
      const timer = setInterval(() => {
        frame++;
        const progress = Math.min(frame / totalFrames, 1);
        const easeOutQuad = (t: number) => t * (2 - t);
        const easedProgress = easeOutQuad(progress);
        setMetrics({
          companies: Math.floor(easedProgress * targetMetrics.companies),
          tracking: Math.floor(easedProgress * targetMetrics.tracking),
          advisablers: Math.floor(easedProgress * targetMetrics.advisablers)
        });
        if (frame >= totalFrames) {
          clearInterval(timer);
        }
      }, 1000 / frameRate);
      return () => clearInterval(timer);
    }
  }, [loading, error, targetMetrics]);

  if (loading) {
    return (
      <div className="w-full py-6">
        <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-8 md:gap-16">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className={`h-10 w-20 ${isLight ? 'bg-muted' : 'bg-white/10'} rounded animate-pulse mb-2 mx-auto`}></div>
                <div className={`h-4 w-24 ${isLight ? 'bg-muted' : 'bg-white/10'} rounded animate-pulse mx-auto`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return null;
  }
  
  return (
    <div className="w-full py-4 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-16 lg:gap-24">
          {/* Metric 1 */}
          <div className="text-center">
             <p className={`text-2xl md:text-5xl lg:text-6xl font-semibold ${isLight ? 'text-foreground' : 'text-white'} tracking-tight`}>
              {metrics.companies}+
            </p>
            <p className={`${isLight ? 'text-muted-foreground' : 'text-white/60'} text-xs md:text-base mt-1 md:mt-2`}>
              {t('metrics.companiesLocation')}
            </p>
          </div>
          
          {/* Divider */}
          <div className={`hidden md:block w-px h-16 ${isLight ? 'bg-border' : 'bg-white/20'}`}></div>
          
          {/* Metric 2 */}
          <div className="text-center">
             <p className={`text-2xl md:text-5xl lg:text-6xl font-semibold ${isLight ? 'text-foreground' : 'text-white'} tracking-tight`}>
              €{metrics.tracking}M+
            </p>
            <p className={`${isLight ? 'text-muted-foreground' : 'text-white/60'} text-xs md:text-base mt-1 md:mt-2`}>
              {t('metrics.digitalRevenue')}
            </p>
          </div>
          
          {/* Divider */}
          <div className={`hidden md:block w-px h-16 ${isLight ? 'bg-border' : 'bg-white/20'}`}></div>
          
          {/* Metric 3 */}
          <div className="text-center">
             <p className={`text-2xl md:text-5xl lg:text-6xl font-semibold ${isLight ? 'text-foreground' : 'text-white'} tracking-tight`}>
              {metrics.advisablers}
            </p>
            <p className={`${isLight ? 'text-muted-foreground' : 'text-white/60'} text-xs md:text-base mt-1 md:mt-2`}>
              {t('metrics.teamMembers')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
