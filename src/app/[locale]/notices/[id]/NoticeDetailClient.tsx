'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Badge, Button } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import type { NoticeRow } from '@/types/notice';

export function NoticeDetailClient({
  noticeId,
  serverNotice,
}: {
  noticeId: string;
  serverNotice: NoticeRow | null;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [notice, setNotice] = useState<NoticeRow | null>(serverNotice);
  const [loading, setLoading] = useState(!serverNotice);

  useEffect(() => {
    if (serverNotice) return;
    const supabase = createClient();
    supabase
      .from('notices')
      .select('*')
      .eq('id', noticeId)
      .single()
      .then(({ data }) => {
        if (data) setNotice(data as NoticeRow);
        setLoading(false);
      });
  }, [noticeId, serverNotice]);

  if (loading) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted-foreground">로딩 중...</div>;
  }

  if (!notice) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-muted-foreground">{t('common.noResults')}</p>
        <Link href="/notices">
          <Button variant="ghost" className="mt-4">{t('common.back')}</Button>
        </Link>
      </div>
    );
  }

  const title = locale === 'en' && notice.title_en ? notice.title_en : locale === 'zh' && notice.title_zh ? notice.title_zh : notice.title_ko;
  const content = locale === 'en' && notice.content_en ? notice.content_en : locale === 'zh' && notice.content_zh ? notice.content_zh : notice.content_ko;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === 'zh' ? 'zh-CN' : locale === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/notices">
        <Button variant="ghost" size="sm" className="mb-6">← {t('common.back')}</Button>
      </Link>

      <article>
        <div className="mb-6">
          {notice.is_pinned && (
            <Badge variant="subtle" color="warning" size="sm" className="mb-3">
              {t('notices.pinned')}
            </Badge>
          )}
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{formatDate(notice.created_at)}</p>
        </div>

        <div className="rounded-2xl border border-border p-6 sm:p-8">
          <div className="whitespace-pre-line leading-relaxed">
            {content}
          </div>
        </div>
      </article>
    </div>
  );
}
