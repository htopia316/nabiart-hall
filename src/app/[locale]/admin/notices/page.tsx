'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge, Button, Input, Drawer } from '@sunghoon_lee/akron-ui';
import { createClient } from '@/lib/supabase/client';
import { createNotice, updateNotice, deleteNotice, type NoticeInput } from '@/lib/supabase/mutations/notices';

interface Notice {
  id: string;
  title_ko: string;
  content_ko: string | null;
  is_pinned: boolean;
  created_at: string;
}

const emptyForm = { title_ko: '', content_ko: '', is_pinned: false };

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchNotices = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('notices')
      .select('id, title_ko, content_ko, is_pinned, created_at')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });
    setNotices((data || []) as Notice[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  const filtered = notices.filter((n) => n.title_ko.includes(search));

  const openCreate = () => {
    setEditingNotice(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  };

  const openEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setForm({
      title_ko: notice.title_ko,
      content_ko: notice.content_ko || '',
      is_pinned: notice.is_pinned,
    });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.title_ko) return;
    setSaving(true);
    try {
      const input: NoticeInput = {
        title_ko: form.title_ko,
        content_ko: form.content_ko,
        is_pinned: form.is_pinned,
      };
      if (editingNotice) {
        await updateNotice(editingNotice.id, input);
      } else {
        await createNotice(input);
      }
      setDrawerOpen(false);
      await fetchNotices();
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
      await deleteNotice(deleteTarget.id);
      setDeleteTarget(null);
      await fetchNotices();
    } catch (e) {
      alert('삭제 실패: ' + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <Button variant="primary" size="md" onClick={openCreate}>+ 공지 작성</Button>
      </div>

      <div className="mb-4">
        <Input placeholder="제목 검색..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">로딩 중...</div>
      ) : (
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
                  <td className="px-5 py-3 font-medium">{n.title_ko}</td>
                  <td className="px-5 py-3">
                    {n.is_pinned && <Badge variant="subtle" color="warning" size="sm">고정</Badge>}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{n.created_at?.slice(0, 10)}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(n)}>수정</Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(n)}>삭제</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                  {notices.length === 0 ? '등록된 공지사항이 없습니다.' : '검색 결과가 없습니다.'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        placement="right"
        size="md"
        title={editingNotice ? '공지사항 수정' : '공지사항 작성'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="md" onClick={() => setDrawerOpen(false)}>취소</Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={!form.title_ko || saving}
            >
              {saving ? '저장 중...' : editingNotice ? '수정' : '등록'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="제목"
            value={form.title_ko}
            onChange={(e) => setForm({ ...form, title_ko: e.target.value })}
            placeholder="공지사항 제목을 입력하세요"
            required
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium">내용</label>
            <textarea
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={8}
              value={form.content_ko}
              onChange={(e) => setForm({ ...form, content_ko: e.target.value })}
              placeholder="공지사항 내용을 입력하세요"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_pinned}
              onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
              className="rounded border-border"
            />
            상단 고정
          </label>
        </div>
      </Drawer>

      <Drawer
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        placement="bottom"
        size="sm"
        title="공지사항 삭제"
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
          &ldquo;{deleteTarget?.title_ko}&rdquo; 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
      </Drawer>
    </div>
  );
}
