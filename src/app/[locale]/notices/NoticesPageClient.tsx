'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Badge, Input } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import type { NoticeRow } from '@/types/notice';

export function NoticesPageClient({ serverNotices }: { serverNotices: NoticeRow[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [notices, setNotices] = useState<NoticeRow[]>(serverNotices);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('notices')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setNotices(data as NoticeRow[]);
      });
  }, []);

  const getTitle = (n: NoticeRow) => {
    if (locale === 'en' && n.title_en) return n.title_en;
    if (locale === 'zh' && n.title_zh) return n.title_zh;
    return n.title_ko;
  };

  const filtered = search
    ? notices.filter((n) => getTitle(n).toLowerCase().includes(search.toLowerCase()))
    : notices;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === 'zh' ? 'zh-CN' : locale === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{t('notices.title')}</h1>
      <p className="mb-8 text-muted-foreground">나비아트홀의 소식을 전합니다.</p>

      <div className="mb-6">
        <Input
          placeholder={t('common.search') + '...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="divide-y divide-border rounded-2xl border border-border">
        {filtered.map((notice) => (
          <Link key={notice.id} href={`/notices/${notice.id}`}>
            <div className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-3">
                {notice.is_pinned && (
                  <Badge variant="subtle" color="warning" size="sm">
                    {t('notices.pinned')}
                  </Badge>
                )}
                <span className={`font-medium ${notice.is_pinned ? 'font-semibold' : ''}`}>
                  {getTitle(notice)}
                </span>
              </div>
              <span className="shrink-0 text-sm text-muted-foreground">
                {formatDate(notice.created_at)}
              </span>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            {t('common.noResults')}
          </div>
        )}
      </div>
    </div>
  );
}
