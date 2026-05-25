'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Avatar, Badge, Button } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import type { PersonRow } from '@/types/person';
import type { PersonShowRow } from '@/lib/supabase/queries/people';

const MOCK_PEOPLE: Record<string, PersonRow> = {
  p1: {
    id: 'p1', name_ko: '김민수', name_en: 'Minsu Kim', name_zh: '金民秀',
    role: 'actor', position_ko: '배우', position_en: 'Actor', position_zh: '演员',
    photo_url: null, bio_ko: '서울예술대학 연극학과 졸업. 나비아트홀 창단 멤버로 다수의 작품에 출연.\n\n대표 출연작으로는 《햄릿》의 햄릿 역, 《벚꽃동산》의 로파힌 역 등이 있으며, 깊이 있는 감정 표현과 무대 장악력으로 관객들에게 꾸준한 사랑을 받고 있습니다.', bio_en: 'Graduated from Seoul Institute of the Arts. Founding member of Nabiart Hall.\n\nNotable roles include Hamlet in "Hamlet" and Lopakhin in "The Cherry Orchard". Known for emotional depth and commanding stage presence.', bio_zh: '首尔艺术大学戏剧系毕业。蝴蝶艺术厅创始成员。\n\n代表作包括《哈姆雷特》中的哈姆雷特和《樱桃园》中的罗帕金。以深厚的情感表达和舞台掌控力著称。',
    sort_order: 1, is_active: true,
  },
  p2: {
    id: 'p2', name_ko: '이서연', name_en: 'Seoyeon Lee', name_zh: '李瑞妍',
    role: 'actor', position_ko: '배우', position_en: 'Actor', position_zh: '演员',
    photo_url: null, bio_ko: '한국예술종합학교 연극원 졸업. 다양한 장르의 연극과 뮤지컬에서 활약 중.\n\n특유의 밝은 에너지와 정교한 감정선으로 코미디와 비극을 넘나드는 배우입니다.', bio_en: 'Graduated from Korea National University of Arts. Active in various theatrical genres.\n\nKnown for bright energy and refined emotional range, seamlessly transitioning between comedy and tragedy.', bio_zh: '韩国艺术综合大学毕业。活跃在各种戏剧和音乐剧中。\n\n以独特的明亮能量和精致的情感线条，在喜剧和悲剧之间自如穿梭。',
    sort_order: 2, is_active: true,
  },
  p5: {
    id: 'p5', name_ko: '정하늘', name_en: 'Haneul Jeong', name_zh: '郑河天',
    role: 'staff', position_ko: '연출', position_en: 'Director', position_zh: '导演',
    photo_url: null, bio_ko: '나비아트홀 상임 연출. 실험적이면서도 관객 친화적인 연출 스타일.\n\n현대 연극의 실험성과 고전의 깊이를 결합하여, 매 작품마다 새로운 시도를 이어가고 있습니다.', bio_en: 'Resident director of Nabiart Hall. Known for experimental yet audience-friendly direction.\n\nCombines modern theatrical experimentation with classical depth, pursuing new approaches in every production.', bio_zh: '蝴蝶艺术厅常驻导演。以实验性但观众友好的导演风格著称。\n\n将现代戏剧的实验性与古典的深度相结合，在每部作品中不断尝试新的方法。',
    sort_order: 5, is_active: true,
  },
};

const MOCK_SHOWS: { personId: string; shows: { title_ko: string; role_ko: string; status: string; year: string }[] }[] = [
  { personId: 'p1', shows: [
    { title_ko: '햄릿', role_ko: '햄릿 역', status: 'running', year: '2026' },
    { title_ko: '벚꽃동산', role_ko: '로파힌 역', status: 'ended', year: '2025' },
    { title_ko: '고도를 기다리며', role_ko: '블라디미르 역', status: 'ended', year: '2025' },
  ]},
  { personId: 'p2', shows: [
    { title_ko: '인형의 집', role_ko: '노라 역', status: 'upcoming', year: '2026' },
    { title_ko: '맥베스', role_ko: '레이디 맥베스 역', status: 'ended', year: '2025' },
  ]},
];

export function PersonDetailClient({
  personId,
  serverPerson,
  serverShows,
}: {
  personId: string;
  serverPerson: PersonRow | null;
  serverShows: PersonShowRow[];
}) {
  const t = useTranslations();
  const locale = useLocale();

  const person = serverPerson || MOCK_PEOPLE[personId];
  const mockShowData = MOCK_SHOWS.find((s) => s.personId === personId);

  if (!person) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-muted-foreground">{t('common.noResults')}</p>
        <Link href="/people">
          <Button variant="ghost" className="mt-4">{t('common.back')}</Button>
        </Link>
      </div>
    );
  }

  const name = locale === 'en' && person.name_en ? person.name_en : locale === 'zh' && person.name_zh ? person.name_zh : person.name_ko;
  const position = locale === 'en' && person.position_en ? person.position_en : locale === 'zh' && person.position_zh ? person.position_zh : person.position_ko || '';
  const bio = locale === 'en' && person.bio_en ? person.bio_en : locale === 'zh' && person.bio_zh ? person.bio_zh : person.bio_ko || '';

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/people">
        <Button variant="ghost" size="sm" className="mb-6">← {t('common.back')}</Button>
      </Link>

      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        <div className="shrink-0">
          <Avatar
            src={person.photo_url || undefined}
            name={name}
            size="xl"
            shape="circle"
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <h1 className="text-3xl font-bold">{name}</h1>
            <Badge
              variant="subtle"
              color={person.role === 'actor' ? 'primary' : 'success'}
              size="md"
            >
              {person.role === 'actor' ? t('people.actors') : t('people.staff')}
            </Badge>
          </div>
          <p className="mt-1 text-lg text-muted-foreground">{position}</p>

          <div className="mt-6 whitespace-pre-line text-sm leading-relaxed">
            {bio}
          </div>
        </div>
      </div>

      {/* Filmography / Shows */}
      {(serverShows.length > 0 || (mockShowData && mockShowData.shows.length > 0)) && (
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-semibold">{t('people.filmography')}</h2>
          <div className="space-y-3">
            {serverShows.length > 0
              ? serverShows.map((s) => {
                  const title = locale === 'en' && s.shows.title_en ? s.shows.title_en : locale === 'zh' && s.shows.title_zh ? s.shows.title_zh : s.shows.title_ko;
                  const roleName = locale === 'en' && s.role_name_en ? s.role_name_en : locale === 'zh' && s.role_name_zh ? s.role_name_zh : s.role_name_ko || '';
                  return (
                    <Link key={s.show_id} href={`/shows/${s.show_id}`}>
                      <div className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-muted/50">
                        <div>
                          <p className="font-semibold">{title}</p>
                          {roleName && <p className="text-sm text-muted-foreground">{roleName}</p>}
                        </div>
                        <Badge
                          variant="subtle"
                          color={s.shows.status === 'running' ? 'success' : s.shows.status === 'upcoming' ? 'warning' : 'neutral'}
                          size="sm"
                        >
                          {s.shows.status === 'running' ? t('shows.current') : s.shows.status === 'upcoming' ? t('shows.upcoming') : t('shows.past')}
                        </Badge>
                      </div>
                    </Link>
                  );
                })
              : mockShowData?.shows.map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div>
                      <p className="font-semibold">{s.title_ko}</p>
                      <p className="text-sm text-muted-foreground">{s.role_ko}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{s.year}</span>
                      <Badge
                        variant="subtle"
                        color={s.status === 'running' ? 'success' : s.status === 'upcoming' ? 'warning' : 'neutral'}
                        size="sm"
                      >
                        {s.status === 'running' ? t('shows.current') : s.status === 'upcoming' ? t('shows.upcoming') : t('shows.past')}
                      </Badge>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
