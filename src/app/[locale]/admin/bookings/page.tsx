'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge, Button, Input } from '@sunghoon_lee/akron-ui';
import { createClient } from '@/lib/supabase/client';

interface Booking {
  id: string;
  booking_number: string;
  booker_name: string;
  booker_phone: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const statusColors: Record<string, 'success' | 'warning' | 'error'> = {
  confirmed: 'success', pending: 'warning', cancelled: 'error',
};
const statusLabels: Record<string, string> = {
  confirmed: '확정', pending: '대기', cancelled: '취소',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBookings = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('bookings')
      .select('id, booking_number, booker_name, booker_phone, total_amount, status, created_at')
      .order('created_at', { ascending: false });
    setBookings((data || []) as Booking[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const filtered = bookings.filter((b) =>
    (b.booking_number || '').includes(search) || (b.booker_name || '').includes(search)
  );

  const handleCancel = async (id: string) => {
    const supabase = createClient();
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    await fetchBookings();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">예매 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">전체 예매 {loading ? '...' : `${bookings.length}건`}</p>
      </div>

      <div className="mb-4">
        <Input placeholder="예매번호, 이름 검색..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">로딩 중...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">예매번호</th>
                <th className="px-4 py-3 font-medium">예매자</th>
                <th className="px-4 py-3 font-medium">연락처</th>
                <th className="px-4 py-3 font-medium text-right">금액</th>
                <th className="px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 font-medium">날짜</th>
                <th className="px-4 py-3 font-medium text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{b.booking_number}</td>
                  <td className="px-4 py-3">{b.booker_name}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{b.booker_phone}</td>
                  <td className="px-4 py-3 text-right">₩{(b.total_amount || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge variant="subtle" color={statusColors[b.status] || 'neutral'} size="sm">
                      {statusLabels[b.status] || b.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{b.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-right">
                    {b.status !== 'cancelled' && (
                      <Button variant="ghost" size="sm" onClick={() => handleCancel(b.id)}>취소</Button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  {bookings.length === 0 ? '예매 데이터가 없습니다.' : '검색 결과가 없습니다.'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
