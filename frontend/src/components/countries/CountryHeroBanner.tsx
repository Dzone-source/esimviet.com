'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Wifi } from 'lucide-react';
import type { Country } from '@/types';
import { HERO_BACKGROUNDS, pickRandomHeroBackground } from '@/lib/heroBackgrounds';

interface CountryHeroBannerProps {
  country: Country;
  planCount: number;
}

export default function CountryHeroBanner({ country, planCount }: CountryHeroBannerProps) {
  const [bgSrc, setBgSrc] = useState<string>(HERO_BACKGROUNDS[0]);

  useEffect(() => {
    setBgSrc(pickRandomHeroBackground());
  }, []);

  return (
    <div className="relative min-h-[52vh] md:min-h-[58vh] flex items-end pb-12 overflow-hidden pt-16">
      <motion.div
        key={bgSrc}
        className="absolute inset-0"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <Image
          src={bgSrc}
          alt={`${country.name} travel landscape`}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/25" />

      <div className="container relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-6xl drop-shadow-lg">{country.flag}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">{country.name}</h1>
              <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
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
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" aria-hidden>
          <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="white" />
        </svg>
      </div>
    </div>
  );
}
