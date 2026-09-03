'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  type HeroBackground,
  getSessionHeroBackground,
} from '@/lib/heroBackgrounds';

type Props = {
  alt: string;
  className?: string;
};

/**
 * Loads exactly one session-stable hero wallpaper (no double-fetch).
 * Shows a dark base + blur LQIP until the WebP arrives.
 */
export default function HeroBackgroundImage({ alt, className = '' }: Props) {
  const [bg, setBg] = useState<HeroBackground | null>(null);

  useEffect(() => {
    setBg(getSessionHeroBackground());
  }, []);

  return (
    <div className={`absolute inset-0 bg-[#0b1a2e] ${className}`}>
      {bg ? (
        <Image
          src={bg.src}
          alt={alt}
          fill
          priority
          placeholder="blur"
          blurDataURL={bg.blurDataURL}
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1600px"
          quality={75}
        />
      ) : null}
    </div>
  );
}
