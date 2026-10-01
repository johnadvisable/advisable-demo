
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBlogPostBySlug, getBlogPostsByCategory, BlogPost as BlogPostType } from "@/services/blogService";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import SEOWrapper from "@/components/SEO/SEOWrapper";
import ArticleStructuredData from "@/components/SEO/ArticleStructuredData";
import PageBreadcrumb from "@/components/SEO/PageBreadcrumb";
import { useTranslation } from 'react-i18next';
import SecureContentRenderer from '@/components/security/SecureContentRenderer';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { t, i18n } = useTranslation('blogpost');

  const {
    data: post,
    isLoading: isPostLoading,
    error: postError
  } = useQuery({
    queryKey: ['blogPost', slug, i18n.language],
    queryFn: () => getBlogPostBySlug(slug || '', i18n.language),
    enabled: !!slug
  });

  const {
    data: relatedPosts,
    isLoading: isRelatedLoading
  } = useQuery({
    queryKey: ['relatedPosts', post?.category, i18n.language],
    queryFn: () => getBlogPostsByCategory(post?.category || '', i18n.language),
    enabled: !!post?.category,
  });

  useEffect(() => {
    if (postError) {
      toast({
        title: t('error'),
        description: t('errorDescription'),
        variant: "destructive",
      });
    }
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [postError, toast]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  const filteredRelatedPosts = relatedPosts?.filter(
    relatedPost => relatedPost.id !== post?.id
  ).slice(0, 3);

  if (isPostLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-12"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('articleNotFound')}</h1>
        <p className="mb-6">{t('articleNotFoundDescription')}</p>
        <Link to="/blog" className="text-advisable-blue hover:text-advisable-purple">
          &larr; {t('backToBlog')}
        </Link>
      </div>
    );
  }

  return (
    <SEOWrapper 
      type="article"
      publishedTime={post.published_date || undefined}
      author={post.author || undefined}
      image={post.featured_image || undefined}
    >
      <ArticleStructuredData
        title={post.title}
        excerpt={post.excerpt}
        content={post.content}
        slug={slug!}
        publishedDate={post.published_date}
        author={post.author}
        featuredImage={post.featured_image}
        section="blog"
      />
      <PageBreadcrumb items={[
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: `/blog/${slug}` }
      ]} />
      <div className="min-h-screen bg-white">
      <Header variant="light" />
      <div className="container mx-auto py-12 pt-32">
        {/* Back button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-gray-600 hover:text-advisable-blue mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToBlog')}
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Article header */}
          <header className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-advisable-darkPurple mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{t('publishedOn')} {formatDate(post.published_date)}</span>
            </div>
            <SecureContentRenderer 
              content={post.excerpt} 
              className="text-xl text-gray-700 italic"
            />
          </header>

          <Separator className="my-8" />

          {/* Article content */}
          <div className="prose prose-lg max-w-none">
            <SecureContentRenderer 
              content={post.content} 
              className="article-content"
            />
          </div>

          {/* Author section */}
          <div className="mt-12 p-6 bg-advisable-lightGray rounded-lg flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
            <div>
              <h3 className="text-xl font-bold">{post.author}</h3>
              <p className="text-gray-600">{t('authorRole')}</p>
            </div>
          </div>
        </article>

        {/* Related posts section */}
        {filteredRelatedPosts && filteredRelatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">{t('relatedArticles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isRelatedLoading
                ? [...Array(3)].map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <div className="aspect-video bg-gray-200"></div>
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                        <div className="h-6 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>
                      </CardContent>
                    </Card>
                  ))
                : filteredRelatedPosts.map((relatedPost: BlogPostType) => (
                    <Card
                      key={relatedPost.id}
                      className="hover:shadow-lg transition-shadow duration-300"
                    >
                      <div 
                        className="aspect-video bg-cover bg-center"
                        style={{
                          backgroundImage: relatedPost.featured_image
                            ? `url(${relatedPost.featured_image})`
                            : "url(/placeholder.svg)",
                        }}
                      ></div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-3">
                          <Badge
                            variant="outline"
                            className="text-advisable-blue border-advisable-blue"
                          >
                            {relatedPost.category}
                          </Badge>
                          <div className="text-sm text-gray-500">
                            {formatDate(relatedPost.published_date)}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-advisable-darkPurple">
                          {relatedPost.title}
                        </h3>
                         <SecureContentRenderer 
                           content={relatedPost.excerpt} 
                           className="text-gray-600 mb-4 line-clamp-2"
                         />
                        <Link
                          to={`/blog/${relatedPost.slug}`}
                          className="inline-flex items-center text-advisable-blue hover:text-advisable-purple transition-colors"
                        >
                          {t('readMore')} <span className="ml-2">→</span>
                        </Link>
                      </CardContent>
                    </Card>
                   ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </SEOWrapper>
  );
};

export default BlogPost;
