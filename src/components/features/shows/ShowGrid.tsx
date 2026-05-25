'use client';

import type { ShowRow } from '@/types/show';
import { ShowCard } from './ShowCard';
import { EmptyState } from '@sunghoon_lee/akron-ui';
import { useTranslations } from 'next-intl';

export function ShowGrid({ shows }: { shows: ShowRow[] }) {
  const t = useTranslations('common');

  if (shows.length === 0) {
    return (
      <EmptyState
        size="lg"
        title={t('noResults')}
        description=""
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} />
      ))}
    </div>
  );
}
