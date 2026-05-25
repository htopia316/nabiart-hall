'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Badge, Button } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import type { NoticeRow } from '@/types/notice';

const MOCK_NOTICES: Record<string, NoticeRow> = {
  n1: {
    id: 'n1',
    title_ko: '2026년 상반기 공연 일정 안내',
    title_en: '2026 First Half Performance Schedule',
    title_zh: '2026年上半年演出日程通知',
    content_ko: `안녕하세요, 나비아트홀입니다.

2026년 상반기 공연 일정을 안내드립니다.

■ 6월
- 《햄릿》 6/1(일) ~ 6/8(일), 총 6회 공연
- 《벚꽃동산》 6/14(토) ~ 6/22(일), 총 8회 공연

■ 7월
- 《고도를 기다리며》 7/4(토) ~ 7/12(일), 총 6회 공연
- 신작 공연 TBA

■ 8월
- 여름 특별 기획 공연 (추후 공지)

예매는 각 공연 2주 전부터 홈페이지에서 가능합니다.
많은 관심과 응원 부탁드립니다.

나비아트홀 드림`,
    content_en: `Hello, this is Nabiart Hall.

We are pleased to announce our performance schedule for the first half of 2026.

■ June
- "Hamlet" June 1 (Sun) ~ June 8 (Sun), 6 performances
- "The Cherry Orchard" June 14 (Sat) ~ June 22 (Sun), 8 performances

■ July
- "Waiting for Godot" July 4 (Sat) ~ July 12 (Sun), 6 performances
- New production TBA

■ August
- Summer special production (details to follow)

Tickets will be available on our website 2 weeks before each performance.
Thank you for your continued support.

Nabiart Hall`,
    content_zh: null,
    is_pinned: true, created_at: '2026-01-15T09:00:00Z', updated_at: '2026-01-15T09:00:00Z',
  },
  n3: {
    id: 'n3',
    title_ko: '《햄릿》 추가 공연 확정',
    title_en: '"Hamlet" Additional Performances Confirmed',
    title_zh: '《哈姆雷特》加演确定',
    content_ko: `관객 여러분의 뜨거운 성원에 힘입어 《햄릿》 추가 공연이 확정되었습니다.

■ 추가 공연 일정
- 6월 9일(월) 19:00
- 6월 10일(화) 14:00 / 19:00

■ 예매 안내
- 예매 오픈: 5월 25일(일) 10:00
- 예매처: 나비아트홀 홈페이지

좌석이 한정되어 있으니 서둘러 예매해주세요!`,
    content_en: `Due to overwhelming audience response, additional performances of "Hamlet" have been confirmed.

■ Additional Performances
- June 9 (Mon) 19:00
- June 10 (Tue) 14:00 / 19:00

■ Booking Information
- Tickets open: May 25 (Sun) 10:00
- Book at: Nabiart Hall website

Seats are limited, so please book early!`,
    content_zh: null,
    is_pinned: false, created_at: '2026-05-20T09:00:00Z', updated_at: '2026-05-20T09:00:00Z',
  },
};

export function NoticeDetailClient({
  noticeId,
  serverNotice,
}: {
  noticeId: string;
  serverNotice: NoticeRow | null;
}) {
  const t = useTranslations();
  const locale = useLocale();

  const notice = serverNotice || MOCK_NOTICES[noticeId];

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
