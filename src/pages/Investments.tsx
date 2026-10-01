import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEOWrapper from "@/components/SEO/SEOWrapper";
import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import { getInvestments } from "@/services/investments";
import FullScreenInvestment from "@/components/FullScreenInvestment";

const InvestmentsPage = () => {
  const currentLanguage = useCurrentLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: investments, isLoading } = useQuery({
    queryKey: ["investments", currentLanguage],
    queryFn: () => getInvestments(currentLanguage),
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const sectionHeight = container.clientHeight;
      const index = Math.round(scrollTop / sectionHeight);
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const seoData = {
    title: currentLanguage === "el" ? "Οι Επενδύσεις μας | Advisable" : "Our Investments | Advisable",
    description: currentLanguage === "el"
      ? "Ανακαλύψτε τις καινοτόμες εταιρείες που υποστηρίζουμε ως Venture Studio"
      : "Discover the innovative companies we support as a Venture Studio",
    keywords: currentLanguage === "el"
      ? "επενδύσεις, venture studio, startups"
      : "investments, venture studio, startups",
  };

  return (
    <SEOWrapper {...seoData}>
      <div className="min-h-screen bg-background">
        <Header />

        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div
            ref={containerRef}
            className="h-screen overflow-y-auto snap-y snap-mandatory"
          >
            {investments?.map((investment, index) => (
              <FullScreenInvestment
                key={investment.id}
                investment={investment}
                isActive={activeIndex === index}
              />
            ))}

            <div className="snap-start">
              <Footer />
            </div>
          </div>
        )}
      </div>
    </SEOWrapper>
  );
};

export default InvestmentsPage;
