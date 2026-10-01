// @ts-nocheck
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCourses } from '@/hooks/useCourses';
import CourseCard from '@/components/academy/CourseCard';
import CourseFilters, { Filters, EMPTY_FILTERS } from '@/components/academy/CourseFilters';

function durationBucket(start: string, end: string): string {
  const days = Math.round((+new Date(end) - +new Date(start)) / 86400000) + 1;
  if (days <= 2) return '1-2';
  if (days <= 7) return '3-7';
  if (days <= 31) return '1-4w';
  return '1m';
}

export default function AdvisableAcademy() {
  const { data: courses = [], isLoading } = useCourses();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const topicOptions = useMemo(() => Array.from(new Set(courses.map(c => c.topic).filter(Boolean) as string[])), [courses]);

  const filtered = useMemo(() => courses.filter(c => {
    const courseModes = Array.isArray(c.mode) ? c.mode : [c.mode];
    if (filters.modes.length && !filters.modes.some(m => courseModes.includes(m))) return false;
    if (filters.duration !== 'all' && durationBucket(c.start_date, c.end_date) !== filters.duration) return false;
    if (filters.topic !== 'all' && c.topic !== filters.topic) return false;
    if (filters.dateFrom && c.end_date < filters.dateFrom) return false;
    if (filters.dateTo && c.start_date > filters.dateTo) return false;
    return true;
  }), [courses, filters]);

  return (
    <>
      <Helmet>
        <title>Advisable Academy — Masterclasses</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header forceScrolled />

      <main className="min-h-screen bg-background pt-20">
        <section className="border-b border-border/50 bg-gradient-to-b from-primary/10 via-background to-background">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Hidden Academy</p>
            <h1 className="text-5xl font-black tracking-tight lg:text-7xl">Advisable Academy</h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground lg:text-xl">
              Intensive masterclasses by Advisable. Learn directly from operators who build, ship and scale real companies.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 lg:py-14">
          <div className="mb-8">
            <CourseFilters filters={filters} setFilters={setFilters} topicOptions={topicOptions} />
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map(i => <div key={i} className="aspect-[16/12] animate-pulse rounded-lg bg-card/50" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No courses match these filters.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
