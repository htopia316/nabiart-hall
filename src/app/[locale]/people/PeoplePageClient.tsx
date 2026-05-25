'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { SegmentedControl } from '@sunghoon_lee/akron-ui';
import { PersonCard } from '@/components/features/people/PersonCard';
import { createClient } from '@/lib/supabase/client';
import type { PersonRow } from '@/types/person';

const FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'actor', label: '배우' },
  { value: 'staff', label: '스텝' },
];

export function PeoplePageClient({ serverPeople }: { serverPeople: PersonRow[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const [filter, setFilter] = useState('all');
  const [people, setPeople] = useState<PersonRow[]>(serverPeople);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('people')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setPeople(data as PersonRow[]);
      });
  }, []);

  const filtered = filter === 'all' ? people : people.filter((p) => p.role === filter);

  const getName = (p: PersonRow) => {
    if (locale === 'en' && p.name_en) return p.name_en;
    if (locale === 'zh' && p.name_zh) return p.name_zh;
    return p.name_ko;
  };

  const getPosition = (p: PersonRow) => {
    if (locale === 'en' && p.position_en) return p.position_en;
    if (locale === 'zh' && p.position_zh) return p.position_zh;
    return p.position_ko || '';
  };

  const filterLabels = [
    { value: 'all', label: t('common.shows') === '공연' ? '전체' : 'All' },
    { value: 'actor', label: t('people.actors') },
    { value: 'staff', label: t('people.staff') },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{t('common.people')}</h1>
      <p className="mb-8 text-muted-foreground">나비아트홀과 함께하는 아티스트와 스텝을 소개합니다.</p>

      <div className="mb-8">
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          options={filterLabels}
          size="md"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((person) => (
          <PersonCard
            key={person.id}
            id={person.id}
            name={getName(person)}
            position={getPosition(person)}
            role={person.role}
            photoUrl={person.photo_url}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          {t('common.noResults')}
        </div>
      )}
    </div>
  );
}
