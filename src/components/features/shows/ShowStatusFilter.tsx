'use client';

import { useTranslations } from 'next-intl';
import { SegmentedControl } from '@sunghoon_lee/akron-ui';


type Status = 'all' | 'running' | 'upcoming' | 'ended';

interface ShowStatusFilterProps {
  value: Status;
  onChange: (value: Status) => void;
}

export function ShowStatusFilter({ value, onChange }: ShowStatusFilterProps) {
  const t = useTranslations('shows');

  const options = [
    { value: 'all', label: '전체' },
    { value: 'running', label: t('current') },
    { value: 'upcoming', label: t('upcoming') },
    { value: 'ended', label: t('past') },
  ];

  return (
    <SegmentedControl
      options={options}
      value={value}
      onChange={(v) => onChange(v as Status)}
      size="md"
    />
  );
}
