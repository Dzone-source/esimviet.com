/** Shared Vietnam wallpaper pool for homepage + country heroes */

export const HERO_BACKGROUNDS = [
  '/images/hero/ha-giang.jpg',
  '/images/hero/halong-bay.jpg',
  '/images/hero/halong-sky.jpg',
  '/images/hero/rice-terraces.jpg',
  '/images/hero/vietnam-coast.jpg',
  '/images/hero/hero-halong-golden.jpg',
  '/images/hero/hero-rice-sunrise.jpg',
  '/images/hero/hero-ha-giang-sunset.jpg',
] as const;

export function pickRandomHeroBackground(): string {
  return HERO_BACKGROUNDS[Math.floor(Math.random() * HERO_BACKGROUNDS.length)];
}
