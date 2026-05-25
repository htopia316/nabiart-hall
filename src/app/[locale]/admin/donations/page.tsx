'use client';

import { Badge } from '@sunghoon_lee/akron-ui';

const MOCK_DONATIONS = [
  { id: 'd1', name: '김○○', amount: 100000, type: 'recurring', message: '항상 좋은 공연 감사합니다!', date: '2026-05-01' },
  { id: 'd2', name: '이○○', amount: 50000, type: 'recurring', message: '나비아트홀 화이팅!', date: '2026-05-01' },
  { id: 'd3', name: '박○○', amount: 50000, type: 'recurring', message: '', date: '2026-05-01' },
  { id: 'd4', name: '강○○', amount: 100000, type: 'one-time', message: '《햄릿》 감동적이었습니다', date: '2026-05-20' },
  { id: 'd5', name: '서○○', amount: 50000, type: 'one-time', message: '', date: '2026-05-18' },
  { id: 'd6', name: '조○○', amount: 30000, type: 'one-time', message: '앞으로도 좋은 공연 부탁드립니다', date: '2026-05-15' },
  { id: 'd7', name: '최○○', amount: 30000, type: 'recurring', message: '좋은 공연 기대합니다', date: '2026-05-01' },
];

const totalRecurring = MOCK_DONATIONS.filter((d) => d.type === 'recurring').reduce((sum, d) => sum + d.amount, 0);
const totalOneTime = MOCK_DONATIONS.filter((d) => d.type === 'one-time').reduce((sum, d) => sum + d.amount, 0);

export default function AdminDonationsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">후원 관리</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border p-5">
          <p className="text-sm text-muted-foreground">월 정기후원</p>
          <p className="mt-1 text-2xl font-bold">₩{totalRecurring.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border p-5">
          <p className="text-sm text-muted-foreground">이번 달 일시후원</p>
          <p className="mt-1 text-2xl font-bold">₩{totalOneTime.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border p-5">
          <p className="text-sm text-muted-foreground">총 후원자 수</p>
          <p className="mt-1 text-2xl font-bold">{MOCK_DONATIONS.length}명</p>
        </div>
      </div>

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
            {MOCK_DONATIONS.map((d) => (
              <tr key={d.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{d.name}</td>
                <td className="px-5 py-3">
                  <Badge variant="subtle" color={d.type === 'recurring' ? 'primary' : 'neutral'} size="sm">
                    {d.type === 'recurring' ? '정기' : '일시'}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-right font-medium">₩{d.amount.toLocaleString()}</td>
                <td className="px-5 py-3 text-muted-foreground">{d.message || '-'}</td>
                <td className="px-5 py-3 text-muted-foreground">{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
