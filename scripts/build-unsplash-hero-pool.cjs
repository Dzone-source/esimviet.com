#!/usr/bin/env node
/**
 * Convert downloaded Unsplash JPGs into 2560x1440 WebP hero-pool + manifest.
 * Run after scripts/sync-unsplash-hero-pool.sh
 */
const sharp = require(require('path').join(__dirname, '../frontend/node_modules/sharp'));
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IDS_FILE = path.join(__dirname, 'unsplash-vietnam-ids.txt');
const DL = path.join(process.env.TMPDIR || '/tmp', 'esimviet-unsplash-dl');
const OUT = path.join(ROOT, 'frontend/public/images/hero-pool');

fs.mkdirSync(OUT, { recursive: true });
const ids = fs.readFileSync(IDS_FILE, 'utf8').trim().split('\n').filter((l) => l && !l.startsWith('#'));

(async () => {
  const results = [];
  let n = 0;
  for (const id of ids) {
    const input = path.join(DL, `${id}.jpg`);
    if (!fs.existsSync(input)) {
      console.warn('missing download:', id);
      continue;
    }
    n += 1;
    const slug = `unsplash-${String(n).padStart(2, '0')}-${id.replace(/^photo-/, '')}`;
    const outWebp = path.join(OUT, `${slug}.webp`);
    await sharp(input).rotate().resize(2560, 1440, { fit: 'cover', position: 'centre' }).webp({ quality: 78, effort: 5 }).toFile(outWebp);
    const blurBuf = await sharp(input).rotate().resize(24, 14, { fit: 'cover' }).webp({ quality: 35 }).toBuffer();
    results.push({
      id: slug,
      src: `/images/hero-pool/${slug}.webp`,
      blurDataURL: `data:image/webp;base64,${blurBuf.toString('base64')}`,
      unsplashId: id,
    });
    console.log(slug, Math.round(fs.statSync(outWebp).size / 1024) + 'KB');
  }
  const manifest = {
    version: 2,
    batchSize: 20,
    source: 'https://unsplash.com/s/photos/vietnam',
    license: 'https://unsplash.com/license',
    generatedAt: new Date().toISOString(),
    count: results.length,
    images: results,
  };
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(ROOT, 'frontend/src/lib/heroPoolManifest.json'), JSON.stringify(manifest));
  fs.writeFileSync(
    path.join(OUT, 'CREDITS.md'),
    [
      '# Hero wallpaper credits',
      '',
      'Photos from [Unsplash — Vietnam](https://unsplash.com/s/photos/vietnam).',
      'License: [Unsplash License](https://unsplash.com/license).',
      '',
      ...results.map((r) => `- ${r.id}: https://images.unsplash.com/${r.unsplashId}`),
      '',
    ].join('\n')
  );
  console.log('Done:', results.length, 'images');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
