import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/lib/i18n/routing';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ThemeScript } from '@/components/providers/ThemeScript';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Locale } from '@/types';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  const siteName = t('siteName');
  const description = locale === 'ko'
    ? '나비아트홀 - 감동적인 공연과 함께하는 예술의 공간. 공연 정보, 티켓 예매, 극장 대관, 후원 안내.'
    : locale === 'zh'
      ? '蝴蝶艺术厅 - 与感动的演出同行的艺术空间。演出信息、购票、剧场租赁、赞助指南。'
      : 'Nabiart Hall - A space for art with inspiring performances. Shows, tickets, venue rental, and sponsorship.';

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    metadataBase: new URL('https://nabiart.com'),
    openGraph: {
      type: 'website',
      siteName,
      locale: locale === 'ko' ? 'ko_KR' : locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: '/',
      languages: {
        ko: '/ko',
        en: '/en',
        zh: '/zh',
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const langAttr = locale as Locale;

  return (
    <html lang={langAttr} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <div className="flex min-h-dvh flex-col">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
              >
                Skip to content
              </a>
              <SiteHeader />
              <main id="main-content" className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
