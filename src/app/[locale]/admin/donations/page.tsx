'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@sunghoon_lee/akron-ui';
import { createClient } from '@/lib/supabase/client';

interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  type: string;
  message: string | null;
  created_at: string;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('donations')
      .select('id, donor_name, amount, type, message, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setDonations((data || []) as Donation[]);
        setLoading(false);
      });
  }, []);

  const totalRecurring = donations.filter((d) => d.type === 'recurring').reduce((sum, d) => sum + d.amount, 0);
  const totalOneTime = donations.filter((d) => d.type === 'one-time').reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">후원 관리</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border p-5">
          <p className="text-sm text-muted-foreground">정기후원 총액</p>
          <p className="mt-1 text-2xl font-bold">{loading ? '...' : `₩${totalRecurring.toLocaleString()}`}</p>
        </div>
        <div className="rounded-2xl border border-border p-5">
          <p className="text-sm text-muted-foreground">일시후원 총액</p>
          <p className="mt-1 text-2xl font-bold">{loading ? '...' : `₩${totalOneTime.toLocaleString()}`}</p>
        </div>
        <div className="rounded-2xl border border-border p-5">
          <p className="text-sm text-muted-foreground">총 후원자 수</p>
          <p className="mt-1 text-2xl font-bold">{loading ? '...' : `${donations.length}명`}</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">로딩 중...</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-5 py-3 font-medium">후원자</th>
                <th className="px-5 py-3 font-medium">유형</th>
                <th className="px-5 py-3 font-medium text-right">금액</th>
                <th className="px-5 py-3 font-medium">메시지</th>
                <th className="px-5 py-3 font-medium">날짜</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">{d.donor_name}</td>
                  <td className="px-5 py-3">
                    <Badge variant="subtle" color={d.type === 'recurring' ? 'primary' : 'neutral'} size="sm">
                      {d.type === 'recurring' ? '정기' : '일시'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right font-medium">₩{d.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.message || '-'}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.created_at?.slice(0, 10)}</td>
                </tr>
              ))}
              {donations.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">후원 데이터가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
