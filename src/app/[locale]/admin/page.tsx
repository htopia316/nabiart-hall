'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

interface Stats {
  bookingCount: number;
  bookingRevenue: number;
  donationTotal: number;
  rentalCount: number;
}

interface RecentBooking {
  id: string;
  booking_number: string;
  booker_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ bookingCount: 0, bookingRevenue: 0, donationTotal: 0, rentalCount: 0 });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    Promise.all([
      supabase.from('bookings').select('id, total_amount, status').eq('status', 'confirmed'),
      supabase.from('donations').select('id, amount'),
      supabase.from('rental_inquiries').select('id').eq('status', 'pending'),
      supabase.from('bookings').select('id, booking_number, booker_name, total_amount, status, created_at').order('created_at', { ascending: false }).limit(5),
    ]).then(([bookingsRes, donationsRes, rentalsRes, recentRes]) => {
      const bookings = bookingsRes.data || [];
      const donations = donationsRes.data || [];
      const rentals = rentalsRes.data || [];

      setStats({
        bookingCount: bookings.length,
        bookingRevenue: bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0),
        donationTotal: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
        rentalCount: rentals.length,
      });
      setRecentBookings((recentRes.data || []) as RecentBooking[]);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: '예매 건수', value: `${stats.bookingCount}건`, icon: '🎟️' },
    { label: '예매 매출', value: `₩${stats.bookingRevenue.toLocaleString()}`, icon: '💰' },
    { label: '후원 총액', value: `₩${stats.donationTotal.toLocaleString()}`, icon: '💝' },
    { label: '대관 문의', value: `${stats.rentalCount}건`, icon: '🏛️' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">대시보드</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border p-5">
            <span className="text-2xl">{s.icon}</span>
            <p className="mt-3 text-2xl font-bold">{loading ? '...' : s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold">최근 예매</h2>
          <Link href="/admin/bookings" className="text-sm text-primary hover:underline">전체 보기 →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 font-medium">예매번호</th>
                <th className="px-5 py-3 font-medium">예매자</th>
                <th className="px-5 py-3 font-medium">날짜</th>
                <th className="px-5 py-3 font-medium text-right">금액</th>
                <th className="px-5 py-3 font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">로딩 중...</td></tr>
              ) : recentBookings.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">예매 데이터가 없습니다.</td></tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-mono text-xs">{b.booking_number}</td>
                    <td className="px-5 py-3">{b.booker_name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{b.created_at?.slice(0, 10)}</td>
                    <td className="px-5 py-3 text-right font-medium">₩{(b.total_amount || 0).toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <Badge
                        variant="subtle"
                        color={b.status === 'confirmed' ? 'success' : b.status === 'pending' ? 'warning' : 'error'}
                        size="sm"
                      >
                        {b.status === 'confirmed' ? '확정' : b.status === 'pending' ? '대기' : '취소'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
