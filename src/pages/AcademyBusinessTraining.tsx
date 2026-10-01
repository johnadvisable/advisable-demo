// @ts-nocheck
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrustedBySection from '@/components/services/TrustedBySection';
import SocialPostsSlider from '@/components/academy/SocialPostsSlider';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/context/LanguageContext';
import { buildNavigationUrl, getDomainForLanguage, isLocalDevelopment } from '@/utils/multilanguageUtils';
import {
  Search, ClipboardList, GraduationCap, LineChart, Check, ArrowRight, Bot, Sparkles, Plug,
  Users, Building2, ShieldCheck, Workflow, Megaphone, Calculator, Headphones, Code2, Scale,
} from 'lucide-react';
import academyHero from '@/assets/academy-hero.jpg';
import { ACADEMY_TRAINING, pickLang } from '@/content/academyContent';

const CONFIG = {
  CANONICAL: 'https://www.advisable.com/academy/ai-training-for-business',
  OG_IMAGE: 'https://www.advisable.com/images/academy/ai-for-business-og.jpg',
};

function getPageUrl(language?: string): string {
  if (typeof window === 'undefined' || !window.location?.origin) return CONFIG.CANONICAL;
  if (isLocalDevelopment()) return `https://www.${getDomainForLanguage(language || 'en')}/academy/ai-training-for-business`;
  return `${window.location.origin}/academy/ai-training-for-business`;
}

const PHASE_META = [
  { icon: Search, step: '01' },
  { icon: ClipboardList, step: '02' },
  { icon: GraduationCap, step: '03' },
  { icon: LineChart, step: '04' },
];

const TOOL_META = [
  { icon: Sparkles, title: 'Claude' },
  { icon: Bot, title: 'ChatGPT' },
  { icon: Plug, title: 'Microsoft Copilot' },
];

const SOCIAL_COPY: Record<string, { title: string; subtitle: string }> = {
  el: { title: 'Δημοσιεύσεις από τα social media', subtitle: 'Δημοσιεύσεις από συνεργάτες και συμμετέχοντες στα social media.' },
  en: { title: 'Posts from social media', subtitle: 'Posts from partners and participants in our trainings.' },
  es: { title: 'Publicaciones en redes sociales', subtitle: 'Publicaciones de socios y participantes en nuestras formaciones.' },
  fr: { title: 'Publications sur les réseaux sociaux', subtitle: 'Publications de partenaires et de participants à nos formations.' },
  it: { title: 'Post dai social media', subtitle: 'Post di partner e partecipanti alle nostre formazioni.' },
  de: { title: 'Beiträge aus Social Media', subtitle: 'Beiträge von Partnern und Teilnehmenden unserer Trainings.' },
};

const DEPARTMENT_ICONS = [Megaphone, Calculator, Headphones, Workflow, Code2, Scale];

export default function AcademyBusinessTraining() {
  const { currentLanguage } = useLanguage();
  const t = pickLang(ACADEMY_TRAINING, currentLanguage);
  const pageUrl = getPageUrl(currentLanguage);
  const siteRoot = pageUrl.replace(/\/academy\/ai-training-for-business$/, '');
  const social = SOCIAL_COPY[currentLanguage] || SOCIAL_COPY.en;

  const jsonLd = useMemo(() => ([
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Advisable', item: siteRoot },
        { '@type': 'ListItem', position: 2, name: 'Academy', item: `${siteRoot}/academy` },
        { '@type': 'ListItem', position: 3, name: t.seo.breadcrumb, item: pageUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: t.seo.courseName,
      description: t.seo.courseDescription,
      provider: { '@type': 'Organization', name: 'Advisable', url: siteRoot },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: ['onsite', 'online'],
        courseWorkload: 'PT4H',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: t.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]), [pageUrl, siteRoot, t]);

  return (
    <>
      <DynamicMetaTags
        canonicalUrl={pageUrl}
        title={t.seo.title}
        description={t.seo.description}
        type="website"
        ogImage={CONFIG.OG_IMAGE}
        twitterImage={CONFIG.OG_IMAGE}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-border/50 bg-black">
          <img
            src={academyHero}
            alt={t.hero.imageAlt}
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" aria-hidden="true" />

          <div className="container relative mx-auto px-4 pb-20 pt-32 lg:pb-28 lg:pt-40">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
              Advisable Academy
            </p>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white lg:text-6xl">
              {t.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80 lg:text-xl">
              {t.hero.subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={buildNavigationUrl('/contact', currentLanguage)}>{t.hero.ctaProposal}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link to={buildNavigationUrl('/academy', currentLanguage)}>{t.hero.ctaSeminars}</Link>
              </Button>
            </div>
            <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[Building2, Users, ShieldCheck].map((Icon, idx) => ({ icon: Icon, label: t.hero.badges[idx] })).map((i) => (
                <div key={i.label} className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/85 backdrop-blur">
                  <i.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{i.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Μεθοδολογία */}
        <section className="border-b border-border/50">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t.method.title}</h2>
            <p className="mt-4 max-w-3xl text-muted-foreground">
              {t.method.intro}
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {PHASE_META.map((meta, idx) => ({ ...meta, ...t.phases[idx] })).map((p) => (
                <Card key={p.step} className="border-border/60 bg-card/40 p-7">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-primary/10 p-2.5">
                      <p.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-bold tracking-[0.2em] text-muted-foreground">{p.step}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
                  <ul className="mt-4 space-y-2">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Εργαλεία */}
        <section className="border-b border-border/50 bg-card/20">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t.tools.title}</h2>
            <p className="mt-4 max-w-3xl text-muted-foreground">
              {t.tools.intro}
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {TOOL_META.map((tool, idx) => (
                <Card key={tool.title} className="border-border/60 bg-card/40 p-7">
                  <tool.icon className="h-7 w-7 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 text-xl font-semibold">{tool.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.tools.items[idx]}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Ανά τμήμα */}
        <section className="border-b border-border/50">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t.departments.title}</h2>
            <p className="mt-4 max-w-3xl text-muted-foreground">
              {t.departments.intro}
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {t.departments.items.map((d, idx) => ({ ...d, icon: DEPARTMENT_ICONS[idx] })).map((d) => (
                <Card key={d.title} className="border-border/60 bg-card/40 p-6">
                  <d.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-3 text-lg font-semibold">{d.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Formats */}
        <section className="border-b border-border/50 bg-card/20">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t.formats.title}</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {t.formats.items.map((f) => (
                <Card key={f.title} className="flex flex-col border-border/60 bg-card/40 p-7">
                  <h3 className="text-xl font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
                  <ul className="mt-5 space-y-2">
                    {f.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {t.formats.note}
            </p>
          </div>
        </section>

        {/* Αποτελέσματα */}
        <section className="border-b border-border/50">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t.outcomes.title}</h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {t.outcomes.items.map((o) => (
                <li key={o} className="flex items-start gap-2 rounded-xl border border-border/60 bg-card/30 p-4 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <SocialPostsSlider title={social.title} subtitle={social.subtitle} />

        {/* FAQ */}
        <section className="border-b border-border/50 bg-card/20">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t.faqTitle}</h2>
            <Accordion type="single" collapsible className="mt-8 max-w-3xl">
              {t.faq.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <Card className="border-border/60 bg-card/40 p-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t.cta.title}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {t.cta.text}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link to={buildNavigationUrl('/contact', currentLanguage)}>
                    {t.cta.proposal} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to={buildNavigationUrl('/academy', currentLanguage)}>{t.cta.back}</Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>
        <TrustedBySection currentLanguage={currentLanguage} />

      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center gap-3 px-4 py-3">
          <p className="min-w-0 text-sm font-semibold leading-tight">{t.cta.title}</p>
          <Button asChild size="lg" className="ml-auto shrink-0">
            <Link to={buildNavigationUrl('/contact', currentLanguage)}>{t.hero.ctaProposal}</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </>
  );
}
