'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ShowRow } from '@/types/show';
import { ShowGrid } from '@/components/features/shows/ShowGrid';
import { ShowStatusFilter } from '@/components/features/shows/ShowStatusFilter';

type Status = 'all' | 'running' | 'upcoming' | 'ended';

// Mock data for when DB is empty
const MOCK_SHOWS: ShowRow[] = [
  {
    id: '1',
    title_ko: '햄릿',
    title_en: 'Hamlet',
    title_zh: '哈姆雷特',
    description_ko: '셰익스피어의 4대 비극 중 하나인 햄릿을 나비아트홀만의 감성으로 재해석한 작품입니다.',
    description_en: 'A reinterpretation of Shakespeare\'s Hamlet with Nabiart Hall\'s unique sensibility.',
    description_zh: '以蝴蝶艺术厅独特的感性重新诠释莎士比亚四大悲剧之一的哈姆雷特。',
    poster_url: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&h=560&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=1600&h=700&fit=crop',
    start_date: '2026-05-01',
    end_date: '2026-06-30',
    venue: '나비아트홀 대극장',
    duration_minutes: 150,
    age_rating: '15세 이상',
    status: 'running',
    is_featured: true,
    created_at: '2026-04-01T00:00:00Z',
  },
  {
    id: '2',
    title_ko: '벚꽃동산',
    title_en: 'The Cherry Orchard',
    title_zh: '樱桃园',
    description_ko: '체호프의 마지막 희곡. 변화하는 시대 속 인간 군상을 따뜻한 시선으로 그려냅니다.',
    description_en: 'Chekhov\'s last play. A warm portrayal of human nature in changing times.',
    description_zh: '契诃夫的最后一部戏剧。以温暖的视角描绘变革时代中的人生百态。',
    poster_url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=400&h=560&fit=crop',
    banner_url: null,
    start_date: '2026-06-15',
    end_date: '2026-07-20',
    venue: '나비아트홀 소극장',
    duration_minutes: 120,
    age_rating: '전체 관람가',
    status: 'upcoming',
    is_featured: true,
    created_at: '2026-04-15T00:00:00Z',
  },
  {
    id: '3',
    title_ko: '고도를 기다리며',
    title_en: 'Waiting for Godot',
    title_zh: '等待戈多',
    description_ko: '사무엘 베케트의 부조리극의 걸작. 기다림의 의미를 되묻는 작품.',
    description_en: 'Samuel Beckett\'s masterpiece of absurdist theatre.',
    description_zh: '塞缪尔·贝克特的荒诞派戏剧杰作。',
    poster_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=560&fit=crop',
    banner_url: null,
    start_date: '2026-05-10',
    end_date: '2026-06-15',
    venue: '나비아트홀 대극장',
    duration_minutes: 130,
    age_rating: '12세 이상',
    status: 'running',
    is_featured: false,
    created_at: '2026-03-20T00:00:00Z',
  },
  {
    id: '4',
    title_ko: '인형의 집',
    title_en: 'A Doll\'s House',
    title_zh: '玩偶之家',
    description_ko: '입센의 대표작. 자유와 자아를 찾아가는 노라의 이야기.',
    description_en: 'Ibsen\'s masterpiece. Nora\'s journey to find freedom and self.',
    description_zh: '易卜生的代表作。娜拉寻找自由与自我的故事。',
    poster_url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=560&fit=crop',
    banner_url: null,
    start_date: '2026-03-01',
    end_date: '2026-04-15',
    venue: '나비아트홀 소극장',
    duration_minutes: 110,
    age_rating: '전체 관람가',
    status: 'ended',
    is_featured: false,
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: '5',
    title_ko: '맥베스',
    title_en: 'Macbeth',
    title_zh: '麦克白',
    description_ko: '셰익스피어의 비극. 권력과 욕망이 만들어낸 파멸의 서사.',
    description_en: 'Shakespeare\'s tragedy of power and ambition.',
    description_zh: '莎士比亚的悲剧。权力与欲望造就的毁灭叙事。',
    poster_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=560&fit=crop',
    banner_url: null,
    start_date: '2026-01-10',
    end_date: '2026-02-20',
    venue: '나비아트홀 대극장',
    duration_minutes: 140,
    age_rating: '15세 이상',
    status: 'ended',
    is_featured: false,
    created_at: '2025-12-01T00:00:00Z',
  },
];

export function ShowsPageClient({ shows }: { shows: ShowRow[] }) {
  const t = useTranslations();
  const [status, setStatus] = useState<Status>('all');

  const displayShows = shows.length > 0 ? shows : MOCK_SHOWS;

  const filtered = status === 'all'
    ? displayShows
    : displayShows.filter((s) => s.status === status);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('common.shows')}
        </h1>
      </div>

      <div className="mb-8">
        <ShowStatusFilter value={status} onChange={setStatus} />
      </div>

      <ShowGrid shows={filtered} />
    </div>
  );
}
