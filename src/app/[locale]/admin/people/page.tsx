'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge, Button, Avatar, Input, Drawer, Select } from '@sunghoon_lee/akron-ui';
import { createClient } from '@/lib/supabase/client';
import { createPerson, updatePerson, deletePerson, type PersonInput } from '@/lib/supabase/mutations/people';

interface Person {
  id: string;
  name_ko: string;
  role: string;
  position_ko: string | null;
  bio_ko: string | null;
  is_active: boolean;
}

const roleOptions = [
  { value: 'actor', label: '배우' },
  { value: 'staff', label: '스텝' },
];

const emptyForm = { name_ko: '', role: 'actor', position_ko: '', bio_ko: '' };

export default function AdminPeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPeople = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('people')
      .select('id, name_ko, role, position_ko, bio_ko, is_active')
      .order('created_at', { ascending: false });
    setPeople((data || []) as Person[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPeople(); }, [fetchPeople]);

  const filtered = people.filter((p) =>
    p.name_ko.includes(search) || (p.position_ko || '').includes(search)
  );

  const openCreate = () => {
    setEditingPerson(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  };

  const openEdit = (person: Person) => {
    setEditingPerson(person);
    setForm({
      name_ko: person.name_ko,
      role: person.role,
      position_ko: person.position_ko || '',
      bio_ko: person.bio_ko || '',
    });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.name_ko || !form.position_ko) return;
    setSaving(true);
    try {
      const input: PersonInput = {
        name_ko: form.name_ko,
        role: form.role as PersonInput['role'],
        position_ko: form.position_ko,
        bio_ko: form.bio_ko || undefined,
      };
      if (editingPerson) {
        await updatePerson(editingPerson.id, input);
      } else {
        await createPerson(input);
      }
      setDrawerOpen(false);
      await fetchPeople();
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
      await deletePerson(deleteTarget.id);
      setDeleteTarget(null);
      await fetchPeople();
    } catch (e) {
      alert('삭제 실패: ' + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">프로필 관리</h1>
        <Button variant="primary" size="md" onClick={openCreate}>+ 프로필 등록</Button>
      </div>

      <div className="mb-4">
        <Input placeholder="이름, 포지션 검색..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">로딩 중...</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <Avatar name={p.name_ko} size="md" shape="circle" />
                <div>
                  <p className="font-medium">{p.name_ko}</p>
                  <p className="text-sm text-muted-foreground">{p.position_ko}</p>
                </div>
                <Badge variant="subtle" color={p.role === 'actor' ? 'primary' : 'success'} size="sm">
                  {p.role === 'actor' ? '배우' : '스텝'}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>수정</Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(p)}>삭제</Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 py-8 text-center text-muted-foreground">
              {people.length === 0 ? '등록된 프로필이 없습니다. 프로필을 등록해주세요.' : '검색 결과가 없습니다.'}
            </div>
          )}
        </div>
      )}

      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        placement="right"
        size="md"
        title={editingPerson ? '프로필 수정' : '프로필 등록'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="md" onClick={() => setDrawerOpen(false)}>취소</Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={!form.name_ko || !form.position_ko || saving}
            >
              {saving ? '저장 중...' : editingPerson ? '수정' : '등록'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="이름"
            value={form.name_ko}
            onChange={(e) => setForm({ ...form, name_ko: e.target.value })}
            placeholder="홍길동"
            required
          />
          <Select
            label="구분"
            options={roleOptions}
            value={form.role}
            onValueChange={(v) => setForm({ ...form, role: v })}
          />
          <Input
            label="포지션"
            value={form.position_ko}
            onChange={(e) => setForm({ ...form, position_ko: e.target.value })}
            placeholder="배우, 연출, 무대디자인 등"
            required
          />
          <Input
            label="소개"
            value={form.bio_ko}
            onChange={(e) => setForm({ ...form, bio_ko: e.target.value })}
            placeholder="간단한 소개를 입력하세요"
          />
        </div>
      </Drawer>

      <Drawer
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        placement="bottom"
        size="sm"
        title="프로필 삭제"
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
          &ldquo;{deleteTarget?.name_ko}&rdquo; 프로필을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
      </Drawer>
    </div>
  );
}
