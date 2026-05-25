'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Header, Button, Drawer } from '@sunghoon_lee/akron-ui';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navKeys = [
  { key: 'shows', href: '/shows' },
  { key: 'booking', href: '/booking' },
  { key: 'people', href: '/people' },
  { key: 'rental', href: '/rental' },
  { key: 'notices', href: '/notices' },
  { key: 'support', href: '/support' },
] as const;

export function SiteHeader() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Header
        sticky
        logo={
          <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
            {t('siteName')}
          </Link>
        }
        nav={
          <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
            {navKeys.map(({ key, href }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={key}
                  href={href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-100 text-foreground dark:bg-neutral-800'
                      : 'text-muted-foreground hover:bg-neutral-50 hover:text-foreground dark:hover:bg-neutral-800/50'
                  }`}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>
        }
        actions={
          <div className="flex items-center gap-1">
            <div className="hidden sm:flex sm:items-center sm:gap-1">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="메뉴"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        }
        className="border-b border-border bg-background/80 backdrop-blur-xl"
      />

      <Drawer
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        placement="right"
        size="sm"
        title={t('siteName')}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col gap-1 py-2">
          {navKeys.map(({ key, href }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-neutral-100 text-foreground dark:bg-neutral-800'
                    : 'text-muted-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 flex items-center gap-2 border-t border-border px-4 pt-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </Drawer>
    </>
  );
}
