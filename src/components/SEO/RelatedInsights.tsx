import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAllInsights, InsightPost } from '@/services/insightsService';
import { useLanguage } from '@/context/LanguageContext';
import { buildLocalizedUrl } from '@/utils/multilanguageUtils';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { el, enUS, de, es, fr, it } from 'date-fns/locale';
import type { Locale } from 'date-fns';

interface RelatedInsightsProps {
  currentSlug: string;
  currentType?: string;
  maxItems?: number;
}

const getDateLocale = (lang: string): Locale => {
  const locales: Record<string, Locale> = { el, en: enUS, de, es, fr, it };
  return locales[lang] || enUS;
};

export default function RelatedInsights({ 
  currentSlug, 
  currentType,
  maxItems = 3 
}: RelatedInsightsProps) {
  const { currentLanguage } = useLanguage();
  
  const { data: allInsights } = useQuery({
    queryKey: ['insights', currentLanguage],
    queryFn: getAllInsights,
  });
  
  // Filter and sort related insights
  const relatedInsights = (allInsights || [])
    .filter((insight: InsightPost) => insight.slug !== currentSlug)
    .sort((a: InsightPost, b: InsightPost) => {
      // Prioritize same type
      if (currentType) {
        const aMatch = a.type === currentType ? 1 : 0;
        const bMatch = b.type === currentType ? 1 : 0;
        if (aMatch !== bMatch) return bMatch - aMatch;
      }
      // Then sort by date
      return new Date(b.published_date).getTime() - new Date(a.published_date).getTime();
    })
    .slice(0, maxItems);
  
  if (relatedInsights.length === 0) return null;
  
  const dateLocale = getDateLocale(currentLanguage);
  const sectionTitle = currentLanguage === 'el' ? 'Σχετικά Άρθρα' : 'Related Insights';
  const readMoreText = currentLanguage === 'el' ? 'Διαβάστε περισσότερα' : 'Read more';

  return (
    <section className="mt-16 pt-10 border-t border-border" aria-labelledby="related-insights-heading">
      <h2 
        id="related-insights-heading"
        className="text-2xl font-bold text-foreground mb-8"
      >
        {sectionTitle}
      </h2>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedInsights.map((insight: InsightPost) => (
          <article 
            key={insight.id}
            className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
          >
            {/* Thumbnail */}
            {insight.featured_image && (
              <Link to={buildLocalizedUrl(`/insights/${insight.slug}`, currentLanguage)}>
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={insight.featured_image}
                    alt={insight.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </Link>
            )}
            
            <div className="p-4">
              {/* Type badge */}
              {insight.type && (
                <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded mb-2">
                  {insight.type}
                </span>
              )}
              
              {/* Title */}
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                <Link to={buildLocalizedUrl(`/insights/${insight.slug}`, currentLanguage)}>
                  {insight.title}
                </Link>
              </h3>
              
              {/* Date */}
              <time 
                dateTime={insight.published_date}
                className="text-xs text-muted-foreground block mb-3"
              >
                {format(new Date(insight.published_date), 'MMM d, yyyy', { locale: dateLocale })}
              </time>
              
              {/* Excerpt */}
              {insight.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {insight.excerpt}
                </p>
              )}
              
              {/* Read more link */}
              <Link 
                to={buildLocalizedUrl(`/insights/${insight.slug}`, currentLanguage)}
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {readMoreText}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
