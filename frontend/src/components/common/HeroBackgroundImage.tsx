'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  type HeroBackground,
  pickRandomHeroBackground,
} from '@/lib/heroBackgrounds';

type Props = {
  alt: string;
  className?: string;
};

/**
 * Picks a random Vietnam wallpaper on each page load (one image request).
 * Dark base + blur LQIP until WebP arrives.
 */
export default function HeroBackgroundImage({ alt, className = '' }: Props) {
  const [bg, setBg] = useState<HeroBackground | null>(null);

  useEffect(() => {
    setBg(pickRandomHeroBackground());
  }, []);

  return (
    <div className={`absolute inset-0 bg-[#0b1a2e] ${className}`}>
      {bg ? (
        <Image
          key={bg.id}
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
