'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { ShowRow } from '@/types/show';
import { ShowGrid } from '@/components/features/shows/ShowGrid';
import { ShowStatusFilter } from '@/components/features/shows/ShowStatusFilter';
import { createClient } from '@/lib/supabase/client';

type Status = 'all' | 'running' | 'upcoming' | 'ended';

export function ShowsPageClient({ shows: initialShows }: { shows: ShowRow[] }) {
  const t = useTranslations();
  const [status, setStatus] = useState<Status>('all');
  const [shows, setShows] = useState<ShowRow[]>(initialShows);
  const [loading, setLoading] = useState(initialShows.length === 0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('shows')
      .select('*')
      .order('start_date', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setShows(data as ShowRow[]);
        }
        setLoading(false);
      });
  }, []);

  const filtered = status === 'all'
    ? shows
    : shows.filter((s) => s.status === status);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('common.shows')}
        </h1>
      </div>

      <div className="mb-8">
        <ShowStatusFilter value={status} onChange={setStatus} />
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">로딩 중...</div>
      ) : shows.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">등록된 공연이 없습니다.</div>
      ) : (
        <ShowGrid shows={filtered} />
      )}
    </div>
  );
}
