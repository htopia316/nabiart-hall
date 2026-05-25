'use client';

import { useState } from 'react';
import { Badge, Button, Input, Drawer, Select } from '@sunghoon_lee/akron-ui';

interface Show {
  id: string;
  title: string;
  status: 'running' | 'upcoming' | 'ended';
  venue: string;
  startDate: string;
  endDate: string;
  bookings: number;
}

const INITIAL_SHOWS: Show[] = [
  { id: '1', title: '햄릿', status: 'running', venue: '나비아트홀 대극장', startDate: '2026-06-01', endDate: '2026-06-08', bookings: 45 },
  { id: '2', title: '벚꽃동산', status: 'running', venue: '나비아트홀 소극장', startDate: '2026-06-14', endDate: '2026-06-22', bookings: 32 },
  { id: '3', title: '고도를 기다리며', status: 'upcoming', venue: '나비아트홀 대극장', startDate: '2026-07-04', endDate: '2026-07-12', bookings: 0 },
  { id: '4', title: '인형의 집', status: 'upcoming', venue: '나비아트홀 소극장', startDate: '2026-08-01', endDate: '2026-08-10', bookings: 0 },
  { id: '5', title: '맥베스', status: 'ended', venue: '나비아트홀 대극장', startDate: '2026-03-01', endDate: '2026-03-15', bookings: 78 },
];

const statusColors: Record<string, 'success' | 'warning' | 'neutral'> = {
  running: 'success', upcoming: 'warning', ended: 'neutral',
};
const statusLabels: Record<string, string> = {
  running: '상영중', upcoming: '예정', ended: '종료',
};
const statusOptions = [
  { value: 'running', label: '상영중' },
  { value: 'upcoming', label: '예정' },
  { value: 'ended', label: '종료' },
];

const emptyForm = { title: '', status: 'upcoming' as Show['status'], venue: '', startDate: '', endDate: '' };

export default function AdminShowsPage() {
  const [shows, setShows] = useState<Show[]>(INITIAL_SHOWS);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Show | null>(null);

  const filtered = shows.filter((s) => s.title.includes(search));

  const openCreate = () => {
    setEditingShow(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (show: Show) => {
    setEditingShow(show);
    setForm({ title: show.title, status: show.status, venue: show.venue, startDate: show.startDate, endDate: show.endDate });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title || !form.startDate || !form.endDate) return;
    if (editingShow) {
      setShows(shows.map((s) => s.id === editingShow.id ? { ...s, ...form } : s));
    } else {
      const newShow: Show = {
        id: Date.now().toString(),
        ...form,
        bookings: 0,
      };
      setShows([...shows, newShow]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setShows(shows.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">공연 관리</h1>
        <Button variant="primary" size="md" onClick={openCreate}>+ 공연 등록</Button>
      </div>

      <div className="mb-4">
        <Input placeholder="공연 검색..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left">
              <th className="px-5 py-3 font-medium">공연명</th>
              <th className="px-5 py-3 font-medium">상태</th>
              <th className="px-5 py-3 font-medium">기간</th>
              <th className="px-5 py-3 font-medium">장소</th>
              <th className="px-5 py-3 font-medium text-right">예매 수</th>
              <th className="px-5 py-3 font-medium text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((show) => (
              <tr key={show.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{show.title}</td>
                <td className="px-5 py-3">
                  <Badge variant="subtle" color={statusColors[show.status]} size="sm">
                    {statusLabels[show.status]}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{show.startDate} ~ {show.endDate}</td>
                <td className="px-5 py-3 text-muted-foreground">{show.venue}</td>
                <td className="px-5 py-3 text-right">{show.bookings}건</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(show)}>수정</Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(show)}>삭제</Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">검색 결과가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Drawer
        open={modalOpen}
        onOpenChange={setModalOpen}
        placement="right"
        size="md"
        title={editingShow ? '공연 수정' : '공연 등록'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="md" onClick={() => setModalOpen(false)}>취소</Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={!form.title || !form.startDate || !form.endDate}
            >
              {editingShow ? '수정' : '등록'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="공연명"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="공연 제목을 입력하세요"
            required
          />
          <Select
            label="상태"
            options={statusOptions}
            value={form.status}
            onValueChange={(v) => setForm({ ...form, status: v as Show['status'] })}
          />
          <Input
            label="장소"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            placeholder="나비아트홀 대극장"
          />
          <Input
            label="시작일"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
          />
          <Input
            label="종료일"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            required
          />
        </div>
      </Drawer>

      <Drawer
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        placement="bottom"
        size="sm"
        title="공연 삭제"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="md" onClick={() => setDeleteTarget(null)}>취소</Button>
            <Button variant="primary" size="md" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">삭제</Button>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">
          &ldquo;{deleteTarget?.title}&rdquo; 공연을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
      </Drawer>
    </div>
  );
}
