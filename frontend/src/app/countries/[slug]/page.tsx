import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import CountryPageClient from './CountryPageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== 'vietnam') {
    return { title: 'Vietnam eSIM Plans' };
  }

  return {
    title: 'Vietnam eSIM Plans – Affordable Data for Travelers',
    description: 'Buy Vietnam eSIM online. 4G/5G data plans with hotspot. QR code delivered by email within 24 hours.',
    openGraph: {
      title: 'Vietnam eSIM Plans – eSIM Viet',
      description: 'Affordable Vietnam eSIM plans. Fast 4G/5G, hotspot included.',
    },
  };
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  if (slug !== 'vietnam') {
    redirect('/countries/vietnam');
  }

  return (
    <MainLayout>
      <CountryPageClient slug={slug} />
    </MainLayout>
  );
}
