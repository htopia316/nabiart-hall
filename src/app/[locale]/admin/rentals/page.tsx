'use client';

import { Badge, Button } from '@sunghoon_lee/akron-ui';

const MOCK_INQUIRIES = [
  { id: 'r1', name: '서울시민극단', purpose: '연극', desiredDate: '2026-07-20', phone: '02-1234-5678', status: 'pending', createdAt: '2026-05-20' },
  { id: 'r2', name: '한국음악협회', purpose: '음악회', desiredDate: '2026-08-05', phone: '02-9876-5432', status: 'reviewed', createdAt: '2026-05-18' },
  { id: 'r3', name: '(주)문화공간', purpose: '기업 행사', desiredDate: '2026-07-15', phone: '010-1111-2222', status: 'confirmed', createdAt: '2026-05-15' },
  { id: 'r4', name: '대학로극단', purpose: '연극', desiredDate: '2026-09-01', phone: '010-3333-4444', status: 'rejected', createdAt: '2026-05-10' },
];

const statusColors: Record<string, 'warning' | 'primary' | 'success' | 'error'> = {
  pending: 'warning', reviewed: 'primary', confirmed: 'success', rejected: 'error',
};
const statusLabels: Record<string, string> = {
  pending: '대기', reviewed: '검토중', confirmed: '확정', rejected: '거절',
};

export default function AdminRentalsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">대관 문의 관리</h1>

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
            {MOCK_INQUIRIES.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{r.name}</td>
                <td className="px-5 py-3">{r.purpose}</td>
                <td className="px-5 py-3">{r.desiredDate}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.phone}</td>
                <td className="px-5 py-3">
                  <Badge variant="subtle" color={statusColors[r.status]} size="sm">
                    {statusLabels[r.status]}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{r.createdAt}</td>
                <td className="px-5 py-3 text-right">
                  <Button variant="ghost" size="sm">상세</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
