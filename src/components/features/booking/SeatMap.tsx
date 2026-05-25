'use client';

import { useTranslations } from 'next-intl';
import { useBookingStore, type SeatInfo } from '@/lib/stores/booking';

type SeatDef = {
  num: number;
  row: number;
  col: number;
};

// 실제 나비아트홀 좌석 배치 (이미지 기준)
// row: 1(맨 앞, 무대 가까운 쪽) ~ 6(맨 뒤)
// col: 왼쪽→오른쪽 위치

const SECTION_A: SeatDef[] = [
  // 1열
  { num: 1, row: 1, col: 0 }, { num: 2, row: 1, col: 1 }, { num: 3, row: 1, col: 2 },
  // 2열
  { num: 13, row: 2, col: 0 }, { num: 14, row: 2, col: 1 }, { num: 15, row: 2, col: 2 }, { num: 16, row: 2, col: 3 },
  // 3열
  { num: 26, row: 3, col: 0 }, { num: 27, row: 3, col: 1 }, { num: 28, row: 3, col: 2 }, { num: 29, row: 3, col: 3 },
  // 4열
  { num: 46, row: 4, col: 0 }, { num: 47, row: 4, col: 1 }, { num: 48, row: 4, col: 2 }, { num: 49, row: 4, col: 3 },
  // 5열
  { num: 60, row: 5, col: 0 }, { num: 61, row: 5, col: 1 }, { num: 62, row: 5, col: 2 }, { num: 63, row: 5, col: 3 },
];

const SECTION_B: SeatDef[] = [
  // 1열
  { num: 4, row: 1, col: 0 }, { num: 5, row: 1, col: 1 }, { num: 6, row: 1, col: 2 }, { num: 7, row: 1, col: 3 }, { num: 8, row: 1, col: 4 },
  // 2열
  { num: 17, row: 2, col: 0 }, { num: 18, row: 2, col: 1 }, { num: 19, row: 2, col: 2 }, { num: 20, row: 2, col: 3 }, { num: 21, row: 2, col: 4 }, { num: 22, row: 2, col: 5 },
  // 3열
  { num: 30, row: 3, col: 0 }, { num: 31, row: 3, col: 1 }, { num: 32, row: 3, col: 2 }, { num: 33, row: 3, col: 3 }, { num: 34, row: 3, col: 4 }, { num: 35, row: 3, col: 5 },
  // 4열
  { num: 40, row: 4, col: 0 }, { num: 41, row: 4, col: 1 }, { num: 42, row: 4, col: 2 }, { num: 43, row: 4, col: 3 }, { num: 44, row: 4, col: 4 }, { num: 45, row: 4, col: 5 },
  // 5열
  { num: 50, row: 5, col: 0 }, { num: 51, row: 5, col: 1 }, { num: 52, row: 5, col: 2 }, { num: 53, row: 5, col: 3 }, { num: 54, row: 5, col: 4 }, { num: 55, row: 5, col: 5 },
  // 6열
  { num: 64, row: 6, col: 0 }, { num: 65, row: 6, col: 1 }, { num: 66, row: 6, col: 2 }, { num: 67, row: 6, col: 3 }, { num: 68, row: 6, col: 4 }, { num: 69, row: 6, col: 5 },
  // 7열 (맨 뒤)
  { num: 74, row: 7, col: 0 }, { num: 75, row: 7, col: 1 }, { num: 76, row: 7, col: 2 }, { num: 77, row: 7, col: 3 }, { num: 78, row: 7, col: 4 }, { num: 79, row: 7, col: 5 },
];

const SECTION_C: SeatDef[] = [
  // 1열
  { num: 9, row: 1, col: 0 }, { num: 10, row: 1, col: 1 },
  // 2열
  { num: 23, row: 2, col: 0 }, { num: 24, row: 2, col: 1 }, { num: 25, row: 2, col: 2 },
  // 3열
  { num: 36, row: 3, col: 0 }, { num: 37, row: 3, col: 1 }, { num: 38, row: 3, col: 2 }, { num: 39, row: 3, col: 3 },
  // 4열
  { num: 56, row: 4, col: 0 }, { num: 57, row: 4, col: 1 }, { num: 58, row: 4, col: 2 }, { num: 59, row: 4, col: 3 },
  // 5열
  { num: 70, row: 5, col: 0 }, { num: 71, row: 5, col: 1 }, { num: 72, row: 5, col: 2 }, { num: 73, row: 5, col: 3 },
  // 6열
  { num: 80, row: 6, col: 0 }, { num: 81, row: 6, col: 1 },
];

const TOTAL_ROWS = 7;

function getSeatGrade(num: number): { grade: SeatInfo['grade']; price: number } {
  if (num <= 8 || num === 9 || num === 10) return { grade: 'economy', price: 40000 };
  if (num <= 35 || (num >= 23 && num <= 25) || (num >= 36 && num <= 39)) return { grade: 'standard', price: 60000 };
  return { grade: 'vip', price: 80000 };
}

const gradeStyles: Record<SeatInfo['grade'], { border: string; bg: string; text: string }> = {
  vip: { border: '#7C3AED', bg: '#7C3AED', text: '#7C3AED' },
  standard: { border: '#2563EB', bg: '#2563EB', text: '#2563EB' },
  economy: { border: '#059669', bg: '#059669', text: '#059669' },
};

const SOLD_SEATS = new Set([3, 14, 19, 20, 31, 42, 55, 67, 71, 78]);

export function SeatMap() {
  const t = useTranslations('booking');
  const { selectedSeats, toggleSeat } = useBookingStore();
  const selectedIds = new Set(selectedSeats.map((s) => s.id));

  const handleClick = (seatNum: number, section: string) => {
    const seatId = `${section}-${seatNum}`;
    if (SOLD_SEATS.has(seatNum)) return;
    const { grade, price } = getSeatGrade(seatNum);
    toggleSeat({
      id: seatId,
      row: section,
      number: seatNum,
      grade,
      price,
      status: 'available',
    });
  };

  const renderSeat = (seat: SeatDef, section: 'A' | 'B' | 'C') => {
    const seatId = `${section}-${seat.num}`;
    const isSold = SOLD_SEATS.has(seat.num);
    const isSelected = selectedIds.has(seatId);
    const { grade } = getSeatGrade(seat.num);
    const style = gradeStyles[grade];

    return (
      <button
        key={seatId}
        onClick={() => handleClick(seat.num, section)}
        disabled={isSold}
        className="flex h-[26px] w-[26px] items-center justify-center rounded text-[9px] font-medium transition-all sm:h-[30px] sm:w-[30px] sm:text-[10px]"
        style={{
          backgroundColor: isSold
            ? 'var(--muted)'
            : isSelected
              ? style.bg
              : 'transparent',
          border: isSold
            ? '1px solid var(--border)'
            : isSelected
              ? `2px solid ${style.border}`
              : `1.5px solid ${style.border}`,
          color: isSold
            ? 'var(--muted-foreground)'
            : isSelected
              ? '#fff'
              : style.text,
          cursor: isSold ? 'not-allowed' : 'pointer',
          opacity: isSold ? 0.4 : 1,
        }}
        aria-label={`${seat.num}번 좌석`}
      >
        {seat.num}
      </button>
    );
  };

  const renderSection = (seats: SeatDef[], section: 'A' | 'B' | 'C', maxCols: number) => {
    const rows: Record<number, SeatDef[]> = {};
    seats.forEach((s) => {
      if (!rows[s.row]) rows[s.row] = [];
      rows[s.row].push(s);
    });

    const sortedRowKeys = Object.keys(rows).map(Number).sort((a, b) => b - a);

    return (
      <div className="flex flex-col gap-1">
        {sortedRowKeys.map((rowKey) => {
          const rowSeats = rows[rowKey].sort((a, b) => a.col - b.col);
          const emptyCols = maxCols - rowSeats.length;
          return (
            <div key={rowKey} className="flex gap-1" style={{ justifyContent: section === 'C' ? 'flex-start' : section === 'A' ? 'flex-end' : 'center' }}>
              {section === 'A' && Array.from({ length: emptyCols }).map((_, i) => (
                <div key={`e-${i}`} className="h-[26px] w-[26px] sm:h-[30px] sm:w-[30px]" />
              ))}
              {rowSeats.map((seat) => renderSeat(seat, section))}
              {section === 'C' && Array.from({ length: emptyCols }).map((_, i) => (
                <div key={`e-${i}`} className="h-[26px] w-[26px] sm:h-[30px] sm:w-[30px]" />
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="mx-auto min-w-[640px] max-w-4xl">
        {/* 컨트롤 룸 */}
        <div className="mb-2 flex justify-start">
          <div className="ml-0 rounded bg-neutral-200 px-3 py-1 text-[10px] text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
            컨트롤 룸
          </div>
        </div>

        {/* 좌석 배치 */}
        <div className="flex items-start justify-center gap-3 sm:gap-5">
          {/* A구역 */}
          <div>
            <p className="mb-2 text-center text-xs font-medium text-muted-foreground">A구역</p>
            {renderSection(SECTION_A, 'A', 4)}
          </div>

          {/* 통로 표시 */}
          <div className="flex h-full items-center">
            <div className="h-full w-px bg-border" style={{ minHeight: 280 }} />
          </div>

          {/* B구역 */}
          <div>
            <p className="mb-2 text-center text-xs font-medium text-muted-foreground">B구역</p>
            {renderSection(SECTION_B, 'B', 6)}
          </div>

          {/* 통로 표시 */}
          <div className="flex h-full items-center">
            <div className="h-full w-px bg-border" style={{ minHeight: 280 }} />
          </div>

          {/* C구역 */}
          <div>
            <p className="mb-2 text-center text-xs font-medium text-muted-foreground">C구역</p>
            {renderSection(SECTION_C, 'C', 4)}
          </div>
        </div>

        {/* 출입구 */}
        <div className="mt-4 flex justify-start">
          <div className="rounded bg-neutral-200 px-3 py-1 text-xs text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
            🚪 출입구
          </div>
        </div>

        {/* 무대 */}
        <div className="mx-auto mt-4 w-full rounded-t-[50%] bg-neutral-200 py-4 text-center text-sm font-semibold text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
          무 대
        </div>

        {/* 범례 */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded border-2" style={{ borderColor: '#7C3AED' }} />
            <span>VIP (₩80,000)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded border-2" style={{ borderColor: '#2563EB' }} />
            <span>{t('seatGrade.standard')} (₩60,000)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded border-2" style={{ borderColor: '#059669' }} />
            <span>{t('seatGrade.economy')} (₩40,000)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded bg-muted" />
            <span>{t('reserved')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded" style={{ backgroundColor: '#7C3AED' }} />
            <span>{t('selected')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
