'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge, Button, Drawer } from '@sunghoon_lee/akron-ui';
import { createClient } from '@/lib/supabase/client';

interface RentalInquiry {
  id: string;
  name: string;
  organization: string | null;
  purpose: string;
  desired_date: string;
  phone: string;
  email: string | null;
  status: string;
  created_at: string;
  message: string | null;
}

const statusColors: Record<string, 'warning' | 'primary' | 'success' | 'error'> = {
  pending: 'warning', reviewed: 'primary', confirmed: 'success', rejected: 'error',
};
const statusLabels: Record<string, string> = {
  pending: '대기', reviewed: '검토중', confirmed: '확정', rejected: '거절',
};

export default function AdminRentalsPage() {
  const [inquiries, setInquiries] = useState<RentalInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailTarget, setDetailTarget] = useState<RentalInquiry | null>(null);

  const fetchInquiries = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('rental_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    setInquiries((data || []) as RentalInquiry[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient();
    await supabase.from('rental_inquiries').update({ status }).eq('id', id);
    setDetailTarget(null);
    await fetchInquiries();
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">대관 문의 관리</h1>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">로딩 중...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-5 py-3 font-medium">신청자</th>
                <th className="px-5 py-3 font-medium">용도</th>
                <th className="px-5 py-3 font-medium">희망일</th>
                <th className="px-5 py-3 font-medium">연락처</th>
                <th className="px-5 py-3 font-medium">상태</th>
                <th className="px-5 py-3 font-medium">접수일</th>
                <th className="px-5 py-3 font-medium text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">{r.name}</td>
                  <td className="px-5 py-3">{r.purpose}</td>
                  <td className="px-5 py-3">{r.desired_date}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.phone}</td>
                  <td className="px-5 py-3">
                    <Badge variant="subtle" color={statusColors[r.status] || 'neutral'} size="sm">
                      {statusLabels[r.status] || r.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{r.created_at?.slice(0, 10)}</td>
                  <td className="px-5 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setDetailTarget(r)}>상세</Button>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">대관 문의가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Drawer
        open={!!detailTarget}
        onOpenChange={(open) => { if (!open) setDetailTarget(null); }}
        placement="right"
        size="md"
        title="대관 문의 상세"
        footer={
          detailTarget && detailTarget.status === 'pending' ? (
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="md" onClick={() => updateStatus(detailTarget.id, 'rejected')} className="text-red-600">거절</Button>
              <Button variant="primary" size="md" onClick={() => updateStatus(detailTarget.id, 'confirmed')}>확정</Button>
            </div>
          ) : undefined
        }
      >
        {detailTarget && (
          <div className="space-y-3 text-sm">
            <div><span className="font-medium">신청자:</span> {detailTarget.name}</div>
            {detailTarget.organization && <div><span className="font-medium">단체:</span> {detailTarget.organization}</div>}
            <div><span className="font-medium">용도:</span> {detailTarget.purpose}</div>
            <div><span className="font-medium">희망일:</span> {detailTarget.desired_date}</div>
            <div><span className="font-medium">연락처:</span> {detailTarget.phone}</div>
            {detailTarget.email && <div><span className="font-medium">이메일:</span> {detailTarget.email}</div>}
            {detailTarget.message && (
              <div>
                <span className="font-medium">메시지:</span>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{detailTarget.message}</p>
              </div>
            )}
            <div>
              <span className="font-medium">상태:</span>{' '}
              <Badge variant="subtle" color={statusColors[detailTarget.status] || 'neutral'} size="sm">
                {statusLabels[detailTarget.status] || detailTarget.status}
              </Badge>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
