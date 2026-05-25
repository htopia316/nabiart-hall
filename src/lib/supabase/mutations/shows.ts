import { createClient } from '@/lib/supabase/client';

export interface ShowInput {
  title_ko: string;
  title_en?: string;
  title_zh?: string;
  description_ko?: string;
  status: 'running' | 'upcoming' | 'ended';
  venue: string;
  start_date: string;
  end_date: string;
  show_time?: string | null;
  poster_url?: string;
  banner_url?: string;
}

export async function createShow(input: ShowInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('shows')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateShow(id: string, input: Partial<ShowInput>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('shows')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteShow(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('shows')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
