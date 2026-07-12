import type { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import LegalDocumentView from '@/components/legal/LegalDocumentView';
import { REFUND_POLICY } from '@/lib/legalContent';

export const metadata: Metadata = {
  title: 'Refund Policy – eSIM Viet',
  description: REFUND_POLICY.description,
};

export default function RefundPage() {
  return (
    <MainLayout>
      <LegalDocumentView document={REFUND_POLICY} />
    </MainLayout>
  );
}
