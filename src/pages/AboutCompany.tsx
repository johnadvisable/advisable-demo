
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import aboutHeroBg from "@/assets/about-hero-bg.jpg";

import {
  Loader2, Rocket, Target, ArrowRight, Globe, ShieldCheck, Lightbulb, Heart, BarChart3, Handshake, TrendingUp
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fetchCompanyInfo, fetchCompanyValues } from "@/services/companyInfoService";
import { useTranslation } from "react-i18next";
import SEOWrapper from "@/components/SEO/SEOWrapper";

const AboutCompany = () => {
  const { t } = useTranslation('aboutcompany');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { currentLanguage } = useLanguage();

  const { data: companyInfo, isLoading: isLoadingInfo } = useQuery({
    queryKey: ["company-info", currentLanguage],
    queryFn: () => fetchCompanyInfo(currentLanguage),
  });

  const { data: companyValues, isLoading: isLoadingValues } = useQuery({
    queryKey: ["company-values", currentLanguage],
    queryFn: () => fetchCompanyValues(currentLanguage),
  });

  const isLoading = isLoadingInfo || isLoadingValues;

  // Function to render dynamic Lucide icons
  const renderIcon = (iconName: string, className: string = "h-6 w-6") => {
    const iconComponents: Record<string, React.ReactNode> = {
      Rocket: <Rocket className={className} />,
      Target: <Target className={className} />,
      Globe: <Globe className={className} />,
      ShieldCheck: <ShieldCheck className={className} />,
      Lightbulb: <Lightbulb className={className} />,
      Heart: <Heart className={className} />,
      BarChart3: <BarChart3 className={className} />,
      Handshake: <Handshake className={className} />,
      TrendingUp: <TrendingUp className={className} />
    };

    return iconComponents[iconName] || <Rocket className={className} />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <SEOWrapper>
      <div className="min-h-screen bg-background">
        <Header />

        <main>
          {/* Hero Section - Apple Style Full Screen */}
          <section 
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundImage: `url(${aboutHeroBg})` }}
          >
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${aboutHeroBg})` }} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
            
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
              <div className="animate-fade-in">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-6 leading-[1.1]">
                  {t('hero.title')}
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl font-light text-white/80 max-w-3xl mx-auto">
                  {t('hero.description', { year: companyInfo?.founded_year || "2015" })}
                </p>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
                <div className="w-1.5 h-3 bg-white/70 rounded-full" />
              </div>
            </div>
          </section>

          {/* Mission & Vision - Apple Style */}
          <section className="py-32 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                  {/* Mission */}
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-8">
                      <Rocket className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
                      {t('mission.title')}
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      {companyInfo?.mission || t('mission.fallback')}
                    </p>
                  </div>

                  {/* Vision */}
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-8">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
                      {t('vision.title')}
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      {companyInfo?.vision || t('vision.fallback')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Company Story - Apple Style Large Text */}
          <section className="py-32 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-12">
                  {t('story.title')}
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed whitespace-pre-line">
                  {companyInfo?.content || t('story.fallback')}
                </p>


                {companyInfo?.approach && (
                  <div className="mt-16 pt-16 border-t border-border">
                    <h3 className="text-3xl md:text-4xl font-semibold text-foreground mb-8">
                      {t('story.approach.title')}
                    </h3>
                    <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
                      {companyInfo.approach}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Company Values - Apple Style Grid */}
          {companyValues && companyValues.length > 0 && (
            <section className="py-32 bg-background">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-20">
                  <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-6">
                    {t('values.title')}
                  </h2>
                  <p className="text-xl md:text-2xl text-muted-foreground">
                    {t('values.subtitle')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                  {companyValues.map((value) => (
                    <div 
                      key={value.id} 
                      className="group text-center p-8 rounded-3xl transition-all duration-300 hover:bg-secondary/50"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                        {renderIcon(value.icon_name, "h-8 w-8 text-primary")}
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground mb-4">
                        {value.title}
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Team Intro - Apple Style CTA */}
          {companyInfo?.team_intro && (
            <section className="py-32 bg-foreground text-background">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-8">
                    {t('team.title')}
                  </h2>
                  <p className="text-xl md:text-2xl opacity-80 mb-12 whitespace-pre-line leading-relaxed">
                    {companyInfo.team_intro}
                  </p>
                  <Link 
                    to="/advisable-team"
                    className="inline-flex items-center px-8 py-4 bg-background text-foreground rounded-full text-lg font-medium hover:bg-background/90 transition-colors"
                  >
                    {t('team.button')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </section>
          )}

        </main>

        <Footer />
      </div>
    </SEOWrapper>
  );
};

export default AboutCompany;
