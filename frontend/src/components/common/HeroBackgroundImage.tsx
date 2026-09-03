'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  type HeroPoolImage,
  pickRotatingHeroBackground,
} from '@/lib/heroPoolRotation';
import { HERO_BACKGROUNDS } from '@/lib/heroBackgrounds';

type Props = {
  alt: string;
  className?: string;
};

/**
 * Random hero wallpaper with 20-active / 20-reserve rotation.
 * Falls back to the small static pool if the API is unavailable.
 */
export default function HeroBackgroundImage({ alt, className = '' }: Props) {
  const [bg, setBg] = useState<HeroPoolImage | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const picked = await pickRotatingHeroBackground();
        if (!cancelled && picked) {
          setBg(picked);
          return;
        }
      } catch {
        // fall through
      }

      if (!cancelled) {
        const fallback = HERO_BACKGROUNDS[Math.floor(Math.random() * HERO_BACKGROUNDS.length)];
        setBg(fallback);
      }
    })();

    return () => {
      cancelled = true;
    };
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
