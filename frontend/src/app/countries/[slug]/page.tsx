import type { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import CountryPageClient from './CountryPageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${name} eSIM – Affordable Data Plans`,
    description: `Buy eSIM for ${name}. 4G/5G data plans with hotspot. Stay connected during your ${name} trip.`,
    openGraph: {
      title: `${name} eSIM Plans – eSIM Global`,
      description: `Affordable eSIM plans for ${name}. Fast 4G/5G, hotspot included.`,
    },
  };
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  return (
    <MainLayout>
      <CountryPageClient slug={slug} />
    </MainLayout>
  );
}
