import { Link, useSearchParams } from "react-router-dom";
import { stripHtml } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin, Briefcase, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import SEOWrapper from "@/components/SEO/SEOWrapper";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

const languageIdMap: Record<string, number> = {
  en: 1, es: 2, fr: 3, de: 4, el: 5, it: 10,
};

const cityLabels: Record<string, string> = {
  athens: "Athens",
  patras: "Patras",
};

const departmentLabels: Record<string, string> = {
  marketing: "Marketing",
  development: "Development",
  graphics: "Graphics",
};

const employmentLabels: Record<string, string> = {
  "full-time": "Full-Time",
  "part-time": "Part-Time",
  "contract": "Contract",
};

const Careers = () => {
  useTranslation('shared');
  const { currentLanguage } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const cityFilter = searchParams.get("city") || "all";
  const deptFilter = searchParams.get("department") || "all";

  const langId = languageIdMap[currentLanguage] || 1;

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["job-listings", langId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_listings")
        .select(`*, job_listing_translations(*)`)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data || []).map((job: any) => {
        const translation = job.job_listing_translations?.find(
          (tr: any) => tr.language_id === langId
        ) || job.job_listing_translations?.[0];
        return { ...job, translation };
      });
    },
    staleTime: 5 * 60 * 1000,
  });

  const filtered = jobs.filter((job: any) => {
    if (cityFilter !== "all" && job.city !== cityFilter) return false;
    if (deptFilter !== "all" && job.department !== deptFilter) return false;
    return true;
  });

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };

  return (
    <SEOWrapper
      title="Careers - Advisable"
      description="Join our team at Advisable. Explore open positions in marketing, development, design and more across Athens and Patras."
      keywords="careers, jobs, advisable, marketing jobs, developer jobs, athens, patras"
      image="/images/og-careers.png"
      type="website"
    >
      <div className="min-h-screen bg-background">
        <Header variant="light" />

        {/* Hero */}
        <div className="relative pt-20 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(220,60%,15%)]">
          <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Join Our Team
              </h1>
              <p className="text-xl text-gray-200 mb-4">
                We're looking for talented people to help us build the future of digital. Explore our open positions below.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  {cityFilter === "all" ? "All Cities" : cityLabels[cityFilter] || cityFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={cityFilter} onValueChange={(v) => updateFilter("city", v)}>
                  <DropdownMenuRadioItem value="all">All Cities</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="athens">Athens</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="patras">Patras</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  {deptFilter === "all" ? "All Departments" : departmentLabels[deptFilter] || deptFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={deptFilter} onValueChange={(v) => updateFilter("department", v)}>
                  <DropdownMenuRadioItem value="all">All Departments</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="marketing">Marketing</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="development">Development</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="graphics">Graphics</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {(cityFilter !== "all" || deptFilter !== "all") && (
              <Button variant="ghost" size="sm" onClick={() => setSearchParams({})}>
                Clear Filters
              </Button>
            )}
          </div>

          {/* Job Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-56 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((job: any) => (
                <Link key={job.id} to={`/careers/${job.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {cityLabels[job.city] || job.city}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {departmentLabels[job.department] || job.department}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {employmentLabels[job.employment_type] || job.employment_type}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {job.translation?.title || job.slug}
                      </h3>
                      <p className="text-muted-foreground text-sm flex-grow line-clamp-3">
                        {stripHtml(job.translation?.short_description)}
                      </p>
                      <div className="mt-4 flex items-center text-primary text-sm font-medium">
                        Apply Now <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-muted-foreground mb-2">No open positions found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </SEOWrapper>
  );
};

export default Careers;
