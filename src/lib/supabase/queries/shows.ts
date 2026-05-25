import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/types';
export type { ShowRow } from '@/types/show';
import type { ShowRow } from '@/types/show';

function localized<T extends Record<string, unknown>>(row: T, field: string, locale: Locale): string {
  return (row[`${field}_${locale}`] as string) || (row[`${field}_ko`] as string) || '';
}

export type ShowCastRow = {
  id: string;
  person_id: string;
  role_name_ko: string | null;
  role_name_en: string | null;
  role_name_zh: string | null;
  sort_order: number;
  people: {
    id: string;
    name_ko: string;
    name_en: string | null;
    name_zh: string | null;
    role: string;
    position_ko: string | null;
    position_en: string | null;
    position_zh: string | null;
    photo_url: string | null;
  };
};

export type ScheduleRow = {
  id: string;
  show_date: string;
  show_time: string;
  total_seats: number;
  available_seats: number;
  is_cancelled: boolean;
};

export function localizeShow(show: ShowRow, locale: Locale) {
  return {
    ...show,
    title: localized(show, 'title', locale),
    description: localized(show, 'description', locale),
  };
}

export async function getShows(status?: 'running' | 'upcoming' | 'ended') {
  const supabase = await createClient();
  let query = supabase
    .from('shows')
    .select('*')
    .order('start_date', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as ShowRow[];
}

export async function getFeaturedShows() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .eq('is_featured', true)
    .in('status', ['running', 'upcoming'])
    .order('start_date', { ascending: true })
    .limit(5);

  if (error) throw error;
  return (data || []) as ShowRow[];
}

export async function getShowById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as ShowRow;
}

export async function getShowCast(showId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('show_cast')
    .select(`
      id,
      person_id,
      role_name_ko,
      role_name_en,
      role_name_zh,
      sort_order,
      people (
        id, name_ko, name_en, name_zh,
        role, position_ko, position_en, position_zh,
        photo_url
      )
    `)
    .eq('show_id', showId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as ShowCastRow[];
}

export async function getShowSchedules(showId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('show_id', showId)
    .eq('is_cancelled', false)
    .gte('show_date', new Date().toISOString().split('T')[0])
    .order('show_date', { ascending: true })
    .order('show_time', { ascending: true });

  if (error) throw error;
  return (data || []) as ScheduleRow[];
}

export async function getShowImages(showId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('show_images')
    .select('*')
    .eq('show_id', showId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}
