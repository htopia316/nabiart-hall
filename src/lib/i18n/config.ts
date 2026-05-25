import type { Locale } from '@/types';

export const locales: Locale[] = ['ko', 'en', 'zh'];
export const defaultLocale: Locale = 'ko';

export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
};
