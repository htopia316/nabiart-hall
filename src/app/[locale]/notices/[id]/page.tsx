import { NoticeDetailClient } from './NoticeDetailClient';

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NoticeDetailClient noticeId={id} serverNotice={null} />;
}
