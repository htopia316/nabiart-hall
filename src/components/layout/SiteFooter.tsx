'use client';

import { useTranslations } from 'next-intl';
import { Footer } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';

export function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <Footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* 극단 정보 */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground">
              {t('common.siteName')}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t('landing.heroSubtitle')}
            </p>
          </div>

          {/* 빠른 링크 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              {t('common.shows')}
            </h4>
            <nav aria-label="Shows and booking" className="flex flex-col gap-2">
              <Link href="/shows" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('shows.current')}
              </Link>
              <Link href="/booking" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('common.booking')}
              </Link>
              <Link href="/booking/lookup" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('booking.lookup')}
              </Link>
              <Link href="/people" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('common.people')}
              </Link>
            </nav>
          </div>

          {/* 안내 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              {t('common.support')}
            </h4>
            <nav aria-label="Support links" className="flex flex-col gap-2">
              <Link href="/rental" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('common.rental')}
              </Link>
              <Link href="/notices" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('common.notices')}
              </Link>
              <Link href="/support" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('support.title')}
              </Link>
            </nav>
          </div>

          {/* 연락처 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              {t('footer.phone')}
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>02-XXX-XXXX</p>
              <p>info@nabiarthall.com</p>
            </div>
          </div>
        </div>

        {/* 하단 */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            {t('footer.copyright', { year })}
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              {t('footer.terms')}
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              {t('footer.privacy')}
            </Link>
            <Link href="/admin" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              {t('common.admin')}
            </Link>
          </div>
        </div>
      </div>
    </Footer>
  );
}
