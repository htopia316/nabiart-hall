import { Suspense } from 'react';
import { BookingFlow } from '@/components/features/booking/BookingFlow';

export default function BookingPage() {
  return (
    <Suspense>
      <BookingFlow />
    </Suspense>
  );
}
