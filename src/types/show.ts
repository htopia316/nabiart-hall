export type ShowRow = {
  id: string;
  title_ko: string;
  title_en: string | null;
  title_zh: string | null;
  description_ko: string | null;
  description_en: string | null;
  description_zh: string | null;
  poster_url: string | null;
  banner_url: string | null;
  start_date: string;
  end_date: string;
  venue: string;
  duration_minutes: number | null;
  age_rating: string | null;
  status: 'upcoming' | 'running' | 'ended';
  is_featured: boolean;
  created_at: string;
};
