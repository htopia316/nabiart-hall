'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Badge, Button } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/types';

interface Show {
  id: string;
  title_ko: string;
  title_en: string | null;
  title_zh: string | null;
  poster_url: string | null;
  start_date: string;
  end_date: string;
  venue: string;
  status: string;
}

const statusColor: Record<string, 'success' | 'info' | 'neutral'> = {
  running: 'success',
  upcoming: 'info',
  ended: 'neutral',
};

export function NowPlayingSection() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('shows')
      .select('id, title_ko, title_en, title_zh, poster_url, start_date, end_date, venue, status')
      .in('status', ['running', 'upcoming'])
      .order('start_date', { ascending: true })
      .limit(3)
      .then(({ data }) => {
        if (data) setShows(data as Show[]);
      });
  }, []);

  const getTitle = (show: Show) => {
    if (locale === 'en' && show.title_en) return show.title_en;
    if (locale === 'zh' && show.title_zh) return show.title_zh;
    return show.title_ko;
  };

  const getStatusLabel = (status: string) => {
    if (status === 'running') return t('shows.current');
    if (status === 'upcoming') return t('shows.upcoming');
    return t('shows.past');
  };

  if (shows.length === 0) return null;

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
        {shows.map((show) => (
          <Link key={show.id} href={`/shows/${show.id}`} className="group">
            <div className="overflow-hidden rounded-2xl bg-card transition-shadow hover:shadow-lg">
              <div className="relative aspect-[5/7] overflow-hidden bg-muted">
                {show.poster_url ? (
                  <Image
                    src={show.poster_url}
                    alt={getTitle(show)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">
                    🎭
                  </div>
                )}
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
