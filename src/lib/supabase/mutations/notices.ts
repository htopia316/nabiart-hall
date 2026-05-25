import { createClient } from '@/lib/supabase/client';

export interface NoticeInput {
  title_ko: string;
  title_en?: string;
  title_zh?: string;
  content_ko: string;
  content_en?: string;
  content_zh?: string;
  is_pinned?: boolean;
}

export async function createNotice(input: NoticeInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notices')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNotice(id: string, input: Partial<NoticeInput>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notices')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNotice(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('notices')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
