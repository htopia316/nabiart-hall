import { setRequestLocale } from 'next-intl/server';
import { ShowDetailClient } from './ShowDetailClient';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ShowDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <ShowDetailClient showId={id} />;
}
