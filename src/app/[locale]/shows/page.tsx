import { setRequestLocale } from 'next-intl/server';
import { ShowsPageClient } from './ShowsPageClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ShowsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // DB에서 가져오기 시도, 실패 시 클라이언트에서 mock 사용
  let shows: unknown[] = [];
  try {
    const { getShows } = await import('@/lib/supabase/queries/shows');
    shows = await getShows();
  } catch {
    shows = [];
  }

  return <ShowsPageClient shows={shows as never[]} />;
}
