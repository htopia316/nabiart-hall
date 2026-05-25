'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Badge } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import type { ShowRow } from '@/types/show';

function localizeShow(show: ShowRow, locale: string) {
  const get = (field: string) =>
    (show as Record<string, unknown>)[`${field}_${locale}`] as string ||
    (show as Record<string, unknown>)[`${field}_ko`] as string || '';
  return { ...show, title: get('title'), description: get('description') };
}
import type { Locale } from '@/types';

const statusColor: Record<string, 'success' | 'info' | 'neutral'> = {
  running: 'success',
  upcoming: 'info',
  ended: 'neutral',
};

export function ShowCard({ show }: { show: ShowRow }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('shows');
  const localized = localizeShow(show, locale);

  const statusLabel =
    show.status === 'running' ? t('current') :
    show.status === 'upcoming' ? t('upcoming') : t('past');

  return (
    <Link href={`/shows/${show.id}`} className="group">
      <div className="overflow-hidden rounded-2xl bg-card transition-shadow hover:shadow-lg">
        <div className="relative aspect-[5/7] overflow-hidden bg-muted">
          {show.poster_url ? (
            <Image
              src={show.poster_url}
              alt={localized.title}
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
              {statusLabel}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-card-foreground">{localized.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {show.start_date} ~ {show.end_date}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">{show.venue}</p>
        </div>
      </div>
    </Link>
  );
}
