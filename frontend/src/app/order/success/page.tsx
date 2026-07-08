import { Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import OrderSuccessClient from './OrderSuccessClient';
import { PageLoader } from '@/components/common/LoadingSpinner';

export default function OrderSuccessPage() {
  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <OrderSuccessClient />
      </Suspense>
    </MainLayout>
  );
}
