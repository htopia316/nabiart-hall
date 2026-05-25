'use client';

import { Badge } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';

const STATS = [
  { label: '이번 달 예매', value: '127건', change: '+12%', icon: '🎟️' },
  { label: '이번 달 매출', value: '₩8,540,000', change: '+8%', icon: '💰' },
  { label: '이번 달 후원', value: '₩2,350,000', change: '+15%', icon: '💝' },
  { label: '대관 문의', value: '5건', change: '', icon: '🏛️' },
];

const RECENT_BOOKINGS = [
  { id: 'NB1234', show: '햄릿', date: '2026-05-24', seats: 'A5, A6', amount: '₩160,000', status: 'confirmed' },
  { id: 'NB1233', show: '햄릿', date: '2026-05-24', seats: 'C3', amount: '₩60,000', status: 'confirmed' },
  { id: 'NB1232', show: '벚꽃동산', date: '2026-05-23', seats: 'B2, B3', amount: '₩160,000', status: 'confirmed' },
  { id: 'NB1231', show: '햄릿', date: '2026-05-23', seats: 'F8', amount: '₩40,000', status: 'cancelled' },
  { id: 'NB1230', show: '벚꽃동산', date: '2026-05-22', seats: 'D5, D6, D7', amount: '₩180,000', status: 'confirmed' },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">대시보드</h1>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{s.icon}</span>
              {s.change && (
                <Badge variant="subtle" color="success" size="sm">{s.change}</Badge>
              )}
            </div>
            <p className="mt-3 text-2xl font-bold">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
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
                <th className="px-5 py-3 font-medium">공연</th>
                <th className="px-5 py-3 font-medium">날짜</th>
                <th className="px-5 py-3 font-medium">좌석</th>
                <th className="px-5 py-3 font-medium text-right">금액</th>
                <th className="px-5 py-3 font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_BOOKINGS.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-mono text-xs">{b.id}</td>
                  <td className="px-5 py-3">{b.show}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.date}</td>
                  <td className="px-5 py-3">{b.seats}</td>
                  <td className="px-5 py-3 text-right font-medium">{b.amount}</td>
                  <td className="px-5 py-3">
                    <Badge
                      variant="subtle"
                      color={b.status === 'confirmed' ? 'success' : 'error'}
                      size="sm"
                    >
                      {b.status === 'confirmed' ? '확정' : '취소'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
