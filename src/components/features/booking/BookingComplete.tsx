'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import { useBookingStore } from '@/lib/stores/booking';

export function BookingComplete() {
  const t = useTranslations();
  const { bookingNumber, selectedSeats, scheduleLabel, totalPrice, reset } = useBookingStore();

  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl dark:bg-green-900/30">
        ✓
      </div>
      <h2 className="text-2xl font-bold">예매가 완료되었습니다!</h2>
      <p className="mt-2 text-muted-foreground">예매 확인 메일이 발송됩니다.</p>

      <div className="mt-8 w-full max-w-sm rounded-2xl border border-border p-6 text-left">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('booking.bookingNumber')}</span>
            <span className="font-mono font-bold">{bookingNumber}</span>
          </div>
          {scheduleLabel && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">일정</span>
              <span>{scheduleLabel}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">좌석</span>
            <span>{selectedSeats.map((s) => `${s.number}번(${s.row})`).join(', ')}</span>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex justify-between font-bold">
              <span>{t('booking.totalPrice')}</span>
              <span>₩{totalPrice().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" onClick={() => reset()}>
          <Button variant="ghost" size="lg">{t('common.home')}</Button>
        </Link>
        <Link href="/booking/lookup" onClick={() => reset()}>
          <Button variant="ghost" size="lg">{t('booking.lookup')}</Button>
        </Link>
        <Link href="/shows" onClick={() => reset()}>
          <Button variant="primary" size="lg">{t('common.shows')}</Button>
        </Link>
      </div>
    </div>
  );
}
