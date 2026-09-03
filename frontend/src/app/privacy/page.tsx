import type { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import LegalDocumentView from '@/components/legal/LegalDocumentView';
import { PRIVACY_POLICY } from '@/lib/legalContent';

export const metadata: Metadata = {
  title: 'Privacy Policy – eSIM Viet',
  description: PRIVACY_POLICY.description,
};

export default function PrivacyPage() {
  return (
    <MainLayout>
      <LegalDocumentView document={PRIVACY_POLICY} />
    </MainLayout>
  );
}
