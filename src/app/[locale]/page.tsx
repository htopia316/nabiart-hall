import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/features/landing/HeroSection';
import { NowPlayingSection } from '@/components/features/landing/NowPlayingSection';
import { NoticesPreview } from '@/components/features/landing/NoticesPreview';
import { SupportCTA } from '@/components/features/landing/SupportCTA';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <NowPlayingSection />
      <NoticesPreview />
      <SupportCTA />
    </>
  );
}
