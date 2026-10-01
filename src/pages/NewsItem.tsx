import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getNewsItemBySlug } from "@/services/newsService";
import { ArrowLeft, Calendar, Image, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { useTranslation } from 'react-i18next';
import { useEffect } from "react";
import SecureContentRenderer from '@/components/security/SecureContentRenderer';
import SEOWrapper from "@/components/SEO/SEOWrapper";
import ArticleStructuredData from "@/components/SEO/ArticleStructuredData";
import PageBreadcrumb from "@/components/SEO/PageBreadcrumb";

// Declare Instagram global
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process(): void;
      };
    };
  }
}

const NewsItem = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { t, i18n } = useTranslation('newsitem');

  const { data: newsItem, isLoading, error } = useQuery({
    queryKey: ['newsItem', slug, i18n.language],
    queryFn: () => getNewsItemBySlug(slug!, i18n.language),
    enabled: !!slug,
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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  const isInstagramUrl = (url: string) => {
    return url?.includes('instagram.com');
  };

  const isBunnyCDNVideo = (url: string) => {
    return url?.includes('vz-21732ef9-3d0.b-cdn.net') && url?.includes('.mp4');
  };

  const isBunnyCDNImage = (url: string) => {
    return url?.includes('vz-21732ef9-3d0.b-cdn.net') && !url?.includes('.mp4');
  };

  const isSupabaseStorageImage = (url: string) => {
    return url?.includes('supabase.co/storage/v1/object/public/') && (url?.includes('.jpg') || url?.includes('.jpeg') || url?.includes('.png') || url?.includes('.gif') || url?.includes('.webp'));
  };

  const isImageUrl = (url: string) => {
    return isBunnyCDNImage(url) || isSupabaseStorageImage(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header variant="light" />
        <div className="container mx-auto py-12 pt-32">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-12"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-white">
        <Header variant="light" />
        <div className="container mx-auto py-12 pt-32 text-center">
          <h1 className="text-3xl font-bold mb-4">{t('notFound')}</h1>
          <p className="mb-6">{t('notFoundDescription')}</p>
          <Link to="/news" className="text-advisable-blue hover:text-advisable-purple">
            &larr; {t('backToNews')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SEOWrapper
      title={newsItem ? `${newsItem.title} - News - Advisable` : 'News - News - Advisable'}
      description={newsItem?.content?.substring(0, 160) || 'Read the latest news and updates from Advisable.'}
      keywords="company news, technology updates, industry news"
      type="article"
      publishedTime={newsItem?.published_date}
    >
      <ArticleStructuredData
        title={newsItem.title}
        content={newsItem.content || undefined}
        slug={slug!}
        publishedDate={newsItem.published_date}
        featuredImage={newsItem.featured_image}
        section="news"
      />
      <PageBreadcrumb items={[
        { name: 'News', path: '/news' },
        { name: newsItem.title, path: `/news/${slug}` }
      ]} />
      <div className="min-h-screen bg-white">
      <Header variant="light" />
      <div className="container mx-auto py-12 pt-32">
        <Link to="/news" className="inline-flex items-center text-gray-600 hover:text-advisable-blue mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToNews')}
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Badge className="mb-4" variant={newsItem.type === 'article' ? 'default' : 'secondary'}>
              {newsItem.type === 'article' ? t('badges.article') : t('badges.media')}
              {newsItem.type === 'media' && <Image className="ml-1 h-3 w-3" />}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-advisable-darkPurple mb-4">
              {newsItem.title}
            </h1>
            <div className="flex items-center text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{t('publishedOn')} {formatDate(newsItem.published_date)}</span>
            </div>
          </header>

          <Separator className="my-8" />

          {newsItem.type === 'article' ? (
            <div className="prose prose-lg max-w-none">
              {newsItem.content ? (
                <SecureContentRenderer content={newsItem.content} className="article-content" />
              ) : (
                <p>{t('content.comingSoon')}</p>
              )}
            </div>
          ) : (
            <div className="mb-8">
              {/* Display full content for media items ABOVE the media */}
              <div className="prose prose-lg max-w-none mb-8">
                <SecureContentRenderer content={newsItem.content || ''} className="media-content text-gray-700 leading-relaxed whitespace-pre-line" />
              </div>
              
              <Separator className="my-8" />
              
              {newsItem.featured_image && isBunnyCDNVideo(newsItem.featured_image) ? (
                // Bunny CDN Video - 9:16 aspect ratio (1080 x 1920)
                <div className="max-w-md mx-auto bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '9/16' }}>
                  <video 
                    src={newsItem.featured_image} 
                    className="w-full h-full object-cover" 
                    controls 
                    poster={newsItem.thumbnail_url || (newsItem.featured_image ? newsItem.featured_image.replace('.mp4', '_thumbnail.jpg') : undefined)}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : newsItem.featured_image && isImageUrl(newsItem.featured_image) ? (
                // Image (Bunny CDN or Supabase Storage)
                <div className="mb-8">
                  <img src={newsItem.featured_image} alt={newsItem.title} className="w-full h-auto rounded-lg shadow-lg" loading="lazy" />
                  {newsItem.video_url && isInstagramUrl(newsItem.video_url) && (
                    <div className="mt-4 text-center">
                      <a href={newsItem.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-advisable-blue hover:text-advisable-purple">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t('instagram.viewOriginal')}
                      </a>
                    </div>
                  )}
                </div>
              ) : newsItem.thumbnail_url && isImageUrl(newsItem.thumbnail_url) ? (
                // Thumbnail Image (for videos without direct image featured_image)
                <div className="mb-8">
                  <img src={newsItem.thumbnail_url} alt={newsItem.title} className="w-full h-auto rounded-lg shadow-lg" loading="lazy" />
                  {newsItem.video_url && isInstagramUrl(newsItem.video_url) && (
                    <div className="mt-4 text-center">
                      <a href={newsItem.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-advisable-blue hover:text-advisable-purple">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t('instagram.viewOriginal')}
                      </a>
                    </div>
                  )}
                </div>
              ) : newsItem.video_url ? (
                isInstagramUrl(newsItem.video_url) ? (
                  <div className="instagram-embed-container">
                    <blockquote className="instagram-media" data-instgrm-permalink={newsItem.video_url} data-instgrm-version="14">
                      <div style={{ padding: '16px' }}>
                        <a href={newsItem.video_url} style={{
                          color: '#000',
                          fontFamily: 'Arial,sans-serif',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 'normal',
                          lineHeight: '17px',
                          textDecoration: 'none',
                          wordWrap: 'break-word'
                        }} target="_blank" rel="noopener noreferrer">
{t('instagram.viewPost')}
                        </a>
                      </div>
                    </blockquote>
                    <script async src="//www.instagram.com/embed.js" onLoad={() => {
                      if (window.instgrm) {
                        window.instgrm.Embeds.process();
                      }
                    }}></script>
                  </div>
                ) : (
                  <div className="max-w-md mx-auto bg-gray-200 rounded-lg flex items-center justify-center" style={{ aspectRatio: '9/16' }}>
                    <iframe 
                      src={newsItem.video_url} 
                      title={newsItem.title} 
                      className="w-full h-full rounded-lg" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                )
              ) : newsItem.featured_image ? (
                <div className="mb-8">
                  <img src={newsItem.featured_image} alt={newsItem.title} className="w-full h-auto rounded-lg shadow-lg" loading="lazy" />
                </div>
              ) : (
                <div className="max-w-md mx-auto bg-gray-200 rounded-lg flex items-center justify-center" style={{ aspectRatio: '9/16' }}>
                  <div className="text-center p-12">
                    <Image className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg text-gray-500">{t('content.mediaComingSoon')}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </article>
      </div>
      </div>
    </SEOWrapper>
  );
};

export default NewsItem;