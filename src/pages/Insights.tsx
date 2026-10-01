import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllInsights, InsightPost } from "@/services/insightsService";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from 'react-i18next';
import SEOWrapper from "@/components/SEO/SEOWrapper";
import ItemListSchema from "@/components/SEO/ItemListSchema";


const Insights = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState<InsightPost[]>([]);
  const [currentPosts, setCurrentPosts] = useState<InsightPost[]>([]);
  const postsPerPage = 6;
  const { toast } = useToast();
  const { t, i18n } = useTranslation('insights');

  const {
    data: insights,
    isLoading,
    error
  } = useQuery({
    queryKey: ['insights', i18n.language],
    queryFn: ({ queryKey }) => {
      return getAllInsights({ queryKey });
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!i18n.language
  });

  useEffect(() => {
    if (error) {
      toast({
        title: t('error'),
        description: t('errorDescription'),
        variant: "destructive"
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (insights) {
      let filtered = insights;
      if (searchTerm) {
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredPosts(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, insights]);

  useEffect(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    setCurrentPosts(filteredPosts.slice(indexOfFirstPost, indexOfLastPost));
  }, [filteredPosts, currentPage, postsPerPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getDisplayImage = (post: InsightPost): string => {
    if (post.featured_image && post.featured_image.trim()) {
      if (post.featured_image.startsWith('http') || post.featured_image.startsWith('//')) {
        return post.featured_image;
      }
      
      if (post.featured_image.includes('supabase.co/storage/v1/object/public/')) {
        return post.featured_image;
      }
      
      if (post.featured_image.startsWith('/')) {
        return post.featured_image;
      }
    }
    
    if (post.content) {
      const imgMatch = post.content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch?.[1]) {
        return imgMatch[1];
      }
    }
    
    return '/placeholder-article.jpg';
  };

  return (
    <SEOWrapper
      title="Insights - Advisable"
      description="Expert insights and thought leadership on digital transformation, technology trends, AI innovations, and business strategy from our consulting experts."
      keywords="digital insights, technology trends, AI innovations, business strategy, thought leadership, consulting expertise"
      type="website"
    >
      {insights && insights.length > 0 && (
        <ItemListSchema
          listName="Advisable Insights"
          items={insights.map(post => ({
            name: post.title,
            url: `/insights/${post.slug}`,
            image: post.featured_image || undefined,
            description: post.excerpt
          }))}
        />
      )}
      <div className="min-h-screen bg-white">
      <Header variant="light" />
      <div className="bg-advisable-lightGray py-20 pt-32">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-advisable-darkPurple mb-6">{t('title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto py-12">
        <div className="mb-10 flex justify-center">
          <div className="w-full md:w-1/2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="pl-10"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">
              {t('noInsightsFound')}
            </h3>
            <p className="mt-2 text-gray-500">
              {t('noInsightsDescription')}
            </p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => {
                const displayImage = getDisplayImage(post);
                const postDate = post.published_date ? formatDate(post.published_date) : '';
                
                return (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <Link to={`/insights/${post.slug}`} className="block relative">
                      <div 
                        className="aspect-video bg-cover bg-center bg-gray-100"
                        style={{ 
                          backgroundImage: `url(${displayImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      >
                        <img 
                          src={displayImage} 
                          alt={post.title || 'Insight image'}
                          className="opacity-0 w-full h-full"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-gray-500">
                          {postDate}
                        </div>
                        {post.author && (
                          <div className="text-sm text-advisable-purple font-medium">
                            {post.author}
                          </div>
                        )}
                      </div>
                      <Link to={`/insights/${post.slug}`}>
                        <h3 className="text-xl font-bold mb-2 text-advisable-darkPurple hover:text-advisable-purple transition-colors">
                          {post.title || 'Untitled Post'}
                        </h3>
                      </Link>
                      <Link
                        to={`/insights/${post.slug}`}
                        className="inline-flex items-center text-advisable-blue hover:text-advisable-purple transition-colors"
                      >
                        {t('readMore')} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-12">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                    />
                  </PaginationItem>

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

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} 
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>
      <Footer />
      </div>
    </SEOWrapper>
  );
};

export default Insights;