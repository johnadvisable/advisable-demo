import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { useHierarchicalServices } from '@/hooks/useHierarchicalServices';
import { useSeoOnlyServices } from '@/hooks/useSeoOnlyServices';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOWrapper from '@/components/SEO/SEOWrapper';
import Metrics from '@/components/Metrics';
import sledHero from '@/assets/sled-hero.jpg';
import {
  ArrowRight,
  Globe,
  BarChart3,
  Cpu,
  Layers,
  Search,
  Lightbulb,
} from 'lucide-react';

const VALUE_PROPS = [
  {
    icon: Cpu,
    title: 'AI-First Approach',
    desc: 'We leverage artificial intelligence across every service — from content generation to smart optimization — ensuring you stay ahead of the curve.',
  },
  {
    icon: Layers,
    title: 'Full-Stack Digital Services',
    desc: 'Agency + Studio under one roof. Strategy, design, development, marketing, and product creation — all seamlessly integrated.',
  },
  {
    icon: BarChart3,
    title: 'Proven Client Results',
    desc: 'From startups to enterprises, our clients consistently see measurable growth in traffic, conversions, and market presence.',
  },
  {
    icon: Globe,
    title: 'Multi-Market Expertise',
    desc: '5 languages, offices in Athens & Patras, and deep understanding of European and global markets.',
  },
  {
    icon: Search,
    title: 'SEO & AEO Excellence',
    desc: 'We don\'t just optimise for Google — we optimise for AI-powered search engines too. Future-proof your digital presence.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation-Driven Products',
    desc: 'E-commerce, CRM, Market Data, Recommendable, E-Prescription — we build products that disrupt industries.',
  },
];

const SledToAdvisable: React.FC = () => {
  const currentLanguage = useCurrentLanguage();
  const { data: hierarchicalData } = useHierarchicalServices('digital-agency', currentLanguage);
  const { data: seoServices } = useSeoOnlyServices('digital-agency', currentLanguage);

  const regularServices = hierarchicalData?.allServices || [];
  const allServices = [...regularServices, ...(seoServices || [])]
    .filter((s, i, arr) => arr.findIndex(x => x.slug === s.slug) === i)
    .sort((a, b) => ((a as any).display_order ?? 999) - ((b as any).display_order ?? 999));

  return (
    <SEOWrapper
      title="Advisable — Sled into Success | Digital Agency Services"
      description="Discover why leading brands choose Advisable as their digital partner. Full-service agency, venture studio, and product development — one team, limitless possibilities."
      keywords="digital agency, sled, AI services, SEO, sleed, web development, advisable, sled digital, digital transformation, sled into success, venture studio, sleed agency, e-commerce, marketing agency Greece"
      image={sledHero}
      ogDescription="Full-service digital agency & venture studio. AI-first approach, 250+ clients, €200M+ digital revenue. Strategy, design, development & marketing under one roof."
    >
      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src={sledHero}
          alt="Sled into digital success"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-3">
              Advisable
            </h1>
            <p className="text-2xl md:text-4xl font-bold text-white mb-4">
              Sled into Success
            </p>
            <p className="text-white/90 text-base md:text-lg mb-8">
              Smooth. Effortless. Unstoppable progress.
            </p>
            <Link
              to={buildNavigationUrl('/contact', currentLanguage)}
              className="inline-flex items-center justify-center px-7 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Advisable Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
              Why Advisable?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine strategy, technology, and creativity to deliver results that matter.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {VALUE_PROPS.map((prop) => (
              <div
                key={prop.title}
                className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <prop.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{prop.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <div className="bg-background">
        <Metrics variant="light" />
      </div>

      {/* All Digital Agency Services */}
      {allServices.length > 0 && (
        <section className="py-20 lg:py-28 bg-muted/30 border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
                Digital Agency
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                End-to-end digital services to grow your brand.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {allServices.map((service) => {
                const desc = 'short_description' in service ? (service as any).short_description : '';
                return (
                  <div
                    key={service.slug}
                    className="p-6 rounded-2xl border-2 border-primary/30 bg-card hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[200px]"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {service.title}
                      </h3>
                      {desc && (
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                          {desc}
                        </p>
                      )}
                    </div>
                    <Link
                      to={buildNavigationUrl(`/digital-agency/${service.slug}`, currentLanguage)}
                      className="inline-flex items-center text-sm font-semibold text-primary hover:underline mt-4"
                    >
                      Learn more
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 lg:py-24 bg-[var(--advisable-darkPurple)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to sled into success?
          </h2>
          <p className="text-white/60 max-w-lg mx-auto mb-8">
            Let's build something extraordinary together. Your growth journey starts here.
          </p>
          <Link
            to={buildNavigationUrl('/contact', currentLanguage)}
            className="inline-flex items-center justify-center px-7 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
          >
            Contact Us
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </SEOWrapper>
  );
};

export default SledToAdvisable;
