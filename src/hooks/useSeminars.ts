import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Seminar {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  instructor: string | null;
  start_date: string;
  end_date: string;
  start_time: string | null;
  end_time: string | null;
  sessions_label: string | null;
  seats: number;
  price_onsite: number;
  price_online: number;
  currency: string;
  allows_onsite: boolean;
  allows_online: boolean;
  venue_name: string | null;
  venue_address: string | null;
  language: string;
  status: string;
  display_order: number;
}

const SELECT = '*';

export function useSeminars() {
  return useQuery({
    queryKey: ['seminars'],
    queryFn: async (): Promise<Seminar[]> => {
      const { data, error } = await (supabase as any)
        .from('seminars')
        .select(SELECT)
        .order('display_order', { ascending: true })
        .order('start_date', { ascending: true });
      if (error) throw error;
      return (data || []) as Seminar[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSeminar(slug?: string) {
  return useQuery({
    queryKey: ['seminar', slug],
    enabled: !!slug,
    queryFn: async (): Promise<Seminar | null> => {
      const { data, error } = await (supabase as any)
        .from('seminars')
        .select(SELECT)
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw error;
      return (data || null) as Seminar | null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function formatSeminarDates(s: Pick<Seminar, 'start_date' | 'end_date'>, locale = 'el-GR'): string {
  const start = new Date(s.start_date);
  const end = new Date(s.end_date);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const d = (x: Date, opts: Intl.DateTimeFormatOptions) => x.toLocaleDateString(locale, opts);
  if (s.start_date === s.end_date) return d(start, { day: 'numeric', month: 'long', year: 'numeric' });
  if (sameMonth) return `${start.getDate()} & ${d(end, { day: 'numeric', month: 'long', year: 'numeric' })}`;
  return `${d(start, { day: 'numeric', month: 'long' })} - ${d(end, { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

export function formatSeminarTime(s: Pick<Seminar, 'start_time' | 'end_time'>): string {
  if (!s.start_time || !s.end_time) return '';
  return `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}`;
}
