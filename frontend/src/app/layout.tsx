import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'eSIM Viet – Buy Vietnam eSIM Online',
    template: '%s | eSIM Viet',
  },
  description:
    'Buy Vietnam eSIM online. Affordable 4G/5G data plans for travelers. QR code delivered by email within 24 hours.',
  keywords: ['Vietnam eSIM', 'eSIM Vietnam', 'Vietnam travel SIM', 'buy eSIM Vietnam', 'Vietnam data plan'],
  authors: [{ name: 'eSIM Viet' }],
  creator: 'eSIM Viet',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'eSIM Viet',
    title: 'eSIM Viet – Buy Vietnam eSIM Online',
    description: 'Affordable Vietnam eSIM data plans for travelers. 4G/5G networks, hotspot included.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eSIM Viet – Buy Vietnam eSIM Online',
    description: 'Affordable Vietnam eSIM data plans for travelers.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://esimviet.com'),
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
