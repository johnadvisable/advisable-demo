// @ts-nocheck
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCourseDetail } from '@/hooks/useCourses';
import { Calendar, MapPin, Clock, ArrowLeft, User, Coffee } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import bootcampCover from '@/assets/startup-ai-bootcamp-cover.jpg';

const modeLabels: Record<string, string> = { digital: 'Digital', physical: 'In Person' };

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
function fmtTime(t: string | null) {
  if (!t) return '';
  return t.slice(0, 5);
}

export default function AdvisableAcademyCourse() {
  const { slug } = useParams();
  const { data: course, isLoading } = useCourseDetail(slug);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading…</div>;
  }
  if (!course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Course not found.</p>
        <Link to="/advisable-academy" className="text-primary underline underline-offset-2">Back to all courses</Link>
      </div>
    );
  }

  const coverSrc = course.cover_image_url || (course.slug === 'startup-ai-bootcamp' ? bootcampCover : '');
  const registerHref = `mailto:info@advisable.gr?subject=${encodeURIComponent('Registration: ' + course.title)}`;
  const infoHref = `mailto:info@advisable.gr?subject=${encodeURIComponent('Info request: ' + course.title)}`;

  // group lessons by day
  const days = Array.from(new Set(course.lessons.map(l => l.day_number))).sort((a, b) => a - b);

  // unique instructors (excluding coordinator) appearing in lessons
  const instructorMap = new Map<string, any>();
  course.lessons.forEach(l => {
    if (l.instructor && l.instructor.id !== course.coordinator_id) {
      instructorMap.set(l.instructor.id, l.instructor);
    }
  });
  const instructors = Array.from(instructorMap.values());

  return (
    <>
      <Helmet>
        <title>{course.title} — Advisable Academy</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header forceScrolled />

      <main className="min-h-screen bg-background pt-20">
        <section className="relative border-b border-border/50 bg-gradient-to-b from-primary/10 via-background to-background">
          <div className="container mx-auto px-4 py-12 lg:py-16">
            <Link to="/advisable-academy" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> All courses
            </Link>

            <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {(Array.isArray(course.mode) ? course.mode : [course.mode]).map(m => (
                    <span key={m} className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">{modeLabels[m] || m}</span>
                  ))}
                  {course.topic && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{course.topic}</span>}
                </div>
                <h1 className="text-4xl font-black tracking-tight lg:text-6xl">{course.title}</h1>
                {course.subtitle && <p className="mt-4 text-xl text-muted-foreground">{course.subtitle}</p>}
                {course.description && <p className="mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed">{course.description}</p>}

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" />{fmtDate(course.start_date)}{course.start_date !== course.end_date && ` – ${fmtDate(course.end_date)}`}</span>
                  {course.location && <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{course.location}</span>}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg"><a href={registerHref}>Register Now</a></Button>
                  <Button asChild size="lg" variant="outline"><a href={infoHref}>Request Info</a></Button>
                </div>
              </div>

              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 lg:aspect-square">
                {coverSrc ? (
                  <img src={coverSrc} alt={course.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-9xl font-black text-foreground/10">{course.title.charAt(0)}</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Coordinator & instructors */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-10 lg:grid-cols-3">
            {course.coordinator && (
              <Card className="p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Course Coordinator</p>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">
                    {course.coordinator.name.split(' ').map(s => s[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{course.coordinator.name}</p>
                    {course.coordinator.title && <p className="text-sm text-muted-foreground">{course.coordinator.title}</p>}
                  </div>
                </div>
              </Card>
            )}

            {instructors.length > 0 && (
              <Card className="p-6 lg:col-span-2">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Instructors</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {instructors.map(i => (
                    <div key={i.id} className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-sm font-bold">
                        {i.name.split(' ').map((s: string) => s[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{i.name}</p>
                        {i.title && <p className="text-xs text-muted-foreground">{i.title}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </section>

        {/* Schedule */}
        <section className="container mx-auto px-4 pb-24">
          <h2 className="mb-8 text-3xl font-bold lg:text-4xl">Schedule</h2>
          <div className="space-y-12">
            {days.map(day => {
              const dayLessons = course.lessons.filter(l => l.day_number === day);
              const label = dayLessons[0]?.day_label || `Day ${day}`;
              const date = dayLessons[0]?.lesson_date;
              return (
                <div key={day}>
                  <div className="mb-6 border-b border-border pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">{label}</p>
                    {date && <p className="mt-1 text-sm text-muted-foreground">{fmtDate(date)}</p>}
                  </div>
                  <div className="space-y-3">
                    {dayLessons.map(l => (
                      <Card key={l.id} className={`p-5 ${l.is_break ? 'bg-muted/30 border-dashed' : ''}`}>
                        <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                          <div className="flex items-start gap-2 text-sm font-medium text-muted-foreground">
                            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{fmtTime(l.start_time)} – {fmtTime(l.end_time)}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              {l.is_break && <Coffee className="h-4 w-4 text-muted-foreground" />}
                              {l.title}
                            </h3>
                            {(l.instructor || l.instructor_name_override) && (
                              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                <User className="h-3.5 w-3.5" />
                                Speaker: <span className="font-medium text-foreground">{l.instructor?.name || l.instructor_name_override}</span>
                              </p>
                            )}
                            {l.bullets && l.bullets.length > 0 && (
                              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2 text-sm text-muted-foreground">
                                {l.bullets.map((b, i) => (
                                  <li key={i} className="flex gap-2"><span className="text-primary">•</span>{b}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-border/50 bg-gradient-to-b from-background to-primary/10">
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold lg:text-4xl">Ready to join {course.title}?</h2>
            <p className="mt-3 text-muted-foreground">Reserve your seat. Limited capacity.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg"><a href={registerHref}>Register Now</a></Button>
              <Button asChild size="lg" variant="outline"><a href={infoHref}>Request Info</a></Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
