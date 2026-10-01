import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowLeft, Briefcase, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { getInvestmentBySlug } from "@/services/investments";
import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import { buildNavigationUrl } from "@/utils/multilanguageUtils";
import SEOWrapper from "@/components/SEO/SEOWrapper";
import HeaderContainer from "@/components/HeaderContainer";
import Footer from "@/components/Footer";

const InvestmentDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-16">
    <Skeleton className="h-6 w-24 mb-8" />
    
    <div className="max-w-4xl mx-auto">
      <Skeleton className="h-16 w-3/4 mb-4" />
      <Skeleton className="h-8 w-full mb-6" />
      <Skeleton className="h-6 w-2/3 mb-8" />
      
      <div className="flex gap-4 mb-12">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 w-32" />
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InvestmentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const currentLanguage = useCurrentLanguage();
  
  const { data: investment, isLoading, error } = useQuery({
    queryKey: ["investment", slug, currentLanguage],
    queryFn: () => getInvestmentBySlug(slug!, currentLanguage),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <>
        <HeaderContainer forceScrolled />
        <main className="pt-20">
          <InvestmentDetailSkeleton />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !investment) {
    return (
      <>
        <HeaderContainer forceScrolled />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-2xl mx-auto">
              <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-4">
                {currentLanguage === 'el' ? 'Η επένδυση δεν βρέθηκε' : 'Investment not found'}
              </h1>
              <p className="text-muted-foreground mb-8">
                {currentLanguage === 'el' 
                  ? 'Η επένδυση που αναζητάτε δεν υπάρχει ή έχει αφαιρεθεί.'
                  : 'The investment you are looking for does not exist or has been removed.'
                }
              </p>
              <Button asChild>
                <Link to={buildNavigationUrl('/investments', currentLanguage)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {currentLanguage === 'el' ? 'Επιστροφή στις Επενδύσεις' : 'Back to Investments'}
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const seoData = {
    title: `${investment.title} | ${currentLanguage === 'el' ? 'Επενδύσεις' : 'Investments'} | Advisable`,
    description: investment.tagline,
    keywords: `${investment.title}, investment, venture studio, ${investment.slug}`,
  };

  return (
    <SEOWrapper {...seoData}>
      <div className="min-h-screen bg-background">
        <HeaderContainer forceScrolled />
        
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16">
            {/* Back Button */}
            <Button asChild variant="ghost" className="mb-8">
              <Link to={buildNavigationUrl('/investments', currentLanguage)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {currentLanguage === 'el' ? 'Επιστροφή στις Επενδύσεις' : 'Back to Investments'}
              </Link>
            </Button>

            <div className="max-w-4xl mx-auto">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Briefcase className="h-10 w-10 text-primary" />
                  <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                    {investment.title}
                  </h1>
                </div>
                <p className="text-2xl font-semibold text-primary mb-6">
                  {investment.short_description}
                </p>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                  {investment.tagline}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link
                      to={buildNavigationUrl('/lets-build-together', currentLanguage)}
                      className="flex items-center"
                    >
                      {investment.cta_primary_text}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>

                  {investment.cta_secondary_text && (
                    <Button asChild variant="outline" size="lg">
                      <Link to={buildNavigationUrl('/lets-build-together', currentLanguage)}>
                        {investment.cta_secondary_text}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Features */}
                {investment.features && investment.features.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        {currentLanguage === 'el' ? 'Χαρακτηριστικά' : 'Features'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {investment.features.map((feature, index) => (
                          <div key={index} className="border-l-2 border-primary/20 pl-4">
                            <h4 className="font-semibold text-foreground mb-2">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Benefits */}
                {investment.benefits && investment.benefits.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary" />
                        {currentLanguage === 'el' ? 'Οφέλη' : 'Benefits'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {investment.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <span className="text-2xl">{benefit.icon}</span>
                            <div>
                              <h4 className="font-medium text-foreground">
                                {benefit.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {benefit.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Description */}
              {investment.description && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>
                      {currentLanguage === 'el' ? 'Περιγραφή' : 'About'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground leading-relaxed">
                        {investment.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Testimonials */}
              {investment.testimonials && investment.testimonials.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {currentLanguage === 'el' ? 'Μαρτυρίες' : 'Testimonials'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {investment.testimonials.map((testimonial, index) => (
                        <div key={index} className="border-l-2 border-primary/20 pl-6">
                          <blockquote className="text-muted-foreground italic mb-3">
                            "{testimonial.quote}"
                          </blockquote>
                          <div className="flex items-center gap-3">
                            {testimonial.image_url && (
                              <img 
                                src={testimonial.image_url} 
                                alt={testimonial.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-foreground">
                                {testimonial.name}
                              </p>
                              {testimonial.company && (
                                <p className="text-sm text-muted-foreground">
                                  {testimonial.company}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Final CTA */}
              <div className="text-center mt-12">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-8 pb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {currentLanguage === 'el'
                        ? `Ας χτίσουμε μαζί το επόμενο μεγάλο startup`
                        : `Let's build the next big startup together`
                      }
                    </h3>
                    <Button asChild size="lg">
                      <Link
                        to={buildNavigationUrl('/lets-build-together', currentLanguage)}
                        className="flex items-center"
                      >
                        {currentLanguage === 'el' ? 'Υποβάλετε την Αίτησή σας' : "Apply to Venture Studio"}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SEOWrapper>
  );
};

export default InvestmentDetail;