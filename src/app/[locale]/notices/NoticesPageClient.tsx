'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Badge, Input } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import type { NoticeRow } from '@/types/notice';

const MOCK_NOTICES: NoticeRow[] = [
  {
    id: 'n1', title_ko: '2026년 상반기 공연 일정 안내', title_en: '2026 First Half Performance Schedule', title_zh: '2026年上半年演出日程通知',
    content_ko: '', content_en: null, content_zh: null,
    is_pinned: true, created_at: '2026-01-15T09:00:00Z', updated_at: '2026-01-15T09:00:00Z',
  },
  {
    id: 'n2', title_ko: '나비아트홀 회원 가입 안내', title_en: 'Nabiart Hall Membership Guide', title_zh: '蝴蝶艺术厅会员注册指南',
    content_ko: '', content_en: null, content_zh: null,
    is_pinned: true, created_at: '2026-01-10T09:00:00Z', updated_at: '2026-01-10T09:00:00Z',
  },
  {
    id: 'n3', title_ko: '《햄릿》 추가 공연 확정', title_en: '"Hamlet" Additional Performances Confirmed', title_zh: '《哈姆雷特》加演确定',
    content_ko: '', content_en: null, content_zh: null,
    is_pinned: false, created_at: '2026-05-20T09:00:00Z', updated_at: '2026-05-20T09:00:00Z',
  },
  {
    id: 'n4', title_ko: '5월 휴관일 안내', title_en: 'May Closure Notice', title_zh: '5月闭馆日通知',
    content_ko: '', content_en: null, content_zh: null,
    is_pinned: false, created_at: '2026-05-01T09:00:00Z', updated_at: '2026-05-01T09:00:00Z',
  },
  {
    id: 'n5', title_ko: '후원자 감사 이벤트 개최', title_en: 'Donor Appreciation Event', title_zh: '赞助人感谢活动举办',
    content_ko: '', content_en: null, content_zh: null,
    is_pinned: false, created_at: '2026-04-15T09:00:00Z', updated_at: '2026-04-15T09:00:00Z',
  },
  {
    id: 'n6', title_ko: '대관 요금 개정 안내 (6월 1일부터)', title_en: 'Rental Fee Revision (From June 1)', title_zh: '场地租赁费用调整通知（6月1日起）',
    content_ko: '', content_en: null, content_zh: null,
    is_pinned: false, created_at: '2026-04-01T09:00:00Z', updated_at: '2026-04-01T09:00:00Z',
  },
  {
    id: 'n7', title_ko: '신입 배우 오디션 안내', title_en: 'New Actor Audition Notice', title_zh: '新演员试镜通知',
    content_ko: '', content_en: null, content_zh: null,
    is_pinned: false, created_at: '2026-03-20T09:00:00Z', updated_at: '2026-03-20T09:00:00Z',
  },
];

export function NoticesPageClient({ serverNotices }: { serverNotices: NoticeRow[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const [search, setSearch] = useState('');

  const notices = serverNotices.length > 0 ? serverNotices : MOCK_NOTICES;

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
