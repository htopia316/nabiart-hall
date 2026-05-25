'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@sunghoon_lee/akron-ui';

const MOCK_DONORS = [
  { name: '김○○', amount: 100000, type: 'recurring' as const, tier: '무지개', message: '항상 좋은 공연 감사합니다!' },
  { name: '이○○', amount: 50000, type: 'recurring' as const, tier: '금빛', message: '나비아트홀 화이팅!' },
  { name: '박○○', amount: 50000, type: 'recurring' as const, tier: '금빛', message: '' },
  { name: '최○○', amount: 30000, type: 'recurring' as const, tier: '은빛', message: '좋은 공연 기대합니다' },
  { name: '정○○', amount: 30000, type: 'recurring' as const, tier: '은빛', message: '' },
  { name: '한○○', amount: 10000, type: 'recurring' as const, tier: '나비', message: '응원합니다!' },
  { name: '윤○○', amount: 10000, type: 'recurring' as const, tier: '나비', message: '' },
  { name: '강○○', amount: 100000, type: 'one-time' as const, tier: '', message: '《햄릿》 감동적이었습니다' },
  { name: '서○○', amount: 50000, type: 'one-time' as const, tier: '', message: '' },
  { name: '조○○', amount: 30000, type: 'one-time' as const, tier: '', message: '앞으로도 좋은 공연 부탁드립니다' },
];

const tierColors: Record<string, string> = {
  '무지개': 'primary',
  '금빛': 'warning',
  '은빛': 'neutral',
  '나비': 'success',
};

export function DonorList() {
  const t = useTranslations();

  const recurring = MOCK_DONORS.filter((d) => d.type === 'recurring');
  const oneTime = MOCK_DONORS.filter((d) => d.type === 'one-time');

  return (
    <div className="mt-6 space-y-10">
      <section>
        <h2 className="mb-4 text-xl font-semibold">{t('support.recurring')} 후원자</h2>
        <div className="space-y-2">
          {recurring.map((d, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <span className="font-medium">{d.name}</span>
                {d.tier && (
                  <Badge variant="subtle" color={tierColors[d.tier] as 'primary' | 'warning' | 'neutral' | 'success'} size="sm">
                    {d.tier}
                  </Badge>
                )}
              </div>
              {d.message && (
                <span className="text-sm text-muted-foreground">&ldquo;{d.message}&rdquo;</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">{t('support.oneTime')} 후원자</h2>
        <div className="space-y-2">
          {oneTime.map((d, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-border p-4">
              <span className="font-medium">{d.name}</span>
              {d.message && (
                <span className="text-sm text-muted-foreground">&ldquo;{d.message}&rdquo;</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-muted-foreground">
        공개에 동의하신 후원자분들만 표시됩니다.
      </p>
    </div>
  );
}
