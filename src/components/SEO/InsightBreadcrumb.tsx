import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { 
  getDomainForLanguage, 
  buildLocalizedUrl,
  isLocalDevelopment 
} from '@/utils/multilanguageUtils';

interface InsightBreadcrumbProps {
  title: string;
  slug: string;
}

export default function InsightBreadcrumb({ title }: InsightBreadcrumbProps) {
  const { currentLanguage } = useLanguage();
  
  // Generate proper URLs for schema
  const domain = getDomainForLanguage(currentLanguage);
  const baseUrl = isLocalDevelopment() 
    ? window.location.origin 
    : `https://www.${domain}`;
  
  const homeUrl = `${baseUrl}${buildLocalizedUrl('/', currentLanguage)}`;
  const insightsUrl = `${baseUrl}${buildLocalizedUrl('/insights', currentLanguage)}`;
  
  // Truncate title for display if too long
  const displayTitle = title.length > 50 ? `${title.substring(0, 47)}...` : title;
  
  // Breadcrumb schema for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": currentLanguage === 'el' ? 'Αρχική' : 'Home',
        "item": homeUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Insights",
        "item": insightsUrl
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title
      }
    ]
  };

  return (
    <>
      {/* Breadcrumb Schema */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Visual Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <Breadcrumb>
          <BreadcrumbList className="text-sm text-muted-foreground">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link 
                  to={buildLocalizedUrl('/', currentLanguage)} 
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">
                    {currentLanguage === 'el' ? 'Αρχική' : 'Home'}
                  </span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            <BreadcrumbSeparator>
              <ChevronRight className="h-3.5 w-3.5" />
            </BreadcrumbSeparator>
            
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link 
                  to={buildLocalizedUrl('/insights', currentLanguage)}
                  className="hover:text-foreground transition-colors"
                >
                  Insights
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            <BreadcrumbSeparator>
              <ChevronRight className="h-3.5 w-3.5" />
            </BreadcrumbSeparator>
            
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] sm:max-w-[300px] md:max-w-none truncate">
                {displayTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
    </>
  );
}
