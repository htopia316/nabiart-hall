'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { SegmentedControl } from '@sunghoon_lee/akron-ui';
import { PersonCard } from '@/components/features/people/PersonCard';
import type { PersonRow } from '@/types/person';

const MOCK_PEOPLE: PersonRow[] = [
  {
    id: 'p1', name_ko: '김민수', name_en: 'Minsu Kim', name_zh: '金民秀',
    role: 'actor', position_ko: '배우', position_en: 'Actor', position_zh: '演员',
    photo_url: null, bio_ko: '서울예술대학 연극학과 졸업. 나비아트홀 창단 멤버로 다수의 작품에 출연.', bio_en: 'Graduated from Seoul Institute of the Arts. Founding member of Nabiart Hall.', bio_zh: '首尔艺术大学戏剧系毕业。蝴蝶艺术厅创始成员。',
    sort_order: 1, is_active: true,
  },
  {
    id: 'p2', name_ko: '이서연', name_en: 'Seoyeon Lee', name_zh: '李瑞妍',
    role: 'actor', position_ko: '배우', position_en: 'Actor', position_zh: '演员',
    photo_url: null, bio_ko: '한국예술종합학교 연극원 졸업. 다양한 장르의 연극과 뮤지컬에서 활약 중.', bio_en: 'Graduated from Korea National University of Arts. Active in various theatrical genres.', bio_zh: '韩国艺术综合大学毕业。活跃在各种戏剧和音乐剧中。',
    sort_order: 2, is_active: true,
  },
  {
    id: 'p3', name_ko: '박준호', name_en: 'Junho Park', name_zh: '朴俊浩',
    role: 'actor', position_ko: '배우', position_en: 'Actor', position_zh: '演员',
    photo_url: null, bio_ko: '중앙대학교 연극학과 졸업. 신인상 수상 경력. 감정 표현에 강점을 가진 배우.', bio_en: 'Chung-Ang University Theatre. Winner of Best New Actor award.', bio_zh: '中央大学戏剧系毕业。新人奖获得者。',
    sort_order: 3, is_active: true,
  },
  {
    id: 'p4', name_ko: '최예진', name_en: 'Yejin Choi', name_zh: '崔艺真',
    role: 'actor', position_ko: '배우', position_en: 'Actor', position_zh: '演员',
    photo_url: null, bio_ko: '동국대학교 연극학부 졸업. 섬세한 연기로 관객의 호평을 받고 있는 배우.', bio_en: 'Dongguk University. Known for nuanced and sensitive performances.', bio_zh: '东国大学戏剧系毕业。以细腻的演技获得观众好评。',
    sort_order: 4, is_active: true,
  },
  {
    id: 'p5', name_ko: '정하늘', name_en: 'Haneul Jeong', name_zh: '郑河天',
    role: 'staff', position_ko: '연출', position_en: 'Director', position_zh: '导演',
    photo_url: null, bio_ko: '나비아트홀 상임 연출. 실험적이면서도 관객 친화적인 연출 스타일.', bio_en: 'Resident director of Nabiart Hall. Known for experimental yet audience-friendly direction.', bio_zh: '蝴蝶艺术厅常驻导演。以实验性但观众友好的导演风格著称。',
    sort_order: 5, is_active: true,
  },
  {
    id: 'p6', name_ko: '윤지원', name_en: 'Jiwon Yoon', name_zh: '尹智媛',
    role: 'staff', position_ko: '무대디자인', position_en: 'Stage Designer', position_zh: '舞台设计',
    photo_url: null, bio_ko: '홍익대학교 무대디자인학과 졸업. 공간을 재해석하는 독창적인 무대 디자이너.', bio_en: 'Hongik University Stage Design. Creates innovative spatial reinterpretations.', bio_zh: '弘益大学舞台设计系毕业。以独创性的空间重新诠释著称。',
    sort_order: 6, is_active: true,
  },
  {
    id: 'p7', name_ko: '한승우', name_en: 'Seungwoo Han', name_zh: '韩胜宇',
    role: 'staff', position_ko: '조명디자인', position_en: 'Lighting Designer', position_zh: '灯光设计',
    photo_url: null, bio_ko: '10년 이상의 조명 경력. 빛과 그림자로 무대의 감정을 표현하는 조명 디자이너.', bio_en: 'Over 10 years of lighting experience. Expresses emotion through light and shadow.', bio_zh: '拥有10年以上的灯光经验。用光影表达舞台情感。',
    sort_order: 7, is_active: true,
  },
  {
    id: 'p8', name_ko: '강소희', name_en: 'Sohee Kang', name_zh: '姜素熙',
    role: 'staff', position_ko: '기획/프로듀서', position_en: 'Producer', position_zh: '制作人',
    photo_url: null, bio_ko: '나비아트홀 공연 기획 총괄. 관객과 예술을 잇는 다리 역할을 담당.', bio_en: 'Head of production at Nabiart Hall. Bridges the gap between audience and art.', bio_zh: '蝴蝶艺术厅演出企划总负责。担任观众与艺术之间的桥梁角色。',
    sort_order: 8, is_active: true,
  },
];

const FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'actor', label: '배우' },
  { value: 'staff', label: '스텝' },
];

export function PeoplePageClient({ serverPeople }: { serverPeople: PersonRow[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const [filter, setFilter] = useState('all');

  const people = serverPeople.length > 0 ? serverPeople : MOCK_PEOPLE;

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
