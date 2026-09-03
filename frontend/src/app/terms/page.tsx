import type { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import LegalDocumentView from '@/components/legal/LegalDocumentView';
import { TERMS_OF_SERVICE } from '@/lib/legalContent';

export const metadata: Metadata = {
  title: 'Terms of Service – eSIM Viet',
  description: TERMS_OF_SERVICE.description,
};

export default function TermsPage() {
  return (
    <MainLayout>
      <LegalDocumentView document={TERMS_OF_SERVICE} />
    </MainLayout>
  );
}
