// @ts-nocheck
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Tag } from 'lucide-react';
import type { Course } from '@/hooks/useCourses';
import bootcampCover from '@/assets/startup-ai-bootcamp-cover.jpg';

const modeLabels: Record<string, string> = {
  digital: 'Digital',
  physical: 'In Person',
};

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth() && s.getDate() === e.getDate()) {
    return s.toLocaleDateString('en-US', { ...opts, year: 'numeric' });
  }
  return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`;
}

function durationLabel(start: string, end: string) {
  const days = Math.round((+new Date(end) - +new Date(start)) / 86400000) + 1;
  if (days <= 2) return `${days} ${days === 1 ? 'day' : 'days'}`;
  if (days <= 7) return `${days} days`;
  if (days <= 31) return `${Math.ceil(days / 7)} weeks`;
  return `${Math.ceil(days / 30)} months`;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link to={`/advisable-academy/${course.slug}`} className="group block">
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/40 hover:shadow-xl">
        <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 relative">
          <img
            src={course.cover_image_url || (course.slug === 'startup-ai-bootcamp' ? bootcampCover : '')}
            alt={course.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute top-3 right-3 flex gap-2">
            {(Array.isArray(course.mode) ? course.mode : [course.mode]).map(m => (
              <span key={m} className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
                {modeLabels[m] || m}
              </span>
            ))}
          </div>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {course.topic && (
              <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" />{course.topic}</span>
            )}
            <span>•</span>
            <span>{durationLabel(course.start_date, course.end_date)}</span>
          </div>
          <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
          {course.subtitle && <p className="text-sm text-muted-foreground line-clamp-2">{course.subtitle}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDateRange(course.start_date, course.end_date)}</span>
            {course.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{course.location}</span>}
          </div>
          <div className="pt-3">
            <Button size="sm" className="w-full">Register</Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
