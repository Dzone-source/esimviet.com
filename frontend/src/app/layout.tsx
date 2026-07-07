import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'eSIM Global – Buy eSIM Online for Travel',
    template: '%s | eSIM Global',
  },
  description:
    'Buy eSIM online for travel. Instant delivery, affordable plans for 100+ countries. Stay connected worldwide with 4G/5G data.',
  keywords: ['eSIM', 'travel SIM', 'international data', 'buy eSIM online', 'travel internet'],
  authors: [{ name: 'eSIM Global' }],
  creator: 'eSIM Global',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'eSIM Global',
    title: 'eSIM Global – Buy eSIM Online for Travel',
    description: 'Buy eSIM online for travel. Instant delivery, affordable plans for 100+ countries.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eSIM Global – Buy eSIM Online for Travel',
    description: 'Affordable eSIM plans for 100+ countries. Stay connected worldwide.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://esimglobal.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
