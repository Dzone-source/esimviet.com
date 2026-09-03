import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import fallbackManifest from '@/lib/heroPoolManifest.json';

export const dynamic = 'force-dynamic';

const BATCH_SIZE = 20;

type PoolImage = {
  id: string;
  src: string;
  blurDataURL: string;
};

type Manifest = {
  images?: PoolImage[];
  batchSize?: number;
  generatedAt?: string;
  cacheBust?: string;
};

function readLiveManifest(): Manifest {
  try {
    const livePath = path.join(process.cwd(), 'public', 'images', 'hero-pool', 'manifest.json');
    if (fs.existsSync(livePath)) {
      return JSON.parse(fs.readFileSync(livePath, 'utf8')) as Manifest;
    }
  } catch {
    // fall through to bundled manifest
  }
  return fallbackManifest as Manifest;
}

function getImages(): PoolImage[] {
  const manifest = readLiveManifest();
  return (manifest.images || []) as PoolImage[];
}

/**
 * GET /hero-pool/batch?cursor=0
 * Returns the next batch of 20 wallpapers (wraps around the pool).
 * Reads public/images/hero-pool/manifest.json at runtime so cron can refresh
 * images without rebuilding Next.js.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = Math.max(0, parseInt(searchParams.get('cursor') || '0', 10) || 0);
  const images = getImages();
  const batchSize = BATCH_SIZE;

  if (images.length === 0) {
    return NextResponse.json({ images: [], nextCursor: 0, total: 0, batchSize });
  }

  const batch: PoolImage[] = [];
  for (let i = 0; i < batchSize; i++) {
    batch.push(images[(cursor + i) % images.length]);
  }

  const nextCursor = (cursor + batchSize) % images.length;

  return NextResponse.json(
    {
      images: batch,
      nextCursor,
      total: images.length,
      batchSize,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
