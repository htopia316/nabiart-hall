'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Badge } from '@sunghoon_lee/akron-ui';

const BOOKED_DATES = new Set([
  '2026-06-01', '2026-06-02', '2026-06-07', '2026-06-08',
  '2026-06-14', '2026-06-15', '2026-06-21', '2026-06-22',
  '2026-06-28', '2026-06-29',
  '2026-07-04', '2026-07-05', '2026-07-11', '2026-07-12',
]);

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function RentalCalendar() {
  const t = useTranslations();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [year, month]);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const formatDate = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="mt-6">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={prevMonth}>←</Button>
        <h3 className="text-lg font-semibold">{year}년 {month + 1}월</h3>
        <Button variant="ghost" size="sm" onClick={nextMonth}>→</Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2 text-center text-xs font-medium text-muted-foreground">
            {w}
          </div>
        ))}

        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          const dateStr = formatDate(day);
          const isBooked = BOOKED_DATES.has(dateStr);
          const isPast = dateStr < todayStr;
          const isToday = dateStr === todayStr;

          return (
            <div
              key={dateStr}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-colors ${
                isPast
                  ? 'text-muted-foreground/40'
                  : isBooked
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-400 dark:hover:bg-green-900/20'
              } ${isToday ? 'ring-2 ring-primary' : ''}`}
            >
              <span className="font-medium">{day}</span>
              {!isPast && (
                <span className="text-[10px]">
                  {isBooked ? '예약' : '가능'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-green-100 dark:bg-green-900/20" />
          <span>대관 가능</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-red-100 dark:bg-red-900/20" />
          <span>예약됨</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded ring-2 ring-primary" />
          <span>오늘</span>
        </div>
      </div>
    </div>
  );
}
