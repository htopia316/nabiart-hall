'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@sunghoon_lee/akron-ui';
import { SupportInfo } from '@/components/features/support/SupportInfo';
import { DonationForm } from '@/components/features/support/DonationForm';
import { DonorList } from '@/components/features/support/DonorList';

export function SupportPageClient() {
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{t('support.title')}</h1>
      <p className="mb-8 text-muted-foreground">여러분의 후원이 더 나은 공연을 만듭니다.</p>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">{t('support.benefits')}</TabsTrigger>
          <TabsTrigger value="donate">{t('support.title')}</TabsTrigger>
          <TabsTrigger value="donors">{t('support.donors')}</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <SupportInfo />
        </TabsContent>

        <TabsContent value="donate">
          <DonationForm />
        </TabsContent>

        <TabsContent value="donors">
          <DonorList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
