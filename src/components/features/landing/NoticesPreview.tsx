'use client';

import { useTranslations } from 'next-intl';
import { Badge, Button, Divider } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';

const MOCK_NOTICES = [
  {
    id: '1',
    title: '2026년 하반기 공연 라인업 공개',
    is_pinned: true,
    created_at: '2026-05-20',
  },
  {
    id: '2',
    title: '나비아트홀 여름 연극 캠프 참가자 모집',
    is_pinned: false,
    created_at: '2026-05-18',
  },
  {
    id: '3',
    title: '6월 공연 티켓 오픈 안내',
    is_pinned: false,
    created_at: '2026-05-15',
  },
  {
    id: '4',
    title: '주차장 이용 안내 변경사항',
    is_pinned: false,
    created_at: '2026-05-10',
  },
];

export function NoticesPreview() {
  const t = useTranslations();

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
          {MOCK_NOTICES.map((notice, i) => (
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
                    {notice.title}
                  </span>
                </div>
                <span className="hidden shrink-0 text-sm text-muted-foreground sm:block">
                  {notice.created_at}
                </span>
              </Link>
              {i < MOCK_NOTICES.length - 1 && <Divider className="mx-4" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
