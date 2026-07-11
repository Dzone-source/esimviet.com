'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Wifi } from 'lucide-react';
import type { Country } from '@/types';
import vietnamHeroImage from '../../../public/images/vietnam-hero.jpg';

const DEFAULT_HERO = vietnamHeroImage;

const LEGACY_COVER_PATHS = new Set(['/covers/vietnam.jpg', '/covers/vietnam.png']);

function resolveHeroImage(country: Country): string | typeof DEFAULT_HERO {
  const cover = country.cover_image?.trim();

  if (!cover || LEGACY_COVER_PATHS.has(cover)) {
    return DEFAULT_HERO;
  }

  if (cover.startsWith('http://') || cover.startsWith('https://')) {
    return cover;
  }

  if (cover.startsWith('/uploads/')) {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '') ||
      '';
    return `${siteUrl}${cover}`;
  }

  if (cover.startsWith('/images/')) {
    return cover;
  }

  return DEFAULT_HERO;
}

interface CountryHeroBannerProps {
  country: Country;
  planCount: number;
}

export default function CountryHeroBanner({ country, planCount }: CountryHeroBannerProps) {
  const heroImage = useMemo(() => resolveHeroImage(country), [country]);
  const [useFallback, setUseFallback] = useState(false);

  const imageSrc = useFallback
    ? DEFAULT_HERO
    : typeof heroImage === 'string'
      ? heroImage
      : DEFAULT_HERO;

  const isStaticImport = !useFallback && typeof heroImage !== 'string';

  return (
    <div className="relative min-h-[52vh] md:min-h-[58vh] flex items-end pb-12 overflow-hidden">
      {isStaticImport ? (
        <Image
          src={DEFAULT_HERO}
          alt={`${country.name} travel landscape`}
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc as string}
          alt={`${country.name} travel landscape`}
          className="absolute inset-0 h-full w-full object-cover object-center scale-105"
          onError={() => setUseFallback(true)}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-primary-950/92 via-primary-900/78 to-primary-800/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      <div className="pattern-overlay absolute inset-0 opacity-20" />

      <div className="container relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-6xl">{country.flag}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">{country.name}</h1>
              <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
                <MapPin className="w-4 h-4" />
                {country.region}
                <span className="w-1 h-1 bg-white/40 rounded-full" />
                <Wifi className="w-4 h-4" />
                {planCount} plan{planCount !== 1 ? 's' : ''} available
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="white" />
        </svg>
      </div>
    </div>
  );
}
