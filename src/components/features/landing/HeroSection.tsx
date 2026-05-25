'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Carousel, Button } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

const FALLBACK_SLIDES = [
  { id: 'f1', image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=1600&h=700&fit=crop' },
  { id: 'f2', image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1600&h=700&fit=crop' },
  { id: 'f3', image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1600&h=700&fit=crop' },
];

interface Show {
  id: string;
  title_ko: string;
  banner_url: string | null;
  poster_url: string | null;
}

export function HeroSection() {
  const t = useTranslations();
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('shows')
      .select('id, title_ko, banner_url, poster_url')
      .in('status', ['running', 'upcoming'])
      .order('start_date', { ascending: true })
      .limit(3)
      .then(({ data }) => {
        if (data) setShows(data as Show[]);
      });
  }, []);

  const slides = shows.length > 0
    ? shows.map((s) => ({
        id: s.id,
        image: s.banner_url || s.poster_url || FALLBACK_SLIDES[0].image,
      }))
    : FALLBACK_SLIDES;

  return (
    <section className="relative">
      <Carousel autoPlay={5000} loop showIndicators showArrows={false}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-[60vh] min-h-[400px] w-full lg:h-[70vh]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
              <h1 className="whitespace-pre-line text-center text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {t('landing.heroTitle')}
              </h1>
              <p className="mt-4 text-center text-base text-white/80 sm:text-lg">
                {t('landing.heroSubtitle')}
              </p>
              <div className="mt-8 flex gap-3">
                <Link href="/shows">
                  <Button variant="primary" size="lg">
                    {t('shows.current')}
                  </Button>
                </Link>
                <Link href="/booking">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    {t('shows.bookNow')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
}
