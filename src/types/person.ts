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
