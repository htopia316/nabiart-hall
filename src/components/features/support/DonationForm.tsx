'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input, Button, Checkbox } from '@sunghoon_lee/akron-ui';

const PRESET_AMOUNTS = [10000, 30000, 50000, 100000];

export function DonationForm() {
  const t = useTranslations();
  const [type, setType] = useState<'one-time' | 'recurring'>('one-time');
  const [amount, setAmount] = useState<number | ''>('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isPublic, setIsPublic] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !form.name || !form.email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="mt-6 flex flex-col items-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl dark:bg-green-900/30">
          ♥
        </div>
        <h3 className="text-xl font-bold">{t('support.thankYou')}</h3>
        <p className="mt-2 text-muted-foreground">
          {type === 'recurring' ? '정기 후원이 등록되었습니다.' : '후원이 완료되었습니다.'}
        </p>
        <p className="mt-1 font-semibold">₩{Number(amount).toLocaleString()}</p>
        <Button variant="ghost" className="mt-6" onClick={() => { setSubmitted(false); setAmount(''); setForm({ name: '', email: '', phone: '', message: '' }); }}>
          추가 후원
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-8">
      {/* Type Toggle */}
      <div>
        <h3 className="mb-3 font-semibold">후원 유형</h3>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setType('one-time')}
            className={`rounded-xl border-2 px-6 py-3 text-sm font-medium transition-all ${
              type === 'one-time' ? 'border-primary bg-primary/10 text-primary' : 'border-border'
            }`}
          >
            {t('support.oneTime')}
          </button>
          <button
            type="button"
            onClick={() => setType('recurring')}
            className={`rounded-xl border-2 px-6 py-3 text-sm font-medium transition-all ${
              type === 'recurring' ? 'border-primary bg-primary/10 text-primary' : 'border-border'
            }`}
          >
            {t('support.recurring')}
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <h3 className="mb-3 font-semibold">후원 금액</h3>
        <div className="mb-3 flex flex-wrap gap-2">
          {PRESET_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(a)}
              className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all ${
                amount === a ? 'border-primary bg-primary/10 text-primary' : 'border-border'
              }`}
            >
              ₩{a.toLocaleString()}
            </button>
          ))}
        </div>
        <Input
          label="직접 입력"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
          placeholder="금액을 입력하세요"
          min={1000}
        />
      </div>

      {/* Personal Info */}
      <div>
        <h3 className="mb-3 font-semibold">후원자 정보</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="이름 *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="홍길동"
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
            label="연락처"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="010-0000-0000"
          />
        </div>
      </div>

      <Input
        label="응원 메시지 (선택)"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="나비아트홀을 응원합니다!"
      />

      <Checkbox
        checked={isPublic}
        onCheckedChange={(v) => setIsPublic(v === true)}
        label="후원자 명단에 이름을 공개합니다."
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={!amount || !form.name || !form.email || loading}
      >
        {loading ? t('common.loading') : `₩${amount ? Number(amount).toLocaleString() : '0'} ${type === 'recurring' ? '정기 후원하기' : '후원하기'}`}
      </Button>
    </form>
  );
}
