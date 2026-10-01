import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllInsights } from "@/services/insightsService";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import { useTranslation } from 'react-i18next';

const Blog = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation('index');
  const { data: posts, isLoading } = useQuery({
    queryKey: ['insights', currentLanguage],
    queryFn: ({ queryKey }) => getAllInsights({ queryKey }),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!currentLanguage
  });
  
  const { isMobile } = useIsMobile();
  const carouselApiRef = useRef<any>(null);

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

  const limitedPosts = posts?.slice(0, 3);

  return (
    <section id="insights" className="apple-section bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="apple-section-title text-foreground">
            {t('blog.title')}
          </h2>
          <p className="apple-section-subtitle">
            Expert perspectives on digital transformation and innovation
          </p>
        </div>
        
        {/* Blog Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-secondary"></div>
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
              {limitedPosts?.map(post => (
                <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
                  <BlogCard post={post} formatDate={formatDate} />
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
            {limitedPosts?.map(post => (
              <BlogCard key={post.id} post={post} formatDate={formatDate} />
            ))}
          </div>
        )}
        
        {/* CTA */}
        <div className="text-center mt-12">
          <Link to={buildNavigationUrl("/insights", currentLanguage)} className="apple-button">
            {t('blog.viewAll')} 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const BlogCard = ({
  post,
  formatDate
}: {
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    type: string;
    featured_image: string | null;
    published_date: string;
    language_code: string;
  };
  formatDate: (date: string) => string;
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation('index');

  const getDisplayImage = () => {
    if (post.featured_image?.trim()) return post.featured_image;
    if (post.content) {
      const imgMatch = post.content.match(/<img[^>]+src="([^"]+)"/i);
      if (imgMatch?.[1]) return imgMatch[1];
    }
    return null;
  };
  
  const displayImage = getDisplayImage();

  return (
    <Card className="group overflow-hidden bg-card border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={buildNavigationUrl(`/insights/${post.slug}`, currentLanguage)}>
        {displayImage ? (
          <div 
            className="aspect-video bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
            style={{ backgroundImage: `url(${displayImage})` }}
          ></div>
        ) : (
          <div className="aspect-video bg-secondary flex items-center justify-center">
            <ArrowRight className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </Link>
      <CardContent className="p-6">
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Calendar className="mr-2 h-4 w-4" />
          {formatDate(post.published_date)}
        </div>
        <Link to={buildNavigationUrl(`/insights/${post.slug}`, currentLanguage)}>
          <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <Link 
          to={buildNavigationUrl(`/insights/${post.slug}`, currentLanguage)} 
          className="apple-button-link text-sm"
        >
          {t('blog.readMore')} 
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default Blog;
