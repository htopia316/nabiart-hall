'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Badge, Button } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types';

const MOCK_SHOWS = [
  {
    id: '1',
    title_ko: '햄릿',
    title_en: 'Hamlet',
    title_zh: '哈姆雷特',
    poster_url: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&h=560&fit=crop',
    start_date: '2026-05-01',
    end_date: '2026-06-30',
    venue: '나비아트홀 대극장',
    status: 'running',
  },
  {
    id: '2',
    title_ko: '벚꽃동산',
    title_en: 'The Cherry Orchard',
    title_zh: '樱桃园',
    poster_url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=400&h=560&fit=crop',
    start_date: '2026-06-15',
    end_date: '2026-07-20',
    venue: '나비아트홀 소극장',
    status: 'upcoming',
  },
  {
    id: '3',
    title_ko: '고도를 기다리며',
    title_en: 'Waiting for Godot',
    title_zh: '等待戈多',
    poster_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=560&fit=crop',
    start_date: '2026-05-10',
    end_date: '2026-06-15',
    venue: '나비아트홀 대극장',
    status: 'running',
  },
];

const statusColor: Record<string, 'success' | 'info' | 'neutral'> = {
  running: 'success',
  upcoming: 'info',
  ended: 'neutral',
};

export function NowPlayingSection() {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  const getTitle = (show: typeof MOCK_SHOWS[0]) => {
    const key = `title_${locale}` as keyof typeof show;
    return (show[key] as string) || show.title_ko;
  };

  const getStatusLabel = (status: string) => {
    if (status === 'running') return t('shows.current');
    if (status === 'upcoming') return t('shows.upcoming');
    return t('shows.past');
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t('landing.nowPlaying')}
        </h2>
        <Link href="/shows">
          <Button variant="ghost" size="sm">
            {t('common.more')} →
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_SHOWS.map((show) => (
          <Link key={show.id} href={`/shows/${show.id}`} className="group">
            <div className="overflow-hidden rounded-2xl bg-card transition-shadow hover:shadow-lg">
              <div className="relative aspect-[5/7] overflow-hidden">
                <Image
                  src={show.poster_url}
                  alt={getTitle(show)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3">
                  <Badge variant="solid" color={statusColor[show.status] || 'neutral'} size="sm">
                    {getStatusLabel(show.status)}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  {getTitle(show)}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {show.start_date} ~ {show.end_date}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{show.venue}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
