'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { StepIndicator, Button } from '@sunghoon_lee/akron-ui';
import { useBookingStore } from '@/lib/stores/booking';
import { ScheduleSelect } from './ScheduleSelect';
import { SeatMap } from './SeatMap';
import { BookingInfoForm } from './BookingInfoForm';
import { BookingComplete } from './BookingComplete';

const STEPS = [
  { label: '일정 선택', value: 'select-schedule' },
  { label: '좌석 선택', value: 'select-seat' },
  { label: '정보 입력', value: 'info' },
  { label: '예매 완료', value: 'complete' },
];

export function BookingFlow() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const store = useBookingStore();

  useEffect(() => {
    const showId = searchParams.get('show');
    const scheduleId = searchParams.get('schedule');
    if (showId) {
      store.setShow(showId);
      if (scheduleId) {
        store.setSchedule(scheduleId, '');
      }
    }
  }, [searchParams]);

  const stepIndex = STEPS.findIndex((s) => s.value === store.step);

  const steps = STEPS.map((s) => ({ label: s.label }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{t('common.booking')}</h1>

      <div className="mb-10">
        <StepIndicator steps={steps} currentStep={stepIndex} size="sm" />
      </div>

      {store.step === 'select-schedule' && <ScheduleSelect />}
      {store.step === 'select-seat' && <SeatSelectStep />}
      {store.step === 'info' && <BookingInfoForm />}
      {store.step === 'complete' && <BookingComplete />}
    </div>
  );
}

function SeatSelectStep() {
  const t = useTranslations('booking');
  const { selectedSeats, totalPrice, setStep } = useBookingStore();

  return (
    <div>
      <SeatMap />

      {selectedSeats.length > 0 && (
        <div className="mt-8 rounded-2xl border border-border p-6">
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium"
              >
                {s.number}번 ({s.row}구역, {s.grade.toUpperCase()})
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">{t('totalPrice')}</span>
              <p className="text-2xl font-bold">₩{totalPrice().toLocaleString()}</p>
            </div>
            <Button variant="primary" size="lg" onClick={() => setStep('info')}>
              {t('proceed')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
