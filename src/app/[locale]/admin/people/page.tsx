'use client';

import { useState } from 'react';
import { Badge, Button, Avatar, Input, Drawer, Select } from '@sunghoon_lee/akron-ui';

interface Person {
  id: string;
  name: string;
  role: 'actor' | 'staff';
  position: string;
  bio: string;
  isActive: boolean;
}

const INITIAL_PEOPLE: Person[] = [
  { id: 'p1', name: '김민수', role: 'actor', position: '배우', bio: '서울예술대학교 연극학과 졸업', isActive: true },
  { id: 'p2', name: '이서연', role: 'actor', position: '배우', bio: '한국예술종합학교 연극원 졸업', isActive: true },
  { id: 'p3', name: '박준호', role: 'actor', position: '배우', bio: '중앙대학교 연극학과 졸업', isActive: true },
  { id: 'p4', name: '최예진', role: 'actor', position: '배우', bio: '동국대학교 연극학부 졸업', isActive: true },
  { id: 'p5', name: '정하늘', role: 'staff', position: '연출', bio: '15년 경력의 연출가', isActive: true },
  { id: 'p6', name: '윤지원', role: 'staff', position: '무대디자인', bio: '국내외 다수 수상 경력', isActive: true },
  { id: 'p7', name: '한승우', role: 'staff', position: '조명디자인', bio: '10년 경력의 조명 디자이너', isActive: true },
  { id: 'p8', name: '강소희', role: 'staff', position: '기획/프로듀서', bio: '다수의 극단 공연 기획', isActive: true },
];

const roleOptions = [
  { value: 'actor', label: '배우' },
  { value: 'staff', label: '스텝' },
];

const emptyForm = { name: '', role: 'actor' as Person['role'], position: '', bio: '' };

export default function AdminPeoplePage() {
  const [people, setPeople] = useState<Person[]>(INITIAL_PEOPLE);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null);

  const filtered = people.filter((p) => p.name.includes(search) || p.position.includes(search));

  const openCreate = () => {
    setEditingPerson(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (person: Person) => {
    setEditingPerson(person);
    setForm({ name: person.name, role: person.role, position: person.position, bio: person.bio });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.position) return;
    if (editingPerson) {
      setPeople(people.map((p) => p.id === editingPerson.id ? { ...p, ...form } : p));
    } else {
      const newPerson: Person = {
        id: Date.now().toString(),
        ...form,
        isActive: true,
      };
      setPeople([...people, newPerson]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setPeople(people.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
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

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <Avatar name={p.name} size="md" shape="circle" />
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-muted-foreground">{p.position}</p>
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
          <div className="col-span-2 py-8 text-center text-muted-foreground">검색 결과가 없습니다.</div>
        )}
      </div>

      <Drawer
        open={modalOpen}
        onOpenChange={setModalOpen}
        placement="right"
        size="md"
        title={editingPerson ? '프로필 수정' : '프로필 등록'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="md" onClick={() => setModalOpen(false)}>취소</Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={!form.name || !form.position}
            >
              {editingPerson ? '수정' : '등록'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="이름"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="홍길동"
            required
          />
          <Select
            label="구분"
            options={roleOptions}
            value={form.role}
            onValueChange={(v) => setForm({ ...form, role: v as Person['role'] })}
          />
          <Input
            label="포지션"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            placeholder="배우, 연출, 무대디자인 등"
            required
          />
          <Input
            label="소개"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
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
            <Button variant="primary" size="md" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">삭제</Button>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">
          &ldquo;{deleteTarget?.name}&rdquo; 프로필을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
      </Drawer>
    </div>
  );
}
