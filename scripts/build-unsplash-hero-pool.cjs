#!/usr/bin/env node
/**
 * Convert downloaded Unsplash JPGs into 2560x1440 WebP hero-pool + manifest.
 *
 * Env:
 *   HERO_POOL_IDS_FILE   — ID list (default: scripts/unsplash-vietnam-ids.txt)
 *   HERO_POOL_SIZE       — max images to write (default: all / 40 for stable slots)
 *   HERO_POOL_STABLE_SLOTS=1 — write hero-01.webp … hero-NN.webp (overwrite in place)
 *   HERO_POOL_FORCE_CLEAN=1  — remove previous *.webp in pool dir before writing
 */
const sharp = require(require('path').join(__dirname, '../frontend/node_modules/sharp'));
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IDS_FILE = process.env.HERO_POOL_IDS_FILE || path.join(__dirname, 'unsplash-vietnam-ids.txt');
const DL = path.join(process.env.TMPDIR || '/tmp', 'esimviet-unsplash-dl');
const OUT = path.join(ROOT, 'frontend/public/images/hero-pool');
const STABLE = process.env.HERO_POOL_STABLE_SLOTS === '1';
const FORCE_CLEAN = process.env.HERO_POOL_FORCE_CLEAN === '1';
const POOL_SIZE = parseInt(process.env.HERO_POOL_SIZE || '0', 10) || 0;

fs.mkdirSync(OUT, { recursive: true });

let ids = fs
  .readFileSync(IDS_FILE, 'utf8')
  .trim()
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'));

if (POOL_SIZE > 0) ids = ids.slice(0, POOL_SIZE);

(async () => {
  if (FORCE_CLEAN) {
    for (const name of fs.readdirSync(OUT)) {
      if (name.endsWith('.webp')) fs.unlinkSync(path.join(OUT, name));
    }
  }

  const generatedAt = new Date().toISOString();
  const cacheBust = String(Math.floor(Date.now() / 1000));
  const results = [];
  let n = 0;

  for (const id of ids) {
    const input = path.join(DL, `${id}.jpg`);
    if (!fs.existsSync(input)) {
      console.warn('missing download:', id);
      continue;
    }
    n += 1;
    const slug = STABLE
      ? `hero-${String(n).padStart(2, '0')}`
      : `unsplash-${String(n).padStart(2, '0')}-${id.replace(/^photo-/, '')}`;
    const outWebp = path.join(OUT, `${slug}.webp`);

    // Atomic overwrite: write temp then rename
    const tmpOut = `${outWebp}.tmp`;
    await sharp(input)
      .rotate()
      .resize(2560, 1440, { fit: 'cover', position: 'centre' })
      .webp({ quality: 78, effort: 5 })
      .toFile(tmpOut);
    fs.renameSync(tmpOut, outWebp);

    const blurBuf = await sharp(input)
      .rotate()
      .resize(24, 14, { fit: 'cover' })
      .webp({ quality: 35 })
      .toBuffer();

    results.push({
      id: slug,
      src: `/images/hero-pool/${slug}.webp?v=${cacheBust}`,
      blurDataURL: `data:image/webp;base64,${blurBuf.toString('base64')}`,
      unsplashId: id,
    });
    console.log(slug, Math.round(fs.statSync(outWebp).size / 1024) + 'KB', id);
  }

  if (results.length === 0) {
    console.error('No images built — aborting without touching manifest');
    process.exit(1);
  }

  const manifest = {
    version: 3,
    batchSize: 20,
    source: 'https://unsplash.com/s/photos/vietnam',
    license: 'https://unsplash.com/license',
    generatedAt,
    cacheBust,
    count: results.length,
    images: results,
  };

  const manifestPretty = JSON.stringify(manifest, null, 2);
  const manifestMin = JSON.stringify(manifest);

  // Runtime source of truth for the Next.js route (no rebuild needed after cron)
  fs.writeFileSync(path.join(OUT, 'manifest.json'), manifestPretty);

  // Build-time fallback (skip on VPS cron so the git tree stays clean)
  if (process.env.HERO_POOL_SKIP_SRC_COPY !== '1') {
    fs.writeFileSync(path.join(ROOT, 'frontend/src/lib/heroPoolManifest.json'), manifestMin);
  }

  fs.writeFileSync(
    path.join(OUT, 'CREDITS.md'),
    [
      '# Hero wallpaper credits',
      '',
      'Photos from [Unsplash — Vietnam](https://unsplash.com/s/photos/vietnam).',
      'License: [Unsplash License](https://unsplash.com/license).',
      `Updated: ${generatedAt}`,
      '',
      ...results.map((r) => `- ${r.id}: https://images.unsplash.com/${r.unsplashId}`),
      '',
    ].join('\n')
  );

  console.log('Done:', results.length, 'images', 'v=' + cacheBust);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
