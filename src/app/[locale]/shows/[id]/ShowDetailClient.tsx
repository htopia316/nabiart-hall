'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Badge, Button, Divider, Avatar, Tabs, TabsList, TabsTrigger, TabsContent } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types';

const MOCK_SHOWS: Record<string, {
  id: string;
  title_ko: string; title_en: string; title_zh: string;
  description_ko: string; description_en: string; description_zh: string;
  poster_url: string; banner_url: string;
  start_date: string; end_date: string; venue: string;
  duration_minutes: number; age_rating: string; status: string;
  cast: Array<{ name_ko: string; name_en: string; role_ko: string; role_en: string; photo_url: string }>;
  schedules: Array<{ id: string; date: string; time: string; available: number; total: number }>;
}> = {
  '1': {
    id: '1',
    title_ko: '햄릿', title_en: 'Hamlet', title_zh: '哈姆雷特',
    description_ko: '셰익스피어의 4대 비극 중 하나인 햄릿을 나비아트홀만의 감성으로 재해석한 작품입니다. 덴마크의 왕자 햄릿이 아버지의 죽음에 대한 진실을 파헤치며 겪는 내면의 갈등과 복수의 서사를 그립니다. 현대적 연출과 조명, 음악이 어우러져 관객에게 깊은 감동을 선사합니다.',
    description_en: 'A reinterpretation of Shakespeare\'s Hamlet with Nabiart Hall\'s unique sensibility. Prince Hamlet of Denmark uncovers the truth about his father\'s death through inner conflict and a narrative of revenge.',
    description_zh: '以蝴蝶艺术厅独特的感性重新诠释莎士比亚四大悲剧之一的哈姆雷特。丹麦王子哈姆雷特在揭开父亲死亡真相的过程中，经历内心的冲突与复仇的叙事。',
    poster_url: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=600&h=840&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=1600&h=600&fit=crop',
    start_date: '2026-05-01', end_date: '2026-06-30',
    venue: '나비아트홀 대극장', duration_minutes: 150, age_rating: '15세 이상', status: 'running',
    cast: [
      { name_ko: '김민수', name_en: 'Minsu Kim', role_ko: '햄릿 역', role_en: 'Hamlet', photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face' },
      { name_ko: '이서연', name_en: 'Seoyeon Lee', role_ko: '오필리아 역', role_en: 'Ophelia', photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face' },
      { name_ko: '박준혁', name_en: 'Junhyuk Park', role_ko: '클로디어스 역', role_en: 'Claudius', photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face' },
      { name_ko: '정하늘', name_en: 'Haneul Jeong', role_ko: '거트루드 역', role_en: 'Gertrude', photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face' },
    ],
    schedules: [
      { id: 's1', date: '2026-06-01', time: '14:00', available: 45, total: 100 },
      { id: 's2', date: '2026-06-01', time: '19:00', available: 32, total: 100 },
      { id: 's3', date: '2026-06-02', time: '14:00', available: 78, total: 100 },
      { id: 's4', date: '2026-06-07', time: '14:00', available: 90, total: 100 },
      { id: 's5', date: '2026-06-07', time: '19:00', available: 65, total: 100 },
    ],
  },
  '2': {
    id: '2',
    title_ko: '벚꽃동산', title_en: 'The Cherry Orchard', title_zh: '樱桃园',
    description_ko: '체호프의 마지막 희곡. 변화하는 시대 속 인간 군상을 따뜻한 시선으로 그려냅니다. 몰락하는 귀족 가문과 새로운 시대를 상징하는 인물들의 대비를 통해 삶의 의미를 되묻습니다.',
    description_en: 'Chekhov\'s last play. A warm portrayal of human nature in changing times.',
    description_zh: '契诃夫的最后一部戏剧。以温暖的视角描绘变革时代中的人生百态。',
    poster_url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=600&h=840&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1600&h=600&fit=crop',
    start_date: '2026-06-15', end_date: '2026-07-20',
    venue: '나비아트홀 소극장', duration_minutes: 120, age_rating: '전체 관람가', status: 'upcoming',
    cast: [
      { name_ko: '최유진', name_en: 'Yujin Choi', role_ko: '라네프스카야 역', role_en: 'Ranevskaya', photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face' },
      { name_ko: '한동우', name_en: 'Dongwoo Han', role_ko: '로파힌 역', role_en: 'Lopakhin', photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face' },
    ],
    schedules: [
      { id: 's6', date: '2026-06-15', time: '15:00', available: 60, total: 60 },
      { id: 's7', date: '2026-06-16', time: '15:00', available: 60, total: 60 },
    ],
  },
};

const statusColor: Record<string, 'success' | 'info' | 'neutral'> = {
  running: 'success', upcoming: 'info', ended: 'neutral',
};

export function ShowDetailClient({ showId }: { showId: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations();

  const show = MOCK_SHOWS[showId];

  if (!show) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">{t('common.noResults')}</p>
      </div>
    );
  }

  const title = (show as Record<string, unknown>)[`title_${locale}`] as string || show.title_ko;
  const description = (show as Record<string, unknown>)[`description_${locale}`] as string || show.description_ko;
  const statusLabel =
    show.status === 'running' ? t('shows.current') :
    show.status === 'upcoming' ? t('shows.upcoming') : t('shows.past');

  return (
    <div>
      {/* Banner */}
      <div className="relative h-[30vh] min-h-[240px] w-full overflow-hidden bg-muted sm:h-[40vh]">
        {show.banner_url && (
          <Image src={show.banner_url} alt="" fill sizes="100vw" className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 flex flex-col gap-8 pb-16 lg:flex-row lg:gap-12">
          {/* Poster */}
          <div className="shrink-0">
            <div className="w-48 overflow-hidden rounded-xl shadow-2xl sm:w-56 lg:w-64">
              <Image
                src={show.poster_url}
                alt={title}
                width={256}
                height={358}
                sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px"
                className="aspect-[5/7] w-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-2 lg:pt-8">
            <div className="flex items-center gap-3">
              <Badge variant="solid" color={statusColor[show.status]} size="md">
                {statusLabel}
              </Badge>
              {show.age_rating && (
                <Badge variant="outline" color="neutral" size="md">
                  {show.age_rating}
                </Badge>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span>📅 {show.start_date} ~ {show.end_date}</span>
              <span>📍 {show.venue}</span>
              {show.duration_minutes && <span>⏱ {show.duration_minutes}{t('common.home') ? '분' : 'min'}</span>}
            </div>

            <div className="mt-6">
              <Link href={`/booking?show=${show.id}`}>
                <Button variant="primary" size="lg">
                  {t('shows.bookNow')}
                </Button>
              </Link>
            </div>

            {/* Tabs */}
            <div className="mt-10">
              <Tabs defaultValue="about">
                <TabsList>
                  <TabsTrigger value="about">{t('shows.details')}</TabsTrigger>
                  <TabsTrigger value="cast">{t('shows.cast')}</TabsTrigger>
                  <TabsTrigger value="schedule">{t('shows.schedule')}</TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                  <div className="mt-4 max-w-2xl">
                    <p className="whitespace-pre-line text-base leading-relaxed text-foreground/80">
                      {description}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="cast">
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {show.cast.map((member, i) => {
                      const name = locale === 'en' ? member.name_en : member.name_ko;
                      const role = locale === 'en' ? member.role_en : member.role_ko;
                      return (
                        <div key={i} className="flex flex-col items-center gap-2 rounded-xl p-4 text-center">
                          <Avatar
                            src={member.photo_url}
                            name={name}
                            size="xl"
                          />
                          <div>
                            <p className="text-sm font-semibold">{name}</p>
                            <p className="text-xs text-muted-foreground">{role}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="schedule">
                  <div className="mt-4 space-y-2">
                    {show.schedules.map((sched) => (
                      <div
                        key={sched.id}
                        className="flex items-center justify-between rounded-xl border border-border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold">{sched.date}</p>
                            <p className="text-sm text-muted-foreground">{sched.time}</p>
                          </div>
                          <Badge
                            variant="subtle"
                            color={sched.available > 20 ? 'success' : sched.available > 0 ? 'warning' : 'error'}
                            size="sm"
                          >
                            {sched.available}/{sched.total}
                          </Badge>
                        </div>
                        <Link href={`/booking?show=${show.id}&schedule=${sched.id}`}>
                          <Button variant="outline" size="sm" disabled={sched.available === 0}>
                            {t('shows.bookNow')}
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
