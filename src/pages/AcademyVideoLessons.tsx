// @ts-nocheck
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { languageLabel, type VideoCourse } from '@/lib/videoCourses';
import { PlayCircle, Clock, CreditCard, Globe, User } from 'lucide-react';
import academyHero from '@/assets/academy-hero.jpg';

const COPY = {
  el: {
    subtitle: 'Μαθήματα σε βίντεο για AI στην επιχείρηση, να τα παρακολουθείς όποτε θέλεις, με τον δικό σου ρυθμό.',
    points: ['Παρακολούθηση όποτε σε βολεύει', 'Αγορά ανά μάθημα', 'Από την ομάδα της Advisable Academy'],
    live: 'Διαθέσιμα μαθήματα',
    liveEmpty: 'Δεν υπάρχουν ακόμη διαθέσιμα μαθήματα. Δες παρακάτω τι έρχεται.',
    soon: 'Ερχονται σύντομα',
    soonBadge: 'ΣΥΝΤΟΜΑ',
    language: 'Γλώσσα',
    buy: 'Αγορά',
    signinToBuy: 'Σύνδεση για αγορά',
    account: 'Ο λογαριασμός μου',
    signin: 'Σύνδεση / Εγγραφή',
    requested: 'Καταχωρήσαμε το αίτημά σου. Οι online πληρωμές ενεργοποιούνται σύντομα και θα σε ενημερώσουμε.',
    already: 'Εχεις ήδη αίτημα για αυτό το μάθημα.',
    desc: 'Video Lessons on Demand από την Advisable Academy.',
  },
  en: {
    subtitle: 'Video lessons on AI for business, to watch whenever you want, at your own pace.',
    points: ['Watch anytime', 'Buy per lesson', 'By the Advisable Academy team'],
    live: 'Available now',
    liveEmpty: 'No lessons are available yet. See what is coming below.',
    soon: 'Coming soon',
    soonBadge: 'COMING SOON',
    language: 'Language',
    buy: 'Buy',
    signinToBuy: 'Sign in to buy',
    account: 'My account',
    signin: 'Sign in / Sign up',
    requested: 'Your request is saved. Online payments open soon and we will let you know.',
    already: 'You already have a request for this lesson.',
    desc: 'Video Lessons on Demand by Advisable Academy.',
  },
};

export default function AcademyVideoLessons() {
  const { currentLanguage } = useLanguage();
  const t = currentLanguage === 'el' ? COPY.el : COPY.en;
  const icons = [Clock, CreditCard, PlayCircle];
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<VideoCourse[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('video_courses').select('*').neq('status', 'hidden').order('display_order')
      .then(({ data }) => setCourses((data as VideoCourse[]) || []));
  }, []);

  const live = courses.filter((c) => c.status === 'live');
  const soon = courses.filter((c) => c.status === 'coming_soon');
  const loginUrl = buildNavigationUrl('/academy/account/login', currentLanguage);

  async function buy(c: VideoCourse) {
    if (!user) { navigate(loginUrl); return; }
    setBusy(c.id);
    const { data: existing } = await supabase.from('video_course_purchases').select('id').eq('course_id', c.id).eq('user_id', user.id).neq('status', 'cancelled').limit(1);
    if (existing && existing.length) { toast({ title: t.already }); setBusy(null); return; }
    const { error } = await supabase.from('video_course_purchases').insert({ user_id: user.id, course_id: c.id, amount_eur: c.price_eur, status: 'pending' });
    setBusy(null);
    toast({ title: error ? error.message : t.requested, variant: error ? 'destructive' : 'default' });
  }

  return (
    <>
      <DynamicMetaTags title="Video Lessons on Demand | Advisable Academy" description={t.desc} type="website" />
      <Header />
      <main className="min-h-screen bg-background">
        <section className="relative isolate overflow-hidden bg-black">
          <img src={academyHero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" aria-hidden="true" />
          <div className="container relative mx-auto px-4 pb-20 pt-36 lg:pt-44">
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white lg:text-6xl">Video Lessons on Demand</h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80 lg:text-xl">{t.subtitle}</p>
            <ul className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {t.points.map((p, i) => {
                const Icon = icons[i];
                return (
                  <li key={p} className="flex items-center gap-2 text-sm text-white/85">
                    <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />{p}
                  </li>
                );
              })}
            </ul>
            <div className="mt-10">
              <Button asChild size="lg">
                <Link to={user ? buildNavigationUrl('/academy/account', currentLanguage) : loginUrl}>
                  <User className="mr-2 h-4 w-4" aria-hidden="true" />{user ? t.account : t.signin}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight">{t.live}</h2>
          {live.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">{t.liveEmpty}</p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {live.map((c) => (
                <Card key={c.id} className="flex flex-col overflow-hidden border-border/60">
                  {c.cover_image && <img src={c.cover_image} alt={c.title} className="aspect-video w-full object-cover" />}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold">{c.title}</h3>
                    {c.description && <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>}
                    <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4 text-primary" aria-hidden="true" />{t.language}: {languageLabel(c.language_code, currentLanguage)}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-6">
                      <span className="text-2xl font-bold">{Number(c.price_eur).toFixed(0)} €</span>
                      <Button onClick={() => buy(c)} disabled={busy === c.id}>{user ? t.buy : t.signinToBuy}</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {soon.length > 0 && (
          <section className="border-t border-border/50 bg-card/20">
            <div className="container mx-auto px-4 py-16">
              <h2 className="text-3xl font-bold tracking-tight">{t.soon}</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {soon.map((c) => (
                  <Card key={c.id} className="border-border/60 p-6">
                    <p className="text-xs font-semibold tracking-[0.2em] text-primary">{t.soonBadge}</p>
                    <h3 className="mt-3 text-xl font-semibold">{c.title}</h3>
                    {c.description && <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>}
                    <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4 text-primary" aria-hidden="true" />{t.language}: {languageLabel(c.language_code, currentLanguage)}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
