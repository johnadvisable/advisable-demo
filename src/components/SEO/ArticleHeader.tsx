import { format } from 'date-fns';
import type { Locale } from 'date-fns';
import { el, enUS, de, es, fr, it } from 'date-fns/locale';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, User, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildLocalizedUrl } from '@/utils/multilanguageUtils';

interface ArticleHeaderProps {
  title: string;
  publishedDate: string;
  updatedDate?: string | null;
  author?: string | null;
  readingTime: number;
  featuredImage?: string | null;
  excerpt?: string;
}

// Helper to get date-fns locale
const getDateLocale = (lang: string) => {
  const locales: Record<string, Locale> = {
    el: el,
    en: enUS,
    de: de,
    es: es,
    fr: fr,
    it: it,
  };
  return locales[lang] || enUS;
};

// Helper to calculate reading time from content
export const calculateReadingTime = (content: string): number => {
  if (!content) return 1;
  // Strip HTML tags for accurate word count
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  // Average reading speed: 200 words per minute
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes);
};

export default function ArticleHeader({
  title,
  publishedDate,
  updatedDate,
  author,
  readingTime,
  featuredImage,
  excerpt
}: ArticleHeaderProps) {
  const { currentLanguage } = useLanguage();
  const dateLocale = getDateLocale(currentLanguage);
  
  const formattedPublishDate = format(new Date(publishedDate), 'MMMM d, yyyy', { 
    locale: dateLocale 
  });
  
  // Check if updated date is different from published date (more than 1 day)
  const hasBeenUpdated = updatedDate && 
    new Date(updatedDate).getTime() - new Date(publishedDate).getTime() > 86400000;
  
  const formattedUpdateDate = hasBeenUpdated 
    ? format(new Date(updatedDate!), 'MMMM d, yyyy', { locale: dateLocale })
    : null;

  // Reading time text
  const readingTimeText = currentLanguage === 'el' 
    ? `${readingTime} λεπτά ανάγνωση`
    : `${readingTime} min read`;

  return (
    <header className="mb-8" itemScope itemType="https://schema.org/BlogPosting">
      {/* Hidden structured data attributes */}
      <meta itemProp="headline" content={title} />
      {excerpt && <meta itemProp="description" content={excerpt} />}
      <meta itemProp="datePublished" content={publishedDate} />
      {updatedDate && <meta itemProp="dateModified" content={updatedDate} />}
      {featuredImage && <meta itemProp="image" content={featuredImage} />}
      
      {/* Title */}
      <h1 
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight"
        itemProp="name"
      >
        {title}
      </h1>
      
      {/* Meta info bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground border-b border-border pb-6">
        {/* Published date */}
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <time dateTime={publishedDate} itemProp="datePublished">
            {formattedPublishDate}
          </time>
        </div>
        
        {/* Updated date if different */}
        {formattedUpdateDate && (
          <div className="flex items-center gap-1.5 text-primary">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>
              {currentLanguage === 'el' ? 'Ενημερώθηκε' : 'Updated'}: 
              <time dateTime={updatedDate!} itemProp="dateModified" className="ml-1">
                {formattedUpdateDate}
              </time>
            </span>
          </div>
        )}
        
        {/* Reading time */}
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>{readingTimeText}</span>
        </div>
        
        {/* Author */}
        {author && (
          <div 
            className="flex items-center gap-1.5"
            itemProp="author" 
            itemScope 
            itemType="https://schema.org/Person"
          >
            <User className="h-4 w-4" aria-hidden="true" />
            <Link 
              to={buildLocalizedUrl('/advisable-team', currentLanguage)}
              className="hover:text-foreground transition-colors"
              itemProp="url"
            >
              <span itemProp="name">{author}</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
