'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input, Textarea, Button } from '@sunghoon_lee/akron-ui';

export function RentalInquiryForm() {
  const t = useTranslations();
  const [form, setForm] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    desiredDate: '',
    purpose: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.desiredDate || !form.purpose) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="mt-6 flex flex-col items-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl dark:bg-green-900/30">
          ✓
        </div>
        <h3 className="text-xl font-bold">문의가 접수되었습니다</h3>
        <p className="mt-2 text-muted-foreground">담당자가 확인 후 연락드리겠습니다.</p>
        <Button variant="ghost" className="mt-6" onClick={() => { setSubmitted(false); setForm({ name: '', organization: '', email: '', phone: '', desiredDate: '', purpose: '', message: '' }); }}>
          새로운 문의
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="이름 *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          placeholder="홍길동"
        />
        <Input
          label="단체/기관명"
          value={form.organization}
          onChange={(e) => setForm({ ...form, organization: e.target.value })}
          placeholder="(선택사항)"
        />
        <Input
          label="이메일 *"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          placeholder="email@example.com"
        />
        <Input
          label="연락처 *"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
          placeholder="010-0000-0000"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="희망 대관일 *"
          type="date"
          value={form.desiredDate}
          onChange={(e) => setForm({ ...form, desiredDate: e.target.value })}
          required
        />
        <Input
          label="대관 용도 *"
          value={form.purpose}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          required
          placeholder="연극, 음악회, 강연 등"
        />
      </div>

      <Textarea
        label="추가 문의사항"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="무대 세팅, 리허설 일정 등 추가 요청사항을 입력해주세요."
        rows={4}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={!form.name || !form.email || !form.phone || !form.desiredDate || !form.purpose || loading}
      >
        {loading ? t('common.loading') : '대관 문의 접수'}
      </Button>
    </form>
  );
}
