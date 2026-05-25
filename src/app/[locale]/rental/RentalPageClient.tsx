'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@sunghoon_lee/akron-ui';
import { VenueInfo } from '@/components/features/rental/VenueInfo';
import { RentalInquiryForm } from '@/components/features/rental/RentalInquiryForm';
import { RentalCalendar } from '@/components/features/rental/RentalCalendar';

export function RentalPageClient() {
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{t('rental.title')}</h1>
      <p className="mb-8 text-muted-foreground">나비아트홀의 공간을 대관하실 수 있습니다.</p>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">{t('rental.info')}</TabsTrigger>
          <TabsTrigger value="calendar">{t('rental.calendar')}</TabsTrigger>
          <TabsTrigger value="inquiry">{t('rental.inquiry')}</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <VenueInfo />
        </TabsContent>

        <TabsContent value="calendar">
          <RentalCalendar />
        </TabsContent>

        <TabsContent value="inquiry">
          <RentalInquiryForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
