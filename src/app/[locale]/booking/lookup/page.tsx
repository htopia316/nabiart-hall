'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input, Button, Badge } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';

interface MockBooking {
  bookingNumber: string;
  showTitle: string;
  showDate: string;
  seats: string[];
  bookerName: string;
  bookerPhone: string;
  paymentAmount: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'pending';
}

const MOCK_BOOKINGS: MockBooking[] = [
  {
    bookingNumber: 'NB2ABC123',
    showTitle: '봄날의 꿈',
    showDate: '2026-06-15 19:30',
    seats: ['B-32 (일반석)', 'B-33 (일반석)'],
    bookerName: '홍길동',
    bookerPhone: '010-1234-5678',
    paymentAmount: 120000,
    bookingDate: '2026-05-20',
    status: 'confirmed',
  },
  {
    bookingNumber: 'NB2DEF456',
    showTitle: '여름밤의 세레나데',
    showDate: '2026-07-01 15:00',
    seats: ['A-27 (VIP석)'],
    bookerName: '홍길동',
    bookerPhone: '010-1234-5678',
    paymentAmount: 80000,
    bookingDate: '2026-05-22',
    status: 'confirmed',
  },
];

export default function BookingLookupPage() {
  const t = useTranslations('booking');
  const tc = useTranslations('common');
  const [bookingNum, setBookingNum] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<MockBooking | null>(null);
  const [searched, setSearched] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const found = MOCK_BOOKINGS.find(
      (b) => b.bookingNumber === bookingNum.trim() && b.bookerPhone === phone.trim()
    );
    setResult(found ?? null);
    setSearched(true);
  };

  const handleCancel = () => {
    if (!result) return;
    if (!window.confirm(t('cancelConfirm'))) return;
    setCancelling(true);
    setTimeout(() => {
      setResult({ ...result, status: 'cancelled' });
      setCancelling(false);
    }, 1000);
  };

  const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    confirmed: 'default',
    pending: 'secondary',
    cancelled: 'destructive',
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{t('lookup')}</h1>
      <p className="mb-8 text-muted-foreground">{t('lookupDesc')}</p>

      <form onSubmit={handleLookup} className="space-y-4">
        <Input
          label={t('enterBookingNumber')}
          value={bookingNum}
          onChange={(e) => setBookingNum(e.target.value)}
          placeholder="NB2ABC123"
          required
        />
        <Input
          label={t('enterPhone')}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-1234-5678"
          required
        />
        <Button type="submit" variant="primary" size="lg" className="w-full">
          {t('lookupButton')}
        </Button>
      </form>

      {searched && !result && (
        <div className="mt-8 rounded-2xl border border-border p-6 text-center">
          <p className="text-muted-foreground">{t('bookingNotFound')}</p>
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-2xl border border-border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">{t('bookingNumber')}</h2>
            <Badge variant={statusVariant[result.status] ?? 'default'}>
              {t(`status.${result.status}`)}
            </Badge>
          </div>
          <p className="mb-6 font-mono text-xl font-bold">{result.bookingNumber}</p>

          <div className="space-y-3 text-sm">
            <Row label={t('showTitle')} value={result.showTitle} />
            <Row label={t('showDate')} value={result.showDate} />
            <Row label={t('seats')} value={result.seats.join(', ')} />
            <Row label={t('bookerName')} value={result.bookerName} />
            <Row label={t('bookerPhone')} value={result.bookerPhone} />
            <Row label={t('bookingDate')} value={result.bookingDate} />
            <div className="border-t border-border pt-3">
              <div className="flex justify-between font-bold">
                <span>{t('paymentAmount')}</span>
                <span>₩{result.paymentAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {result.status === 'confirmed' && (
            <Button
              variant="ghost"
              size="lg"
              className="mt-6 w-full text-destructive hover:text-destructive"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? tc('loading') : t('cancelBooking')}
            </Button>
          )}

          {result.status === 'cancelled' && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t('cancelSuccess')}
            </p>
          )}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/booking" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          ← {tc('booking')}
        </Link>
      </div>

      <div className="mt-4 rounded-lg bg-muted p-4 text-xs text-muted-foreground">
        <p className="font-medium">테스트 데이터:</p>
        <p>예매번호: NB2ABC123 / 연락처: 010-1234-5678</p>
        <p>예매번호: NB2DEF456 / 연락처: 010-1234-5678</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
