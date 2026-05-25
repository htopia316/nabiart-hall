'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input, Button, Checkbox } from '@sunghoon_lee/akron-ui';
import { useBookingStore } from '@/lib/stores/booking';

export function BookingInfoForm() {
  const t = useTranslations();
  const { selectedSeats, totalPrice, setStep, setBookingNumber } = useBookingStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree || !form.name || !form.email || !form.phone) return;

    setLoading(true);
    // 실제로는 여기서 토스페이먼츠 결제 SDK 호출
    await new Promise((r) => setTimeout(r, 1500));
    const bookingNum = `NB${Date.now().toString(36).toUpperCase()}`;
    setBookingNumber(bookingNum);
    setStep('complete');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="mb-6 text-xl font-semibold">예매 정보 입력</h2>
        <div className="space-y-4">
          <Input
            label="이름"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="홍길동"
          />
          <Input
            label="이메일"
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
            required
            placeholder="010-0000-0000"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-border p-6">
        <h3 className="mb-4 font-semibold">예매 내역</h3>
        <div className="space-y-2 text-sm">
          {selectedSeats.map((s) => (
            <div key={s.id} className="flex justify-between">
              <span>{s.number}번 ({s.row}구역, {s.grade.toUpperCase()})</span>
              <span>₩{s.price.toLocaleString()}</span>
            </div>
          ))}
          <div className="mt-3 border-t border-border pt-3">
            <div className="flex justify-between text-base font-bold">
              <span>{t('booking.totalPrice')}</span>
              <span>₩{totalPrice().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <Checkbox
        checked={agree}
        onCheckedChange={(v) => setAgree(v === true)}
        label="예매 약관 및 취소/환불 규정에 동의합니다."
      />

      <div className="flex gap-3">
        <Button variant="ghost" size="lg" onClick={() => setStep('select-seat')}>
          {t('common.back')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!agree || !form.name || !form.email || !form.phone || loading}
        >
          {loading ? t('common.loading') : `₩${totalPrice().toLocaleString()} 결제하기`}
        </Button>
      </div>
    </form>
  );
}
