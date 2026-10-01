import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllInsights, InsightPost } from "@/services/insightsService";
import { getAllNewsItems, NewsItem } from "@/services/newsService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Video, Calendar } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import SEOWrapper from "@/components/SEO/SEOWrapper";
import ItemListSchema from "@/components/SEO/ItemListSchema";
import SecureContentRenderer from "@/components/security/SecureContentRenderer";
import { buildNavigationUrl } from "@/utils/multilanguageUtils";

type HubKind = "insight" | "article" | "media";

interface HubItem {
  id: string;
  kind: HubKind;
  title: string;
  excerpt: string;
  image: string | null;
  date: string;
  url: string;
}

const extractImage = (content?: string | null): string | null => {
  if (!content) return null;
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || null;
};

const InsightsHub = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | HubKind>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { t, i18n } = useTranslation("insights");
  const currentLanguage = i18n.language === "en" ? null : i18n.language;

  const localized = (path: string) =>
    currentLanguage ? buildNavigationUrl(path, currentLanguage) : path;

  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ["insights", i18n.language],
    queryFn: ({ queryKey }) => getAllInsights({ queryKey }),
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled: !!i18n.language,
  });

  const { data: news, isLoading: newsLoading } = useQuery({
    queryKey: ["allNewsItems", i18n.language],
    queryFn: ({ queryKey }) => getAllNewsItems({ queryKey }),
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled: !!i18n.language,
  });

  const isLoading = insightsLoading || newsLoading;

  const allItems: HubItem[] = useMemo(() => {
    const fromInsights = (insights || []).map((post: InsightPost) => ({
      id: `insight-${post.id}`,
      kind: "insight" as HubKind,
      title: post.title || "",
      excerpt: post.excerpt || "",
      image:
        (post.featured_image && post.featured_image.trim()) ||
        extractImage(post.content),
      date: post.published_date,
      url: localized(`/insights/${post.slug}`),
    }));

    const fromNews = (news || []).map((item: NewsItem) => ({
      id: `news-${item.id}`,
      kind: (item.type === "media" ? "media" : "article") as HubKind,
      title: item.title || "",
      excerpt: item.type === "media" ? "" : item.excerpt || "",
      image:
        (item.thumbnail_url && item.thumbnail_url.trim()) ||
        (item.featured_image && item.featured_image.trim()) ||
        extractImage(item.content),
      date: item.published_date,
      url: localized(`/news/${item.slug}`),
    }));

    return [...fromInsights, ...fromNews].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [insights, news, i18n.language]);

  const filteredItems = useMemo(() => {
    let items = allItems;
    if (activeTab !== "all") {
      items = items.filter((item) => item.kind === activeTab);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.excerpt.toLowerCase().includes(term)
      );
    }
    return items;
  }, [allItems, activeTab, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const pageItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return "";
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const badgeLabel = (kind: HubKind) =>
    kind === "insight"
      ? t("tabs.insights")
      : kind === "media"
      ? t("tabs.media")
      : t("tabs.news");

  return (
    <SEOWrapper
      title="Insights - Advisable"
      description="Expert insights, articles, news and media from Advisable on digital transformation, technology trends, AI innovations and business strategy."
      keywords="digital insights, articles, company news, technology trends, AI innovations, business strategy"
      type="website"
    >
      {insights && insights.length > 0 && (
        <ItemListSchema
          listName="Advisable Insights"
          items={insights.map((post) => ({
            name: post.title,
            url: `/insights/${post.slug}`,
            image: post.featured_image || undefined,
            description: post.excerpt,
          }))}
        />
      )}
      <div className="min-h-screen bg-white">
        <Header variant="light" />

        <div className="bg-advisable-lightGray py-20 pt-32">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-5xl font-bold text-advisable-darkPurple mb-6">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="container mx-auto py-12 px-4">
          <div className="mb-8 flex justify-center">
            <div className="w-full md:w-1/2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <Tabs
            value={activeTab}
            className="mb-10"
            onValueChange={(value) => {
              setActiveTab(value as "all" | HubKind);
              setCurrentPage(1);
            }}
          >
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
              <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
              <TabsTrigger value="insight">{t("tabs.insights")}</TabsTrigger>
              <TabsTrigger value="article">{t("tabs.news")}</TabsTrigger>
              <TabsTrigger value="media">{t("tabs.media")}</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                    <div className="h-6 bg-gray-200 rounded mb-3" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : pageItems.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700">
                {t("noInsightsFound")}
              </h3>
              <p className="mt-2 text-gray-500">{t("noInsightsDescription")}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pageItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  >
                    <Link to={item.url} className="block">
                      <div className="aspect-video bg-advisable-lightGray flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : item.kind === "media" ? (
                          <Video className="h-12 w-12 text-advisable-darkPurple/40" />
                        ) : (
                          <ArrowRight className="h-12 w-12 text-advisable-darkPurple/40" />
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(item.date)}
                        </span>
                        <Badge
                          variant={
                            item.kind === "insight" ? "default" : "secondary"
                          }
                        >
                          {badgeLabel(item.kind)}
                        </Badge>
                      </div>
                      <Link to={item.url}>
                        <h3 className="text-xl font-bold mb-2 text-advisable-darkPurple hover:text-advisable-purple transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      {item.excerpt && (
                        <SecureContentRenderer
                          content={item.excerpt}
                          className="text-gray-600 mb-4 line-clamp-3"
                        />
                      )}
                      <Link
                        to={item.url}
                        className="mt-auto inline-flex items-center text-advisable-blue hover:text-advisable-purple transition-colors"
                      >
                        {t("readMore")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

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

        <Footer />
      </div>
    </SEOWrapper>
  );
};

export default InsightsHub;
