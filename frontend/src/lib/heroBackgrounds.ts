/** Shared Vietnam wallpaper pool for homepage + country heroes (WebP + LQIP) */

export type HeroBackground = {
  id: string;
  src: string;
  blurDataURL: string;
};

export const HERO_BACKGROUNDS: readonly HeroBackground[] = [
  {
    id: 'ha-giang',
    src: '/images/hero/ha-giang.webp',
    blurDataURL: 'data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAAAwBACdASoYAA4APwFqrE8rJiQiMAgBYCAJZgC7ACENvNzzP7ItIVwMl3AA/uMTpwUdeqkb+V89XXgC+QO2chybFUNQpncaeKZ6H2cTrfV9lJxFIVkZ+Lt8d7PDW67hpfaUNgjvIu4q5YkkGbAoR4uUW+VAWBpSQEzlipIUKpy3kJcAAAA=',
  },
  {
    id: 'halong-bay',
    src: '/images/hero/halong-bay.webp',
    blurDataURL: 'data:image/webp;base64,UklGRpgAAABXRUJQVlA4IIwAAADQAwCdASoYAA4APwFqrE8rJiQiMAgBYCAJQBdg1gAeQq+UlBicSUgA/t6X7LZqInOZZXc9XHhoIQPliApkpIQoJ4vbomjEFGIhP13JqcWMpgzR3JpnMLlbHXZkPiHsxBCYBuGso+/ds2gmKj9Cc02+qO1FcFTg6gMiuErpWtRwVVuyxrh4Zv41tlnAAA==',
  },
  {
    id: 'rice-terraces',
    src: '/images/hero/rice-terraces.webp',
    blurDataURL: 'data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAADwAwCdASoYAA4APwFqrE6rJiQiMAgBYCAJYwC2yCGfZtklEXK21NUAAP7Dhy/ztFwyfetw5wnB2Sih7Ot06/iDZyFD7I5T5pgVhSTuI2CvGaAE53ITTcMTTrwsNgbOfethb29PLtw2+oL8vOXKS6fGLi38lLZld4lWRZce6Jxytdci/r6mAAAA',
  },
  {
    id: 'vietnam-coast',
    src: '/images/hero/vietnam-coast.webp',
    blurDataURL: 'data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAACQBACdASoYAA4APwForE6rJaQiMAgBYCAJagCdMoMljEmnhfW58t7Z4yld8nAA957DUBt2EtmPVrGpewZqyreGF/bB0t3cl75bjm/vnXpemCdbtqcaG6S2wyN6Y9ZL7LZFzmMws9jUD/sRlJ0YpLmTZnANhXNKV17VneE2uyck5msAAAA=',
  },
  {
    id: 'hero-halong-golden',
    src: '/images/hero/hero-halong-golden.webp',
    blurDataURL: 'data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAADwAwCdASoYAA4APwFqrE8rJiQiMAgBYCAJZACdABZY6X1ui8DPNUAYAP4kkO17eqlaASWqVcEC7Af2+Ll9SQcHzDoD1dT4tp01UoclU3fGxJW1VHAPnHgOZqGUUItUcibyheMJY0s813YxiiQ39XoUXluYZIB1XorYAA==',
  },
  {
    id: 'hero-ha-giang-sunset',
    src: '/images/hero/hero-ha-giang-sunset.webp',
    blurDataURL: 'data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAABQBACdASoYAA4APwFqrE6rJiQiMAgBYCAJZgCdEftgMki4pyYNcBl+H7fAAN4NLY2quDityQGfKpQGXuJZpNavvadaCdzK8ZBY/DJoU76U9LwPEtGhYcJRj4RSDJqRjNcgySGZbbrLwDj7TDifaxhhZc3381WFIbVGU2aFleKZru8gAAA=',
  },
] as const;

const STORAGE_KEY = 'esimviet_hero_bg';

export function pickRandomHeroBackground(): HeroBackground {
  return HERO_BACKGROUNDS[Math.floor(Math.random() * HERO_BACKGROUNDS.length)];
}

/** Stable pick for this browser session — avoids double-load + flash on navigate. */
export function getSessionHeroBackground(): HeroBackground {
  if (typeof window === 'undefined') {
    return HERO_BACKGROUNDS[0];
  }

  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const found = HERO_BACKGROUNDS.find((item) => item.id === saved);
      if (found) return found;
    }
  } catch {
    // private mode / blocked storage
  }

  const picked = pickRandomHeroBackground();
  try {
    sessionStorage.setItem(STORAGE_KEY, picked.id);
  } catch {
    // ignore
  }
  return picked;
}
