import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllNewsItems, getNewsByType } from "@/services/newsService";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Video, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import SecureContentRenderer from '@/components/security/SecureContentRenderer';
import SEOWrapper from "@/components/SEO/SEOWrapper";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import Header from "@/components/Header";
import { useTranslation } from 'react-i18next';

const NewsPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'article' | 'media'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { t, i18n } = useTranslation('news');
  
  const { data: allNewsItems, isLoading: isAllItemsLoading } = useQuery({
    queryKey: ["allNewsItems", i18n.language],
    queryFn: ({ queryKey }) => {
      return getAllNewsItems({ queryKey });
    },
    staleTime: 0, // Force refetch on language change
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!i18n.language
  });
  
  const { data: articles, isLoading: isArticlesLoading } = useQuery({
    queryKey: ['newsArticles', i18n.language],
    queryFn: () => {
      return getNewsByType('article', i18n.language);
    },
    staleTime: 0, // Force refetch on language change
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!i18n.language
  });

  const { data: media, isLoading: isMediaLoading } = useQuery({
    queryKey: ["newsMedia", i18n.language],
    queryFn: () => {
      return getNewsByType("media", i18n.language);
    },
    staleTime: 0, // Force refetch on language change
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!i18n.language
  });

  const isLoading = isAllItemsLoading || isArticlesLoading || isMediaLoading;
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };



  const getCurrentItems = () => {
    let items = [];
    
    switch(activeTab) {
      case 'all':
        items = allNewsItems || [];
        break;
      case 'article':
        items = articles || [];
        break;
      case 'media':
        items = media || [];
        break;
    }
    
    items = [...items].sort((a, b) => 
      new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
    );
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    return {
      items: items.slice(indexOfFirstItem, indexOfLastItem),
      totalItems: items.length,
      totalPages: Math.ceil(items.length / itemsPerPage)
    };
  };
  
  const { items, totalPages } = getCurrentItems();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <SEOWrapper>
      <div className="min-h-screen bg-white">
        <Header variant="light" />
      <div className="container mx-auto py-16 px-4 pt-32">
        <h1 className="text-5xl font-bold mb-6 text-center text-advisable-darkPurple">{t('title')}</h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        
        <Tabs defaultValue="all" className="mb-10" onValueChange={(value) => {
          setActiveTab(value as 'all' | 'article' | 'media');
          setCurrentPage(1);
        }}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="all">{t('tabs.allNews')}</TabsTrigger>
            <TabsTrigger value="article">{t('tabs.articles')}</TabsTrigger>
            <TabsTrigger value="media">{t('tabs.media')}</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(itemsPerPage)].map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500 mb-2 h-4 bg-gray-200 w-1/4 rounded"></div>
                  <h3 className="h-6 bg-gray-200 mb-2 rounded"></h3>
                  <p className="h-16 bg-gray-200 mb-4 rounded"></p>
                  <div className="h-4 bg-gray-200 w-1/3 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                  <NewsCard key={item.id} item={item} formatDate={formatDate} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-medium text-gray-600 mb-4">{t('emptyState.title')}</h3>
                <p className="text-gray-500">{t('emptyState.description')}</p>
              </div>
            )}
            
            {totalPages > 1 && (
              <Pagination className="mt-12">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="cursor-pointer" 
                      />
                    </PaginationItem>
                  )}
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        isActive={currentPage === i + 1} 
                        onClick={() => handlePageChange(i + 1)}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="cursor-pointer" 
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
      </div>
    </SEOWrapper>
  );
};

const NewsCard = ({ item, formatDate }: {
  item: {
    id: string;
    title: string;
    type: string;
    excerpt: string;
    content?: string | null;
    published_date: string;
    featured_image: string | null;
    thumbnail_url?: string | null;
    video_url?: string | null;
    slug: string;
  },
  formatDate: (date: string) => string
}) => {
  const { t } = useTranslation('news');
  
  // Extract first image from content if no featured image or thumbnail
  const getDisplayImage = () => {
    // First priority: thumbnail (for media items)
    if (item.thumbnail_url && item.thumbnail_url.trim()) {
      return item.thumbnail_url;
    }
    
    // Second priority: featured_image
    if (item.featured_image && item.featured_image.trim()) {
      return item.featured_image;
    }
    
    // Third priority: extract from content
    if (item.content) {
      const imgMatch = item.content.match(/<img[^>]+src="([^"]+)"/i);
      if (imgMatch && imgMatch[1]) {
        return imgMatch[1];
      }
    }
    
    return null;
  };
  
  const displayImage = getDisplayImage();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/news/${item.slug}`}>
        <div className="aspect-square bg-gray-200 relative">
          {displayImage ? (
            <img
              src={displayImage}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-advisable-lightGray">
              {item.type === 'media' ? (
                <Video className="h-12 w-12 text-advisable-darkPurple/50" />
              ) : (
                <Image className="h-12 w-12 text-advisable-darkPurple/50" />
              )}
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-500 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(item.published_date)}
          </div>
          <Badge variant={item.type === "article" ? "default" : "secondary"}>
            {item.type === "article" ? t('badges.article') : t('badges.media')}
            {item.type === "media" && <Video className="ml-1 h-3 w-3" />}
          </Badge>
        </div>
        <Link to={`/news/${item.slug}`}>
          <h3 className="text-xl font-bold mb-2 text-advisable-darkPurple hover:text-advisable-purple transition-colors">
            {item.title}
          </h3>
        </Link>
        {item.type !== 'media' && (
          <SecureContentRenderer 
            content={item.excerpt.length > 120 ? `${item.excerpt.substring(0, 120)}...` : item.excerpt}
            className="text-gray-600 mb-4 line-clamp-2"
          />
        )}
        <Link
          to={`/news/${item.slug}`}
          className="inline-flex items-center text-advisable-blue hover:text-advisable-purple transition-colors"
        >
          {item.type === "article" ? t('actions.readMore') : t('actions.viewMedia')}{" "}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default NewsPage;
