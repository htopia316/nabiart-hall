'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';

export function SupportCTA() {
  const t = useTranslations();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-800 px-6 py-16 text-center sm:px-12 sm:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-violet-500 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-violet-400 blur-3xl" />
        </div>
        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {t('landing.supportUs')}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-neutral-300 sm:text-lg">
            {t('landing.supportDescription')}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/support">
              <Button variant="primary" size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
                {t('support.oneTime')}
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                {t('support.recurring')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
