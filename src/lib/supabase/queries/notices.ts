import 'server-only';
import { createClient } from '../server';

export interface NoticeRow {
  id: string;
  title_ko: string;
  title_en: string | null;
  title_zh: string | null;
  content_ko: string;
  content_en: string | null;
  content_zh: string | null;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export async function getNotices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) return [];
  return data as NoticeRow[];
}

export async function getNoticeById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as NoticeRow;
}
