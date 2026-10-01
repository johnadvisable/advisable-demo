import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getInsightBySlug } from "@/services/insightsService";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from 'react-i18next';
import SecureContentRenderer from '@/components/security/SecureContentRenderer';
import SEOWrapper from "@/components/SEO/SEOWrapper";
import InsightBreadcrumb from "@/components/SEO/InsightBreadcrumb";
import ArticleHeader, { calculateReadingTime } from "@/components/SEO/ArticleHeader";
import InsightStructuredData from "@/components/SEO/InsightStructuredData";
import SocialShareButtons from "@/components/SEO/SocialShareButtons";
import RelatedInsights from "@/components/SEO/RelatedInsights";
import { buildLocalizedUrl } from "@/utils/multilanguageUtils";
import { useLanguage } from "@/context/LanguageContext";

const InsightsItem = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const { t, i18n } = useTranslation('insightsitem');
  const { currentLanguage } = useLanguage();

  const {
    data: insight,
    isLoading,
    error
  } = useQuery({
    queryKey: ['insight', slug, i18n.language],
    queryFn: () => getInsightBySlug(slug!, i18n.language),
    enabled: !!slug && !!i18n.language,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: t('error'),
        description: t('errorDescription'),
        variant: "destructive",
      });
    }
  }, [error, toast, t]);

  // Calculate reading time from content
  const readingTime = insight?.content ? calculateReadingTime(insight.content) : 1;

  // Generate keywords from content type and title
  const generateKeywords = () => {
    const baseKeywords = ['Advisable', 'insights', 'digital transformation'];
    if (insight?.type) baseKeywords.push(insight.type);
    if (insight?.title) {
      const titleWords = insight.title.split(' ').slice(0, 5);
      baseKeywords.push(...titleWords);
    }
    return baseKeywords.join(', ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header variant="light" />
        <div className="container mx-auto pt-32 pb-12 px-4 max-w-4xl">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="h-4 bg-muted rounded w-48 mb-6"></div>
            {/* Title skeleton */}
            <div className="h-12 bg-muted rounded w-3/4 mb-4"></div>
            {/* Meta bar skeleton */}
            <div className="flex gap-4 mb-8 pb-6 border-b border-border">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 bg-muted rounded w-28"></div>
            </div>
            {/* Image skeleton */}
            <div className="aspect-video bg-muted rounded-lg mb-8"></div>
            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="min-h-screen bg-background">
        <Header variant="light" />
        <div className="container mx-auto pt-32 pb-12 px-4">
          <h1 className="text-3xl font-bold mb-4 text-foreground">{t('insightNotFound')}</h1>
          <p className="mb-6 text-muted-foreground">{t('insightNotFoundDescription')}</p>
          <Link 
            to={buildLocalizedUrl('/insights', currentLanguage)} 
            className="text-primary hover:text-primary/80 transition-colors"
          >
            &larr; {t('backToInsights')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SEOWrapper
      title={`${insight.title} - Insights - Advisable`}
      description={insight.excerpt || 'Read our latest insights on digital transformation and technology trends.'}
      keywords={generateKeywords()}
      type="article"
      publishedTime={insight.published_date}
      author={insight.author}
      image={insight.featured_image || undefined}
      ogImage={insight.featured_image || undefined}
      twitterImage={insight.featured_image || undefined}
    >
      <div className="min-h-screen bg-background">
        <Header variant="light" />
        
        {/* Structured Data */}
        <InsightStructuredData
          title={insight.title}
          excerpt={insight.excerpt}
          content={insight.content}
          slug={slug!}
          publishedDate={insight.published_date}
          updatedDate={insight.updated_at}
          author={insight.author}
          featuredImage={insight.featured_image}
          keywords={generateKeywords()}
        />
        
        <article className="container mx-auto pt-32 pb-12 px-4 max-w-4xl">
          {/* Breadcrumb with schema */}
          <InsightBreadcrumb title={insight.title} slug={slug!} />
          
          {/* Back link for mobile */}
          <Link 
            to={buildLocalizedUrl('/insights', currentLanguage)} 
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 sm:hidden transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToInsights')}
          </Link>
          
          {/* Article Header with meta info */}
          <ArticleHeader
            title={insight.title}
            publishedDate={insight.published_date}
            updatedDate={insight.updated_at}
            author={insight.author}
            readingTime={readingTime}
            featuredImage={insight.featured_image}
            excerpt={insight.excerpt}
          />

          {/* Featured Image */}
          {insight.featured_image && (
            <figure className="mb-10">
              <img 
                src={insight.featured_image} 
                alt={insight.title}
                width={1200}
                height={630}
                className="w-full h-auto rounded-lg shadow-lg object-cover aspect-video" 
                loading="eager"
                fetchPriority="high"
              />
            </figure>
          )}


          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert
            prose-headings:text-foreground prose-headings:font-bold
            prose-p:text-foreground/90 prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:text-foreground/90 prose-ol:text-foreground/90
            prose-li:marker:text-primary
            prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
            prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-muted prose-pre:border prose-pre:border-border
          ">
            {insight.content ? (
              <SecureContentRenderer 
                content={insight.content} 
                className="article-content"
              />
            ) : (
              <SecureContentRenderer 
                content={insight.excerpt || ''} 
                className="article-content"
              />
            )}
          </div>
          
          {/* Social Sharing & Back link */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link 
              to={buildLocalizedUrl('/insights', currentLanguage)} 
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToInsights')}
            </Link>
            
            <SocialShareButtons 
              title={insight.title}
              slug={slug!}
            />
          </div>
          
          {/* Related Insights */}
          <RelatedInsights 
            currentSlug={slug!}
            currentType={insight.type}
          />
        </article>
        
        <Footer />
      </div>
    </SEOWrapper>
  );
};

export default InsightsItem;
