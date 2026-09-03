/** Client-side hero wallpaper rotation: 20 active + 20 reserve (prefetched). */

export type HeroPoolImage = {
  id: string;
  src: string;
  blurDataURL: string;
};

type HeroPoolState = {
  active: HeroPoolImage[];
  reserve: HeroPoolImage[];
  seen: string[];
  cursor: number;
};

const STORAGE_KEY = 'esimviet_hero_pool_v3';
const BATCH_SIZE = 20;

function readState(): HeroPoolState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HeroPoolState;
  } catch {
    return null;
  }
}

function writeState(state: HeroPoolState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // private mode / quota
  }
}

async function fetchBatch(cursor: number): Promise<{ images: HeroPoolImage[]; nextCursor: number }> {
  const res = await fetch(`/hero-pool/batch?cursor=${cursor}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load hero batch');
  const data = await res.json();
  return {
    images: (data.images || []) as HeroPoolImage[],
    nextCursor: typeof data.nextCursor === 'number' ? data.nextCursor : cursor + BATCH_SIZE,
  };
}

/** Warm browser cache for reserve images so the next cycle is instant. */
export function prefetchHeroImages(images: HeroPoolImage[]) {
  if (typeof window === 'undefined') return;
  for (const img of images) {
    const el = new window.Image();
    el.decoding = 'async';
    el.src = img.src;
  }
}

/**
 * Pick one wallpaper for this page load.
 * - Uses 20 active images; tracks which ones were already shown.
 * - When all 20 active have been used, promotes the 20 reserve images
 *   and prefetches the next 20 into reserve.
 */
export async function pickRotatingHeroBackground(): Promise<HeroPoolImage | null> {
  if (typeof window === 'undefined') return null;

  let state = readState();

  // Bootstrap: load active + reserve
  if (!state || state.active.length === 0) {
    const first = await fetchBatch(0);
    const second = await fetchBatch(first.nextCursor);
    state = {
      active: first.images,
      reserve: second.images,
      seen: [],
      cursor: second.nextCursor,
    };
    writeState(state);
    prefetchHeroImages(state.active);
    prefetchHeroImages(state.reserve);
  }

  let remaining = state.active.filter((img) => !state!.seen.includes(img.id));

  // Active batch exhausted → promote reserve, fetch next 20 into reserve
  if (remaining.length === 0) {
    if (state.reserve.length === 0) {
      const refill = await fetchBatch(state.cursor);
      state.reserve = refill.images;
      state.cursor = refill.nextCursor;
    }

    state.active = state.reserve;
    state.seen = [];
    remaining = [...state.active];

    try {
      const next = await fetchBatch(state.cursor);
      state.reserve = next.images;
      state.cursor = next.nextCursor;
      prefetchHeroImages(state.reserve);
    } catch {
      state.reserve = [];
    }

    writeState(state);
  }

  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.seen = [...state.seen, pick.id];
  writeState(state);

  // Keep warming the unused active + reserve images in the background
  prefetchHeroImages(state.active.filter((img) => img.id !== pick.id));
  if (state.reserve.length) prefetchHeroImages(state.reserve);

  return pick;
}
