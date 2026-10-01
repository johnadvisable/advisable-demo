// @ts-nocheck
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrustedBySection from '@/components/services/TrustedBySection';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useSeminars, formatSeminarDates, formatSeminarTime } from '@/hooks/useSeminars';
import { buildNavigationUrl, getDomainForLanguage, isLocalDevelopment } from '@/utils/multilanguageUtils';
import {
  Building2, GraduationCap, Calendar, MapPin, Users, Clock, Check, ArrowRight, Bot, Sparkles, Plug, Monitor, PlayCircle,
} from 'lucide-react';
import academyHero from '@/assets/academy-hero.jpg';
import { ACADEMY_HUB, pickLang } from '@/content/academyContent';


const CONFIG = {
  CANONICAL: 'https://www.advisable.com/academy',
  OG_IMAGE: 'https://www.advisable.com/images/academy/ai-for-business-og.jpg',
  VENUE_ADDRESS: 'Ηρούς 4, Κολωνός, 104 42 Αθήνα',
};

function getAcademyUrl(language?: string): string {
  if (typeof window === 'undefined' || !window.location?.origin) return CONFIG.CANONICAL;
  if (isLocalDevelopment()) return `https://www.${getDomainForLanguage(language || 'en')}/academy`;
  return `${window.location.origin}/academy`;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
}

/* ------------------------------- Data ---------------------------------- */

const BUSINESS_TRACKS = [
  { icon: Sparkles, title: 'Claude' },
  { icon: Bot, title: 'ChatGPT' },
  { icon: Plug, title: 'Microsoft Copilot' },
];



/* -------------------------------- Page --------------------------------- */


export default function Academy() {
  const { currentLanguage } = useLanguage();
  const t = pickLang(ACADEMY_HUB, currentLanguage);
  const dateLocale = ({ el: 'el-GR', es: 'es-ES', fr: 'fr-FR', it: 'it-IT', de: 'de-DE' } as Record<string, string>)[currentLanguage] || 'en-GB';
  const { data: seminars = [], isLoading } = useSeminars();
  const academyUrl = getAcademyUrl(currentLanguage);
  const siteRoot = academyUrl.replace(/\/academy$/, '');


  const jsonLd = useMemo(() => ([
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Advisable', item: siteRoot },
        { '@type': 'ListItem', position: 2, name: 'Academy', item: academyUrl },
      ],
    },
  ]), [academyUrl, siteRoot]);

  return (
    <>
      <DynamicMetaTags
        canonicalUrl={academyUrl}
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
        {/* Hero with the two choices */}
        <section className="relative isolate overflow-hidden border-b border-border/50 bg-black">
          <img
            src={academyHero}
            alt="Advisable Academy"
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

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              <button
                type="button"
                onClick={() => scrollToId('epixeiriseis')}
                className="group rounded-2xl border border-white/20 bg-white/10 p-7 text-left backdrop-blur transition-colors hover:border-primary/60 hover:bg-white/15"
              >
                <Building2 className="h-8 w-8 text-primary" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-bold text-white">{t.hero.businessTitle}</h2>
                <p className="mt-2 text-sm text-white/75">
                  {t.hero.businessText}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {t.hero.businessCta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => scrollToId('seminaria')}
                className="group rounded-2xl border border-white/20 bg-white/10 p-7 text-left backdrop-blur transition-colors hover:border-primary/60 hover:bg-white/15"
              >
                <GraduationCap className="h-8 w-8 text-primary" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-bold text-white">{t.hero.seminarTitle}</h2>
                <p className="mt-2 text-sm text-white/75">
                  {t.hero.seminarText}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {t.hero.seminarCta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </button>

              <Link
                to={buildNavigationUrl('/academy/video-lessons', currentLanguage)}
                className="group rounded-2xl border border-white/20 bg-white/10 p-7 text-left backdrop-blur transition-colors hover:border-primary/60 hover:bg-white/15"
              >
                <PlayCircle className="h-8 w-8 text-primary" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-bold text-white">Video Lessons on Demand</h2>
                <p className="mt-2 text-sm text-white/75">
                  {currentLanguage === 'el' ? 'Μαθήματα σε βίντεο, όποτε θέλετε, με τον δικό σας ρυθμό. Σύντομα διαθέσιμο.' : 'Video lessons to watch whenever you want, at your own pace. Coming soon.'}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {currentLanguage === 'el' ? 'Μάθετε περισσότερα' : 'Learn more'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Εκπαίδευση για επιχειρήσεις */}
        <section id="epixeiriseis" className="scroll-mt-28 border-b border-border/50">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t.business.title}</h2>
            </div>
            <p className="mt-4 max-w-3xl text-muted-foreground">
              {t.business.intro}
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {BUSINESS_TRACKS.map((tr, i) => (
                <Card key={tr.title} className="border-border/60 bg-card/40 p-7">
                  <tr.icon className="h-7 w-7 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 text-xl font-semibold">{tr.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.business.tracks[i]}</p>
                </Card>
              ))}
            </div>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {t.business.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={buildNavigationUrl('/contact', currentLanguage)}>{t.business.ctaProposal}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to={buildNavigationUrl('/academy/ai-training-for-business', currentLanguage)}>{t.business.ctaMore}</Link>
              </Button>
            </div>

          </div>
        </section>

        {/* Σεμινάρια */}
        <section id="seminaria" className="scroll-mt-28 bg-card/20">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t.seminars.title}</h2>
            </div>
            <p className="mt-4 max-w-3xl text-muted-foreground">
              {t.seminars.intro}
            </p>

            {isLoading ? (
              <div className="mt-10 h-40 animate-pulse rounded-2xl bg-card/50" />
            ) : seminars.length === 0 ? (
              <p className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
                {t.seminars.empty}
              </p>
            ) : (
              <Card className="mt-10 overflow-hidden border-border/60 bg-card/40">
                {/* Mobile: κάθετες κάρτες */}
                <div className="divide-y divide-border/40 lg:hidden">
                  {seminars.map((s) => (
                    <div key={s.id} className="p-5">
                      <span className="block font-semibold text-foreground">{s.title}</span>
                      {s.subtitle && <span className="mt-1 block text-xs text-muted-foreground">{s.subtitle}</span>}
                      <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                        <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{formatSeminarDates(s, dateLocale)}</span>
                        <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{formatSeminarTime(s)}</span>
                        <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{s.seats}</span>
                        {s.allows_onsite && (
                          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />On site</span>
                        )}
                        {s.allows_online && (
                          <span className="inline-flex items-center gap-2"><Monitor className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />Online</span>
                        )}
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <span>
                          <span className="block font-bold text-foreground">{Math.round(s.price_onsite)} € <span className="text-xs font-normal text-muted-foreground">on site</span></span>
                          {s.allows_online && (
                            <span className="block text-xs text-muted-foreground">{Math.round(s.price_online)} € online</span>
                          )}
                        </span>
                        <Button asChild size="sm">
                          <Link to={buildNavigationUrl(`/academy/seminar/${s.slug}`, currentLanguage)}>
                            {t.seminars.view}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Desktop: πίνακας */}
                <div className="hidden w-full overflow-x-auto lg:block">

                  <table className="w-full min-w-[860px] text-left text-sm">
                    <thead className="border-b border-border/60 bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th scope="col" className="px-5 py-4 font-semibold">{t.seminars.th.seminar}</th>
                        <th scope="col" className="px-5 py-4 font-semibold">{t.seminars.th.date}</th>
                        <th scope="col" className="px-5 py-4 font-semibold">{t.seminars.th.time}</th>
                        <th scope="col" className="px-5 py-4 font-semibold">{t.seminars.th.mode}</th>
                        <th scope="col" className="px-5 py-4 font-semibold">{t.seminars.th.seats}</th>
                        <th scope="col" className="px-5 py-4 font-semibold">{t.seminars.th.price}</th>
                        <th scope="col" className="px-5 py-4" />
                      </tr>
                    </thead>
                    <tbody>
                      {seminars.map((s) => (
                        <tr key={s.id} className="border-b border-border/40 last:border-0 hover:bg-background/30">
                          <td className="px-5 py-5">
                            <span className="font-semibold text-foreground">{s.title}</span>
                            {s.subtitle && <span className="mt-1 block text-xs text-muted-foreground">{s.subtitle}</span>}
                          </td>
                          <td className="whitespace-nowrap px-5 py-5 text-muted-foreground">
                            <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" aria-hidden="true" />{formatSeminarDates(s, dateLocale)}</span>
                          </td>
                          <td className="whitespace-nowrap px-5 py-5 text-muted-foreground">
                            <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-primary" aria-hidden="true" />{formatSeminarTime(s)}</span>
                          </td>
                          <td className="whitespace-nowrap px-5 py-5 text-muted-foreground">
                            <span className="flex flex-col gap-1">
                              {s.allows_onsite && (
                                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" aria-hidden="true" />On site</span>
                              )}
                              {s.allows_online && (
                                <span className="inline-flex items-center gap-2"><Monitor className="h-4 w-4 text-primary" aria-hidden="true" />Online</span>
                              )}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-5 py-5 text-muted-foreground">
                            <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-primary" aria-hidden="true" />{s.seats}</span>
                          </td>
                          <td className="whitespace-nowrap px-5 py-5">
                            <span className="block font-bold text-foreground">{Math.round(s.price_onsite)} € <span className="text-xs font-normal text-muted-foreground">on site</span></span>
                            {s.allows_online && (
                              <span className="block text-xs text-muted-foreground">{Math.round(s.price_online)} € online</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-5 py-5 text-right">
                            <Button asChild size="sm">
                              <Link to={buildNavigationUrl(`/academy/seminar/${s.slug}`, currentLanguage)}>
                                {t.seminars.view}
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

          </div>
        </section>
        <section className="border-t border-border/50">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-6 px-4 py-14">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-primary">{currentLanguage === 'el' ? 'ΣΥΝΤΟΜΑ' : 'COMING SOON'}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Video Lessons on Demand</h2>
            </div>
            <Button asChild size="lg" variant="outline">
              <Link to={buildNavigationUrl('/academy/video-lessons', currentLanguage)}>
                {currentLanguage === 'el' ? 'Μάθε περισσότερα' : 'Learn more'} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
        <TrustedBySection currentLanguage={currentLanguage} />

      </main>

      <Footer />
    </>
  );
}
