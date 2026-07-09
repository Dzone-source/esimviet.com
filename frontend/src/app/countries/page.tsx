import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Vietnam eSIM Plans – Affordable Data for Travelers',
  description: 'Browse affordable Vietnam eSIM data plans. 4G/5G networks, hotspot included, QR code delivered by email.',
};

export default function CountriesPage() {
  redirect('/countries/vietnam');
}
