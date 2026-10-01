import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllNewsItems, getNewsByType } from "@/services/newsService";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Image as ImageIcon, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { useLanguage } from "@/context/LanguageContext";
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import SecureContentRenderer from '@/components/security/SecureContentRenderer';
import { useTranslation } from 'react-i18next';

const News = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'article' | 'media'>('all');
  const { isMobile } = useIsMobile();
  const carouselApiRef = useRef<any>(null);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation('index');

  const { data: allNews, isLoading: isAllNewsLoading, error: allNewsError } = useQuery({
    queryKey: ["allNewsItems", currentLanguage],
    queryFn: ({ queryKey }) => getAllNewsItems({ queryKey }),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!currentLanguage,
    retry: 2
  });
  
  const { data: articles, isLoading: isArticlesLoading } = useQuery({
    queryKey: ["newsArticles", currentLanguage],
    queryFn: () => getNewsByType("article", currentLanguage),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!currentLanguage,
    retry: 2
  });
  
  const { data: media, isLoading: isMediaLoading } = useQuery({
    queryKey: ["newsMedia", currentLanguage],
    queryFn: () => getNewsByType("media", currentLanguage),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!currentLanguage,
    retry: 2
  });

  const isLoading = isAllNewsLoading || isArticlesLoading || isMediaLoading;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  useEffect(() => {
    if (isMobile && carouselApiRef.current) {
      const intervalId = setInterval(() => {
        if (carouselApiRef.current) {
          carouselApiRef.current.scrollNext();
        }
      }, 6000);
      return () => clearInterval(intervalId);
    }
  }, [isMobile, carouselApiRef]);

  const getFilteredItems = () => {
    switch (activeTab) {
      case 'article': return articles || [];
      case 'media': return media || [];
      default: return allNews || [];
    }
  };
  
  const newsItems = getFilteredItems().slice(0, 6);

  if (allNewsError || !currentLanguage) {
    return null;
  }

  return (
    <section id="news" className="apple-section bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="apple-section-title text-foreground">{t('news.title')}</h2>
          
          {/* Tabs */}
          <div className="inline-flex bg-secondary rounded-full p-1 mt-8">
            {(['all', 'article', 'media'] as const).map((tab) => (
              <button
                key={tab}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-foreground text-background' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' ? t('news.all') : tab === 'article' ? t('news.articles') : t('news.media')}
              </button>
            ))}
          </div>
        </div>
        
        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-secondary"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-secondary rounded w-1/4"></div>
                  <div className="h-6 bg-secondary rounded"></div>
                  <div className="h-16 bg-secondary rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isMobile ? (
          <Carousel 
            className="w-full" 
            setApi={(api: any) => carouselApiRef.current = api} 
            opts={{ loop: true, align: 'center' }}
          >
            <CarouselContent>
              {newsItems.map(item => (
                <CarouselItem key={item.id} className="basis-4/5 md:basis-1/2 lg:basis-1/3">
                  <NewsCard item={{...item, content: item.content || undefined}} formatDate={formatDate} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-6">
              <CarouselPrevious className="relative static left-0 right-auto translate-y-0 bg-card border-border" />
              <CarouselNext className="relative static right-0 left-auto translate-y-0 bg-card border-border" />
            </div>
          </Carousel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsItems.map(item => (
              <NewsCard key={item.id} item={{...item, content: item.content || undefined}} formatDate={formatDate} />
            ))}
          </div>
        )}
        
        {/* CTA */}
        <div className="text-center mt-12">
          <Link to={buildNavigationUrl("/news", currentLanguage)} className="apple-button">
            {t('news.viewAll')} 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const NewsCard = ({
  item,
  formatDate
}: {
  item: {
    id: string;
    title: string;
    type: string;
    excerpt: string;
    content?: string;
    published_date: string;
    featured_image?: string | null;
    thumbnail_url?: string | null;
    video_url?: string | null;
    slug: string;
  };
  formatDate: (date: string) => string;
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation('index');
  
  const getDisplayImage = () => {
    if (item.thumbnail_url?.trim()) return item.thumbnail_url;
    if (item.featured_image?.trim()) return item.featured_image;
    if (item.content) {
      const imgMatch = item.content.match(/<img[^>]+src="([^"]+)"/i);
      if (imgMatch?.[1]) return imgMatch[1];
    }
    return null;
  };
  
  const displayImage = getDisplayImage();

  return (
    <Card className="group overflow-hidden bg-card border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={buildNavigationUrl(`/news/${item.slug}`, currentLanguage)}>
        <div className="aspect-square bg-secondary relative overflow-hidden">
          {displayImage ? (
            <img 
              src={displayImage} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {item.type === 'media' ? (
                <Video className="h-12 w-12 text-muted-foreground" />
              ) : (
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm text-muted-foreground">{formatDate(item.published_date)}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            item.type === 'article' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
          }`}>
            {item.type === 'article' ? t('news.article') : t('news.mediaLabel')}
          </span>
        </div>
        <Link to={buildNavigationUrl(`/news/${item.slug}`, currentLanguage)}>
          <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {item.title}
          </h3>
        </Link>
        {item.type !== 'media' && (
          <SecureContentRenderer 
            content={item.excerpt.length > 100 ? `${item.excerpt.substring(0, 100)}...` : item.excerpt}
            className="text-muted-foreground text-sm mb-4 line-clamp-2"
          />
        )}
        <Link 
          to={buildNavigationUrl(`/news/${item.slug}`, currentLanguage)} 
          className="apple-button-link text-sm"
        >
          {item.type === 'article' ? t('news.readMore') : t('news.viewMedia')} 
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default News;
