'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Badge, Button, Divider, Avatar, Tabs, TabsList, TabsTrigger, TabsContent } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/types';

interface ShowDetail {
  id: string;
  title_ko: string;
  title_en: string | null;
  title_zh: string | null;
  description_ko: string | null;
  description_en: string | null;
  description_zh: string | null;
  poster_url: string | null;
  banner_url: string | null;
  start_date: string;
  end_date: string;
  venue: string;
  duration_minutes: number | null;
  age_rating: string | null;
  status: string;
}

interface Schedule {
  id: string;
  show_date: string;
  show_time: string;
  total_seats: number;
  available_seats: number;
}

interface CastMember {
  person_id: string;
  role_name_ko: string | null;
  role_name_en: string | null;
  people: {
    name_ko: string;
    name_en: string | null;
    photo_url: string | null;
  };
}

const statusColor: Record<string, 'success' | 'info' | 'neutral'> = {
  running: 'success', upcoming: 'info', ended: 'neutral',
};

export function ShowDetailClient({ showId }: { showId: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const [show, setShow] = useState<ShowDetail | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from('shows').select('*').eq('id', showId).single(),
      supabase.from('schedules').select('id, show_date, show_time, total_seats, available_seats').eq('show_id', showId).order('show_date').order('show_time'),
      supabase.from('show_cast').select('person_id, role_name_ko, role_name_en, people(name_ko, name_en, photo_url)').eq('show_id', showId),
    ]).then(([showRes, schedRes, castRes]) => {
      if (showRes.data) setShow(showRes.data as ShowDetail);
      if (schedRes.data) setSchedules(schedRes.data as Schedule[]);
      if (castRes.data) setCast(castRes.data.map((c: Record<string, unknown>) => ({
        ...c,
        people: Array.isArray(c.people) ? c.people[0] : c.people,
      })) as CastMember[]);
      setLoading(false);
    });
  }, [showId]);

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">로딩 중...</div>;
  }

  if (!show) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">{t('common.noResults')}</p>
      </div>
    );
  }

  const title = locale === 'en' && show.title_en ? show.title_en : locale === 'zh' && show.title_zh ? show.title_zh : show.title_ko;
  const description = locale === 'en' && show.description_en ? show.description_en : locale === 'zh' && show.description_zh ? show.description_zh : show.description_ko || '';
  const statusLabel =
    show.status === 'running' ? t('shows.current') :
    show.status === 'upcoming' ? t('shows.upcoming') : t('shows.past');

  return (
    <div>
      <div className="relative h-[30vh] min-h-[240px] w-full overflow-hidden bg-muted sm:h-[40vh]">
        {show.banner_url && (
          <Image src={show.banner_url} alt="" fill sizes="100vw" className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 flex flex-col gap-8 pb-16 lg:flex-row lg:gap-12">
          <div className="shrink-0">
            <div className="w-48 overflow-hidden rounded-xl shadow-2xl sm:w-56 lg:w-64">
              {show.poster_url ? (
                <Image
                  src={show.poster_url}
                  alt={title}
                  width={256}
                  height={358}
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px"
                  className="aspect-[5/7] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[5/7] w-full items-center justify-center bg-muted text-6xl">🎭</div>
              )}
            </div>
          </div>

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
              {show.duration_minutes && <span>⏱ {show.duration_minutes}분</span>}
            </div>

            <div className="mt-6">
              <Link href={`/booking?show=${show.id}`}>
                <Button variant="primary" size="lg">
                  {t('shows.bookNow')}
                </Button>
              </Link>
            </div>

            <div className="mt-10">
              <Tabs defaultValue="about">
                <TabsList>
                  <TabsTrigger value="about">{t('shows.details')}</TabsTrigger>
                  {cast.length > 0 && <TabsTrigger value="cast">{t('shows.cast')}</TabsTrigger>}
                  {schedules.length > 0 && <TabsTrigger value="schedule">{t('shows.schedule')}</TabsTrigger>}
                </TabsList>

                <TabsContent value="about">
                  <div className="mt-4 max-w-2xl">
                    <p className="whitespace-pre-line text-base leading-relaxed text-foreground/80">
                      {description}
                    </p>
                  </div>
                </TabsContent>

                {cast.length > 0 && (
                  <TabsContent value="cast">
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {cast.map((member) => {
                        const name = locale === 'en' && member.people.name_en ? member.people.name_en : member.people.name_ko;
                        const role = locale === 'en' && member.role_name_en ? member.role_name_en : member.role_name_ko || '';
                        return (
                          <div key={member.person_id} className="flex flex-col items-center gap-2 rounded-xl p-4 text-center">
                            <Avatar
                              src={member.people.photo_url || undefined}
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
                )}

                {schedules.length > 0 && (
                  <TabsContent value="schedule">
                    <div className="mt-4 space-y-2">
                      {schedules.map((sched) => (
                        <div
                          key={sched.id}
                          className="flex items-center justify-between rounded-xl border border-border p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-semibold">{sched.show_date}</p>
                              <p className="text-sm text-muted-foreground">{sched.show_time}</p>
                            </div>
                            <Badge
                              variant="subtle"
                              color={sched.available_seats > 20 ? 'success' : sched.available_seats > 0 ? 'warning' : 'error'}
                              size="sm"
                            >
                              {sched.available_seats}/{sched.total_seats}
                            </Badge>
                          </div>
                          <Link href={`/booking?show=${show.id}&schedule=${sched.id}`}>
                            <Button variant="outline" size="sm" disabled={sched.available_seats === 0}>
                              {t('shows.bookNow')}
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
