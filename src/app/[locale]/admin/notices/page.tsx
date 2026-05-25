'use client';

import { useState } from 'react';
import { Badge, Button, Input } from '@sunghoon_lee/akron-ui';

const MOCK_NOTICES = [
  { id: 'n1', title: '2026년 상반기 공연 일정 안내', isPinned: true, createdAt: '2026-01-15' },
  { id: 'n2', title: '나비아트홀 회원 가입 안내', isPinned: true, createdAt: '2026-01-10' },
  { id: 'n3', title: '《햄릿》 추가 공연 확정', isPinned: false, createdAt: '2026-05-20' },
  { id: 'n4', title: '5월 휴관일 안내', isPinned: false, createdAt: '2026-05-01' },
  { id: 'n5', title: '후원자 감사 이벤트 개최', isPinned: false, createdAt: '2026-04-15' },
  { id: 'n6', title: '대관 요금 개정 안내', isPinned: false, createdAt: '2026-04-01' },
  { id: 'n7', title: '신입 배우 오디션 안내', isPinned: false, createdAt: '2026-03-20' },
];

export default function AdminNoticesPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_NOTICES.filter((n) => n.title.includes(search));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <Button variant="primary" size="md">+ 공지 작성</Button>
      </div>

      <div className="mb-4">
        <Input placeholder="제목 검색..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left">
              <th className="px-5 py-3 font-medium">제목</th>
              <th className="px-5 py-3 font-medium">고정</th>
              <th className="px-5 py-3 font-medium">작성일</th>
              <th className="px-5 py-3 font-medium text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((n) => (
              <tr key={n.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{n.title}</td>
                <td className="px-5 py-3">
                  {n.isPinned && <Badge variant="subtle" color="warning" size="sm">고정</Badge>}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{n.createdAt}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">수정</Button>
                    <Button variant="ghost" size="sm">삭제</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
