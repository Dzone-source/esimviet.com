import type { Metadata } from 'next';
import { Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CountriesPageClient from './CountriesPageClient';
import { PageLoader } from '@/components/common/LoadingSpinner';

export const metadata: Metadata = {
  title: 'All eSIM Destinations – 100+ Countries',
  description: 'Browse eSIM data plans for 100+ countries. Find affordable 4G/5G data plans for your next trip.',
};

export default function CountriesPage() {
  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <CountriesPageClient />
      </Suspense>
    </MainLayout>
  );
}
