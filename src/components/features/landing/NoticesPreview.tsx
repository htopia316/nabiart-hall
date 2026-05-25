'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Badge, Button, Divider } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

interface Notice {
  id: string;
  title_ko: string;
  is_pinned: boolean;
  created_at: string;
}

export function NoticesPreview() {
  const t = useTranslations();
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('notices')
      .select('id, title_ko, is_pinned, created_at')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data) setNotices(data as Notice[]);
      });
  }, []);

  if (notices.length === 0) return null;

  return (
    <section className="bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t('landing.latestNotices')}
          </h2>
          <Link href="/notices">
            <Button variant="ghost" size="sm">
              {t('common.more')} →
            </Button>
          </Link>
        </div>

        <div className="rounded-2xl bg-card p-2">
          {notices.map((notice, i) => (
            <div key={notice.id}>
              <Link
                href={`/notices/${notice.id}`}
                className="flex items-center justify-between rounded-xl px-4 py-4 transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  {notice.is_pinned && (
                    <Badge variant="subtle" color="primary" size="sm">
                      {t('notices.pinned')}
                    </Badge>
                  )}
                  <span className="text-sm font-medium text-card-foreground sm:text-base">
                    {notice.title_ko}
                  </span>
                </div>
                <span className="hidden shrink-0 text-sm text-muted-foreground sm:block">
                  {notice.created_at.slice(0, 10)}
                </span>
              </Link>
              {i < notices.length - 1 && <Divider className="mx-4" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
