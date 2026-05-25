'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Badge, Button } from '@sunghoon_lee/akron-ui';
import { useBookingStore } from '@/lib/stores/booking';
import { createClient } from '@/lib/supabase/client';

interface Schedule {
  id: string;
  show_date: string;
  show_time: string;
  available_seats: number;
  total_seats: number;
}

export function ScheduleSelect() {
  const t = useTranslations();
  const { showId, setSchedule } = useBookingStore();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!showId) { setLoading(false); return; }
    const supabase = createClient();
    supabase
      .from('schedules')
      .select('id, show_date, show_time, available_seats, total_seats')
      .eq('show_id', showId)
      .order('show_date')
      .order('show_time')
      .then(({ data }) => {
        if (data) setSchedules(data as Schedule[]);
        setLoading(false);
      });
  }, [showId]);

  if (loading) {
    return <div className="py-12 text-center text-muted-foreground">로딩 중...</div>;
  }

  if (schedules.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        등록된 일정이 없습니다.
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">{t('booking.selectDate')}</h2>
      <div className="space-y-3">
        {schedules.map((sched) => {
          const isSoldOut = sched.available_seats === 0;
          return (
            <div
              key={sched.id}
              className="flex items-center justify-between rounded-xl border border-border p-5 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-5">
                <div>
                  <p className="text-lg font-semibold">{sched.show_date}</p>
                  <p className="text-sm text-muted-foreground">{sched.show_time}</p>
                </div>
                <Badge
                  variant="subtle"
                  color={sched.available_seats > 30 ? 'success' : sched.available_seats > 0 ? 'warning' : 'error'}
                  size="sm"
                >
                  {isSoldOut ? '매진' : `${sched.available_seats}/${sched.total_seats}석`}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="md"
                disabled={isSoldOut}
                onClick={() => setSchedule(sched.id, `${sched.show_date} ${sched.show_time}`)}
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
