'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@sunghoon_lee/akron-ui';
import { createClient } from '@/lib/supabase/client';

interface Donor {
  id: string;
  donor_name: string;
  amount: number;
  type: string;
  message: string | null;
  is_public: boolean;
}

const tierColors: Record<string, 'primary' | 'warning' | 'neutral' | 'success'> = {
  '무지개': 'primary',
  '금빛': 'warning',
  '은빛': 'neutral',
  '나비': 'success',
};

function getTier(amount: number): string {
  if (amount >= 100000) return '무지개';
  if (amount >= 50000) return '금빛';
  if (amount >= 30000) return '은빛';
  if (amount >= 10000) return '나비';
  return '';
}

export function DonorList() {
  const t = useTranslations();
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('donations')
      .select('id, donor_name, amount, type, message, is_public')
      .eq('is_public', true)
      .order('amount', { ascending: false })
      .then(({ data }) => {
        if (data) setDonors(data as Donor[]);
      });
  }, []);

  const recurring = donors.filter((d) => d.type === 'recurring');
  const oneTime = donors.filter((d) => d.type === 'one-time');

  if (donors.length === 0) {
    return (
      <div className="mt-6 py-8 text-center text-muted-foreground">
        아직 공개된 후원자가 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-10">
      {recurring.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">{t('support.recurring')} 후원자</h2>
          <div className="space-y-2">
            {recurring.map((d) => {
              const tier = getTier(d.amount);
              return (
                <div key={d.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{d.donor_name}</span>
                    {tier && (
                      <Badge variant="subtle" color={tierColors[tier]} size="sm">
                        {tier}
                      </Badge>
                    )}
                  </div>
                  {d.message && (
                    <span className="text-sm text-muted-foreground">&ldquo;{d.message}&rdquo;</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {oneTime.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">{t('support.oneTime')} 후원자</h2>
          <div className="space-y-2">
            {oneTime.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                <span className="font-medium">{d.donor_name}</span>
                {d.message && (
                  <span className="text-sm text-muted-foreground">&ldquo;{d.message}&rdquo;</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-center text-xs text-muted-foreground">
        공개에 동의하신 후원자분들만 표시됩니다.
      </p>
    </div>
  );
}
