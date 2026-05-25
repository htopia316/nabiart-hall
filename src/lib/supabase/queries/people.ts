import 'server-only';
import { createClient } from '../server';

export interface PersonRow {
  id: string;
  name_ko: string;
  name_en: string | null;
  name_zh: string | null;
  role: 'actor' | 'staff';
  position_ko: string | null;
  position_en: string | null;
  position_zh: string | null;
  photo_url: string | null;
  bio_ko: string | null;
  bio_en: string | null;
  bio_zh: string | null;
  sort_order: number;
  is_active: boolean;
}

export async function getPeople(role?: 'actor' | 'staff') {
  const supabase = await createClient();
  let query = supabase
    .from('people')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (role) {
    query = query.eq('role', role);
  }

  const { data, error } = await query.abortSignal(AbortSignal.timeout(5000));
  if (error) return [];
  return data as PersonRow[];
}

export async function getPersonById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as PersonRow;
}

export interface PersonShowRow {
  show_id: string;
  role_name_ko: string | null;
  role_name_en: string | null;
  role_name_zh: string | null;
  shows: {
    id: string;
    title_ko: string;
    title_en: string | null;
    title_zh: string | null;
    poster_url: string | null;
    status: string;
    start_date: string;
    end_date: string;
  };
}

export async function getPersonShows(personId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('show_cast')
    .select('show_id, role_name_ko, role_name_en, role_name_zh, shows(id, title_ko, title_en, title_zh, poster_url, status, start_date, end_date)')
    .eq('person_id', personId);

  if (error) return [];
  return data as unknown as PersonShowRow[];
}
