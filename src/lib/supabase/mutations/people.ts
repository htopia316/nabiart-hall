import { createClient } from '@/lib/supabase/client';

export interface PersonInput {
  name_ko: string;
  name_en?: string;
  name_zh?: string;
  role: 'actor' | 'staff';
  position_ko: string;
  position_en?: string;
  position_zh?: string;
  bio_ko?: string;
  photo_url?: string;
  is_active?: boolean;
}

export async function createPerson(input: PersonInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('people')
    .insert({ ...input, is_active: true })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePerson(id: string, input: Partial<PersonInput>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('people')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePerson(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('people')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
