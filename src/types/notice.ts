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
