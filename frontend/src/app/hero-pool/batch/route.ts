import { NextResponse } from 'next/server';
import manifest from '@/lib/heroPoolManifest.json';

export const dynamic = 'force-dynamic';

const BATCH_SIZE = 20;

type PoolImage = {
  id: string;
  src: string;
  blurDataURL: string;
};

function getImages(): PoolImage[] {
  return (manifest.images || []) as PoolImage[];
}

/**
 * GET /hero-pool/batch?cursor=0
 * Returns the next batch of 20 wallpapers (wraps around the pool).
 * Path is outside /api so nginx still proxies product API to the backend.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = Math.max(0, parseInt(searchParams.get('cursor') || '0', 10) || 0);
  const images = getImages();

  if (images.length === 0) {
    return NextResponse.json({ images: [], nextCursor: 0, total: 0, batchSize: BATCH_SIZE });
  }

  const batch: PoolImage[] = [];
  for (let i = 0; i < BATCH_SIZE; i++) {
    batch.push(images[(cursor + i) % images.length]);
  }

  const nextCursor = (cursor + BATCH_SIZE) % images.length;

  return NextResponse.json(
    {
      images: batch,
      nextCursor,
      total: images.length,
      batchSize: BATCH_SIZE,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
