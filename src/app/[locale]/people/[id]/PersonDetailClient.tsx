'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Avatar, Badge, Button } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import type { PersonRow } from '@/types/person';
import type { PersonShowRow } from '@/lib/supabase/queries/people';

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
  const [person, setPerson] = useState<PersonRow | null>(serverPerson);
  const [shows, setShows] = useState<PersonShowRow[]>(serverShows);
  const [loading, setLoading] = useState(!serverPerson);

  useEffect(() => {
    if (serverPerson) return;
    const supabase = createClient();
    supabase
      .from('people')
      .select('*')
      .eq('id', personId)
      .single()
      .then(({ data }) => {
        if (data) setPerson(data as PersonRow);
        setLoading(false);
      });
  }, [personId, serverPerson]);

  if (loading) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted-foreground">로딩 중...</div>;
  }

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

      {shows.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-semibold">{t('people.filmography')}</h2>
          <div className="space-y-3">
            {shows.map((s) => {
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
            })}
          </div>
        </div>
      )}
    </div>
  );
}
