'use client';

import { useState } from 'react';
import { Badge, Button, Input } from '@sunghoon_lee/akron-ui';

const MOCK_BOOKINGS = [
  { id: 'NB1234', name: '홍길동', show: '햄릿', schedule: '2026-06-01 14:00', seats: 'A5, A6', amount: 160000, status: 'confirmed', date: '2026-05-24' },
  { id: 'NB1233', name: '김철수', show: '햄릿', schedule: '2026-06-01 19:00', seats: 'C3', amount: 60000, status: 'confirmed', date: '2026-05-24' },
  { id: 'NB1232', name: '이영희', show: '벚꽃동산', schedule: '2026-06-14 14:00', seats: 'B2, B3', amount: 160000, status: 'confirmed', date: '2026-05-23' },
  { id: 'NB1231', name: '박민수', show: '햄릿', schedule: '2026-06-01 14:00', seats: 'F8', amount: 40000, status: 'cancelled', date: '2026-05-23' },
  { id: 'NB1230', name: '최서연', show: '벚꽃동산', schedule: '2026-06-14 19:00', seats: 'D5, D6, D7', amount: 180000, status: 'confirmed', date: '2026-05-22' },
  { id: 'NB1229', name: '정준호', show: '햄릿', schedule: '2026-06-02 14:00', seats: 'A1, A2', amount: 160000, status: 'pending', date: '2026-05-22' },
];

const statusColors: Record<string, 'success' | 'warning' | 'error'> = {
  confirmed: 'success', pending: 'warning', cancelled: 'error',
};
const statusLabels: Record<string, string> = {
  confirmed: '확정', pending: '대기', cancelled: '취소',
};

export default function AdminBookingsPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_BOOKINGS.filter((b) =>
    b.id.includes(search) || b.name.includes(search) || b.show.includes(search)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">예매 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">전체 예매 {MOCK_BOOKINGS.length}건</p>
      </div>

      <div className="mb-4">
        <Input placeholder="예매번호, 이름, 공연명 검색..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">예매번호</th>
              <th className="px-4 py-3 font-medium">예매자</th>
              <th className="px-4 py-3 font-medium">공연</th>
              <th className="px-4 py-3 font-medium">일정</th>
              <th className="px-4 py-3 font-medium">좌석</th>
              <th className="px-4 py-3 font-medium text-right">금액</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{b.id}</td>
                <td className="px-4 py-3">{b.name}</td>
                <td className="px-4 py-3">{b.show}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{b.schedule}</td>
                <td className="px-4 py-3">{b.seats}</td>
                <td className="px-4 py-3 text-right">₩{b.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Badge variant="subtle" color={statusColors[b.status]} size="sm">
                    {statusLabels[b.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {b.status !== 'cancelled' && (
                    <Button variant="ghost" size="sm">취소</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
