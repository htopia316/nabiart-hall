'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Badge, Button, Input, Drawer, Select } from '@sunghoon_lee/akron-ui';
import { createClient } from '@/lib/supabase/client';
import { createShow, updateShow, deleteShow, type ShowInput } from '@/lib/supabase/mutations/shows';
import { uploadImage } from '@/lib/supabase/storage';

interface Show {
  id: string;
  title_ko: string;
  status: string;
  venue: string;
  start_date: string;
  end_date: string;
  poster_url: string | null;
  duration_minutes: number | null;
  age_rating: string | null;
  is_featured: boolean;
}

interface ScheduleRow {
  id?: string;
  show_date: string;
  show_time: string;
  total_seats: number;
  is_new?: boolean;
}

const statusColors: Record<string, 'success' | 'warning' | 'neutral'> = {
  running: 'success', upcoming: 'warning', ended: 'neutral',
};
const statusLabels: Record<string, string> = {
  running: '상영중', upcoming: '예정', ended: '종료',
};
const statusOptions = [
  { value: 'upcoming', label: '예정' },
  { value: 'running', label: '상영중' },
  { value: 'ended', label: '종료' },
];
const venueOptions = [
  { value: '나비아트홀', label: '나비아트홀' },
  { value: '나비아트홀 대극장', label: '나비아트홀 대극장' },
  { value: '나비아트홀 소극장', label: '나비아트홀 소극장' },
];
const ageOptions = [
  { value: 'none', label: '선택 안함' },
  { value: '전체 관람가', label: '전체 관람가' },
  { value: '7세 이상', label: '7세 이상' },
  { value: '12세 이상', label: '12세 이상' },
  { value: '15세 이상', label: '15세 이상' },
  { value: '19세 이상', label: '19세 이상' },
];
const durationOptions = [
  { value: 'none', label: '선택 안함' },
  { value: '60', label: '60분 (1시간)' },
  { value: '90', label: '90분 (1시간 30분)' },
  { value: '100', label: '100분' },
  { value: '120', label: '120분 (2시간)' },
  { value: '150', label: '150분 (2시간 30분)' },
  { value: '180', label: '180분 (3시간)' },
];
const timeSlots = [
  '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '19:30', '20:00',
];

const emptyForm = {
  title_ko: '',
  status: 'upcoming',
  venue: '나비아트홀',
  start_date: '',
  end_date: '',
  poster_url: '',
  description_ko: '',
  duration_minutes: 'none',
  age_rating: 'none',
  is_featured: false,
};

export default function AdminShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Show | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dateError, setDateError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchShows = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('shows')
      .select('id, title_ko, status, venue, start_date, end_date, poster_url, duration_minutes, age_rating, is_featured')
      .order('start_date', { ascending: false });
    setShows((data || []) as Show[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchShows(); }, [fetchShows]);

  const filtered = shows.filter((s) => s.title_ko.includes(search));

  const validateDates = (start: string, end: string) => {
    if (start && end && start > end) {
      setDateError('시작일이 종료일보다 늦을 수 없습니다.');
      return false;
    }
    setDateError('');
    return true;
  };

  const openCreate = () => {
    setEditingShow(null);
    setForm(emptyForm);
    setSchedules([]);
    setDateError('');
    setDrawerOpen(true);
  };

  const openEdit = async (show: Show) => {
    setEditingShow(show);
    setForm({
      title_ko: show.title_ko,
      status: show.status,
      venue: show.venue,
      start_date: show.start_date,
      end_date: show.end_date,
      poster_url: show.poster_url || '',
      description_ko: '',
      duration_minutes: show.duration_minutes ? String(show.duration_minutes) : 'none',
      age_rating: show.age_rating || 'none',
      is_featured: show.is_featured,
    });
    setDateError('');

    const supabase = createClient();
    const [descRes, schedRes] = await Promise.all([
      supabase.from('shows').select('description_ko').eq('id', show.id).single(),
      supabase.from('schedules').select('id, show_date, show_time, total_seats').eq('show_id', show.id).order('show_date').order('show_time'),
    ]);
    if (descRes.data) setForm(prev => ({ ...prev, description_ko: descRes.data.description_ko || '' }));
    setSchedules((schedRes.data || []) as ScheduleRow[]);
    setDrawerOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('이미지 파일만 업로드 가능합니다.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('파일 크기는 5MB 이하여야 합니다.'); return; }

    setUploading(true);
    try {
      const url = await uploadImage('posters', file, 'shows');
      setForm(prev => ({ ...prev, poster_url: url }));
    } catch (err) {
      alert('이미지 업로드 실패: ' + (err as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addSchedule = () => {
    setSchedules(prev => [...prev, {
      show_date: form.start_date || '',
      show_time: '19:00',
      total_seats: 100,
      is_new: true,
    }]);
  };

  const updateSchedule = (index: number, field: keyof ScheduleRow, value: string | number) => {
    setSchedules(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const removeSchedule = (index: number) => {
    setSchedules(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!form.title_ko || !form.start_date || !form.end_date) return;
    if (!validateDates(form.start_date, form.end_date)) return;

    setSaving(true);
    try {
      const input: ShowInput = {
        title_ko: form.title_ko,
        status: form.status as ShowInput['status'],
        venue: form.venue,
        start_date: form.start_date,
        end_date: form.end_date,
        poster_url: form.poster_url || undefined,
        description_ko: form.description_ko || undefined,
      };
      const extra: Record<string, unknown> = {};
      if (form.duration_minutes !== 'none') extra.duration_minutes = Number(form.duration_minutes);
      if (form.age_rating !== 'none') extra.age_rating = form.age_rating;
      extra.is_featured = form.is_featured;

      const supabase = createClient();
      let showId: string;

      if (editingShow) {
        await updateShow(editingShow.id, { ...input, ...extra });
        showId = editingShow.id;
        await supabase.from('schedules').delete().eq('show_id', showId);
      } else {
        const created = await createShow({ ...input, ...extra } as ShowInput);
        showId = created.id;
      }

      if (schedules.length > 0) {
        const rows = schedules.map(s => ({
          show_id: showId,
          show_date: s.show_date,
          show_time: s.show_time,
          total_seats: s.total_seats,
          available_seats: s.total_seats,
        }));
        await supabase.from('schedules').insert(rows);
      }

      setDrawerOpen(false);
      await fetchShows();
    } catch (e) {
      alert('저장 실패: ' + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deleteShow(deleteTarget.id);
      setDeleteTarget(null);
      await fetchShows();
    } catch (e) {
      alert('삭제 실패: ' + (e as Error).message);
    } finally {
      setSaving(false);
    }
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

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">로딩 중...</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium w-12"></th>
                <th className="px-4 py-3 font-medium">공연명</th>
                <th className="px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 font-medium">기간</th>
                <th className="px-4 py-3 font-medium">장소</th>
                <th className="px-4 py-3 font-medium text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((show) => (
                <tr key={show.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    {show.poster_url ? (
                      <div className="relative h-10 w-8 overflow-hidden rounded">
                        <Image src={show.poster_url} alt="" fill className="object-cover" sizes="32px" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-8 items-center justify-center rounded bg-muted text-sm">🎭</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{show.title_ko}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {show.is_featured && <Badge variant="subtle" color="primary" size="sm">추천</Badge>}
                      {show.age_rating && <span className="text-xs text-muted-foreground">{show.age_rating}</span>}
                      {show.duration_minutes && <span className="text-xs text-muted-foreground">{show.duration_minutes}분</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="subtle" color={statusColors[show.status] || 'neutral'} size="sm">
                      {statusLabels[show.status] || show.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{show.start_date} ~ {show.end_date}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{show.venue}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(show)}>수정</Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(show)}>삭제</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                  {shows.length === 0 ? '등록된 공연이 없습니다. 공연을 등록해주세요.' : '검색 결과가 없습니다.'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 등록/수정 Drawer */}
      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        placement="right"
        size="md"
        title={editingShow ? '공연 수정' : '공연 등록'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="md" onClick={() => setDrawerOpen(false)}>취소</Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={!form.title_ko || !form.start_date || !form.end_date || !!dateError || saving || uploading}
            >
              {saving ? '저장 중...' : editingShow ? '수정' : '등록'}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* ── 기본 정보 ── */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">기본 정보</h3>
            <div className="space-y-4">
              {/* 포스터 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">대표 이미지 (포스터)</label>
                <div className="flex items-start gap-4">
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                    {form.poster_url ? (
                      <Image src={form.poster_url} alt="포스터" fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl text-muted-foreground">🎭</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                      {uploading ? '업로드 중...' : '이미지 선택'}
                    </Button>
                    {form.poster_url && (
                      <Button variant="ghost" size="sm" onClick={() => setForm(prev => ({ ...prev, poster_url: '' }))} className="text-red-500">삭제</Button>
                    )}
                    <p className="text-xs text-muted-foreground">5MB 이하 · JPG, PNG, WebP</p>
                  </div>
                </div>
              </div>

              <Input
                label="공연명"
                value={form.title_ko}
                onChange={(e) => setForm({ ...form, title_ko: e.target.value })}
                placeholder="공연 제목을 입력하세요"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Select label="상태" options={statusOptions} value={form.status} onValueChange={(v) => setForm({ ...form, status: v })} />
                <Select label="장소" options={venueOptions} value={form.venue} onValueChange={(v) => setForm({ ...form, venue: v })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select label="관람등급" options={ageOptions} value={form.age_rating} onValueChange={(v) => setForm({ ...form, age_rating: v })} />
                <Select label="러닝타임" options={durationOptions} value={form.duration_minutes} onValueChange={(v) => setForm({ ...form, duration_minutes: v })} />
              </div>

              <label className="flex items-center gap-2.5 rounded-lg border border-border px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <div>
                  <span className="text-sm font-medium">메인 추천 공연</span>
                  <p className="text-xs text-muted-foreground">홈 히어로 배너에 표시됩니다</p>
                </div>
              </label>
            </div>
          </section>

          {/* ── 공연 기간 ── */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">공연 기간</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">시작일 <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={form.start_date}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm(prev => ({ ...prev, start_date: v }));
                      validateDates(v, form.end_date);
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">종료일 <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={form.end_date}
                    min={form.start_date || undefined}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm(prev => ({ ...prev, end_date: v }));
                      validateDates(form.start_date, v);
                    }}
                    required
                  />
                </div>
              </div>
              {dateError && <p className="text-sm text-red-500">{dateError}</p>}
            </div>
          </section>

          {/* ── 회차 (스케줄) ── */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">회차 관리</h3>
              <Button variant="outline" size="sm" onClick={addSchedule}>+ 회차 추가</Button>
            </div>

            {schedules.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-8 text-center">
                <p className="text-sm text-muted-foreground">등록된 회차가 없습니다</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={addSchedule}>첫 회차 추가하기</Button>
              </div>
            ) : (
              <div className="space-y-2">
                {schedules.map((sched, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl border border-border p-3">
                    <span className="shrink-0 text-xs font-semibold text-muted-foreground w-8">{i + 1}회</span>
                    <input
                      type="date"
                      className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      value={sched.show_date}
                      min={form.start_date || undefined}
                      max={form.end_date || undefined}
                      onChange={(e) => updateSchedule(i, 'show_date', e.target.value)}
                    />
                    <select
                      className="rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      value={sched.show_time}
                      onChange={(e) => updateSchedule(i, 'show_time', e.target.value)}
                    >
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        className="w-16 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
                        value={sched.total_seats}
                        min={1}
                        onChange={(e) => updateSchedule(i, 'total_seats', Number(e.target.value))}
                      />
                      <span className="text-xs text-muted-foreground shrink-0">석</span>
                    </div>
                    <button
                      onClick={() => removeSchedule(i)}
                      className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── 상세 정보 ── */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">상세 정보 <span className="font-normal normal-case">(선택)</span></h3>
            <textarea
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
              rows={5}
              value={form.description_ko}
              onChange={(e) => setForm({ ...form, description_ko: e.target.value })}
              placeholder="공연 줄거리, 출연진 소개 등 상세 정보를 입력하세요"
            />
          </section>
        </div>
      </Drawer>

      {/* 삭제 확인 */}
      <Drawer
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        placement="bottom"
        size="sm"
        title="공연 삭제"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="md" onClick={() => setDeleteTarget(null)}>취소</Button>
            <Button variant="primary" size="md" onClick={handleDelete} disabled={saving} className="bg-red-600 hover:bg-red-700">
              {saving ? '삭제 중...' : '삭제'}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">
          &ldquo;{deleteTarget?.title_ko}&rdquo; 공연을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
      </Drawer>
    </div>
  );
}
