import type { Metadata } from 'next';
import { Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CheckoutClient from './CheckoutClient';
import { PageLoader } from '@/components/common/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Checkout – Complete Your Order',
  description: 'Secure checkout. Pay with PayPal and receive your eSIM within 24 hours.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <CheckoutClient />
      </Suspense>
    </MainLayout>
  );
}
