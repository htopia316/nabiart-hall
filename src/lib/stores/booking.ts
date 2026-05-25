import { create } from 'zustand';

export interface SeatInfo {
  id: string;
  row: string;
  number: number;
  grade: 'vip' | 'standard' | 'economy';
  price: number;
  status: 'available' | 'held' | 'sold';
}

interface BookingState {
  showId: string | null;
  scheduleId: string | null;
  scheduleLabel: string | null;
  selectedSeats: SeatInfo[];
  step: 'select-schedule' | 'select-seat' | 'info' | 'payment' | 'complete';
  bookingNumber: string | null;
  setShow: (showId: string) => void;
  setSchedule: (scheduleId: string, label: string) => void;
  toggleSeat: (seat: SeatInfo) => void;
  clearSeats: () => void;
  setStep: (step: BookingState['step']) => void;
  setBookingNumber: (num: string) => void;
  reset: () => void;
  totalPrice: () => number;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  showId: null,
  scheduleId: null,
  scheduleLabel: null,
  selectedSeats: [],
  step: 'select-schedule',
  bookingNumber: null,

  setShow: (showId) => set({ showId }),
  setSchedule: (scheduleId, label) => set({ scheduleId, scheduleLabel: label, step: 'select-seat' }),
  toggleSeat: (seat) => {
    const current = get().selectedSeats;
    const exists = current.find((s) => s.id === seat.id);
    if (exists) {
      set({ selectedSeats: current.filter((s) => s.id !== seat.id) });
    } else if (current.length < 4) {
      set({ selectedSeats: [...current, seat] });
    }
  },
  clearSeats: () => set({ selectedSeats: [] }),
  setStep: (step) => set({ step }),
  setBookingNumber: (num) => set({ bookingNumber: num }),
  reset: () => set({
    showId: null, scheduleId: null, scheduleLabel: null,
    selectedSeats: [], step: 'select-schedule', bookingNumber: null,
  }),
  totalPrice: () => get().selectedSeats.reduce((sum, s) => sum + s.price, 0),
}));
