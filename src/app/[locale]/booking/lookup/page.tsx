'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input, Button, Badge } from '@sunghoon_lee/akron-ui';
import { Link } from '@/lib/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

interface BookingResult {
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

export default function BookingLookupPage() {
  const t = useTranslations('booking');
  const tc = useTranslations('common');
  const [bookingNum, setBookingNum] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<BookingResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setSearched(false);

    const supabase = createClient();
    const { data } = await supabase
      .from('bookings')
      .select('*, schedules(show_date, show_time, shows(title_ko))')
      .eq('booking_number', bookingNum.trim())
      .eq('booker_phone', phone.trim())
      .single();

    if (data) {
      const schedule = Array.isArray(data.schedules) ? data.schedules[0] : data.schedules;
      const showTitle = schedule?.shows
        ? (Array.isArray(schedule.shows) ? schedule.shows[0]?.title_ko : schedule.shows.title_ko) || ''
        : '';
      setResult({
        bookingNumber: data.booking_number,
        showTitle,
        showDate: schedule ? `${schedule.show_date} ${schedule.show_time}` : '',
        seats: data.selected_seats || [],
        bookerName: data.booker_name,
        bookerPhone: data.booker_phone,
        paymentAmount: data.total_amount || 0,
        bookingDate: data.created_at?.slice(0, 10) || '',
        status: data.status,
      });
    }

    setSearched(true);
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!result) return;
    if (!window.confirm(t('cancelConfirm'))) return;
    setCancelling(true);

    const supabase = createClient();
    await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('booking_number', result.bookingNumber);

    setResult({ ...result, status: 'cancelled' });
    setCancelling(false);
  };

  const statusColor: Record<string, 'success' | 'warning' | 'error'> = {
    confirmed: 'success',
    pending: 'warning',
    cancelled: 'error',
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
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? tc('loading') : t('lookupButton')}
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
            <Badge variant="subtle" color={statusColor[result.status] ?? 'neutral'} size="sm">
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
