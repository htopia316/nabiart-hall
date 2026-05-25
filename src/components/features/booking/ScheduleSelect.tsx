'use client';

import { useTranslations } from 'next-intl';
import { Badge, Button } from '@sunghoon_lee/akron-ui';
import { useBookingStore } from '@/lib/stores/booking';

const MOCK_SCHEDULES = [
  { id: 's1', date: '2026-06-01', time: '14:00', available: 45, total: 100 },
  { id: 's2', date: '2026-06-01', time: '19:00', available: 32, total: 100 },
  { id: 's3', date: '2026-06-02', time: '14:00', available: 78, total: 100 },
  { id: 's4', date: '2026-06-07', time: '14:00', available: 90, total: 100 },
  { id: 's5', date: '2026-06-07', time: '19:00', available: 65, total: 100 },
  { id: 's6', date: '2026-06-08', time: '14:00', available: 0, total: 100 },
];

export function ScheduleSelect() {
  const t = useTranslations();
  const { setSchedule } = useBookingStore();

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">{t('booking.selectDate')}</h2>
      <div className="space-y-3">
        {MOCK_SCHEDULES.map((sched) => {
          const isSoldOut = sched.available === 0;
          return (
            <div
              key={sched.id}
              className="flex items-center justify-between rounded-xl border border-border p-5 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-5">
                <div>
                  <p className="text-lg font-semibold">{sched.date}</p>
                  <p className="text-sm text-muted-foreground">{sched.time}</p>
                </div>
                <Badge
                  variant="subtle"
                  color={sched.available > 30 ? 'success' : sched.available > 0 ? 'warning' : 'error'}
                  size="sm"
                >
                  {isSoldOut ? '매진' : `${sched.available}/${sched.total}석`}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="md"
                disabled={isSoldOut}
                onClick={() => setSchedule(sched.id, `${sched.date} ${sched.time}`)}
              >
                {t('booking.selectSeat')}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
