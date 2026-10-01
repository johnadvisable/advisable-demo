// @ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Instructor {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  photo_url: string | null;
}

export interface Lesson {
  id: string;
  course_id: string;
  day_number: number;
  day_label: string | null;
  lesson_date: string | null;
  start_time: string | null;
  end_time: string | null;
  title: string;
  description: string | null;
  bullets: string[] | null;
  instructor_id: string | null;
  instructor_name_override: string | null;
  is_break: boolean;
  display_order: number;
  instructor?: Instructor | null;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_image_url: string | null;
  mode: ('digital' | 'physical')[];
  topic: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  coordinator_id: string | null;
  is_published: boolean;
  display_order: number;
  coordinator?: Instructor | null;
}

export function useCourses() {
  return useQuery({
    queryKey: ['advise-courses'],
    queryFn: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from('courses')
        .select('*, coordinator:course_instructors!courses_coordinator_id_fkey(*)')
        .eq('is_published', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data || []) as Course[];
    },
  });
}

export function useCourseDetail(slug: string | undefined) {
  return useQuery({
    enabled: !!slug,
    queryKey: ['advise-course', slug],
    queryFn: async () => {
      const { data: course, error } = await supabase
        .from('courses')
        .select('*, coordinator:course_instructors!courses_coordinator_id_fkey(*)')
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw error;
      if (!course) return null;

      const { data: lessons, error: lErr } = await supabase
        .from('course_lessons')
        .select('*, instructor:course_instructors(*)')
        .eq('course_id', course.id)
        .order('day_number', { ascending: true })
        .order('display_order', { ascending: true });
      if (lErr) throw lErr;

      return { ...course, lessons: (lessons || []) as Lesson[] } as Course & { lessons: Lesson[] };
    },
  });
}
