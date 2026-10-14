/**
 * Copies the delivered image assets into src/assets, downscaled to their real
 * (native) resolution so builds stay fast. The delivered PNGs were upscaled
 * from ~1254 px; nothing above ~1600 px carries real detail.
 *
 * Logo: only the empty white canvas around the lockup is trimmed. The logo
 * itself is never redrawn, recoloured or cropped into.
 *
 * Usage: node scripts/prepare-assets.mjs [path-to-incoming]
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const incoming = path.resolve(process.argv[2] ?? '../_incoming');
const out = path.resolve('src/assets');
const src = (...p) => path.join(incoming, ...p);

const groups = {
  'assets/ecorayy-assets': [
    '01-brand', '02-home', '03-sun-to-switch', '04-solar', '05-infrastructure',
    '06-products', '07-product-samples', '08-partners', '09-downloads',
  ],
  'portraits/ecorayy-assets': ['10-directors'],
};

async function writeJpeg(input, file, { width, height }) {
  await sharp(input)
    .resize({ width, height, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(file);
}

let count = 0;
for (const [base, folders] of Object.entries(groups)) {
  for (const folder of folders) {
    const dir = src(base, folder);
    const target = path.join(out, 'images', folder);
    fs.mkdirSync(target, { recursive: true });
    for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.png'))) {
      const meta = await sharp(path.join(dir, name)).metadata();
      const ratio = meta.width / meta.height;
      // Wide (21:9) keep 2400 wide; portraits 1600 wide; squares 1600.
      const box = ratio > 1.5 ? { width: 2400 } : ratio < 0.9 ? { width: 1600 } : { width: 1600 };
      await writeJpeg(path.join(dir, name), path.join(target, name.replace('.png', '.jpg')), box);
      count++;
    }
  }
}
console.log(`images: ${count}`);

// ---- Logo -----------------------------------------------------------------
const logoSrc = src('assets/ecorayy-assets/_logo/ecorayy-original-logo.png');
const brand = path.join(out, 'brand');
fs.mkdirSync(path.join(brand, 'original'), { recursive: true });
fs.copyFileSync(logoSrc, path.join(brand, 'original', 'ecorayy-original-logo.png'));

// Trim only the surrounding white canvas, then add a small even margin back.
const trimmed = await sharp(logoSrc).trim({ threshold: 12 }).toBuffer();
await sharp(trimmed)
  .extend({ top: 8, bottom: 8, left: 8, right: 8, background: '#ffffff' })
  .png()
  .toFile(path.join(brand, 'ecorayy-logo-lockup.png'));

// ---- Temporary favicon from the mark (exact pixels, no redraw) -------------
// Replace with the designer's mark-only SVG when it arrives (checklist A2).
const markRegion = await sharp(logoSrc).extract({ left: 0, top: 0, width: 580, height: 656 }).toBuffer();
const mark = await sharp(markRegion).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
const side = Math.max(mark.info.width, mark.info.height);
const squared = await sharp(mark.data)
  .resize(side, side, { fit: 'contain', background: '#ffffff' })
  .toBuffer();
const circle = Buffer.from(
  `<svg width="${side}" height="${side}"><circle cx="${side / 2}" cy="${side / 2}" r="${side / 2}" fill="#fff"/></svg>`,
);
const masked = await sharp(squared).ensureAlpha().composite([{ input: circle, blend: 'dest-in' }]).png().toBuffer();
fs.mkdirSync('public', { recursive: true });
for (const [size, name] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png'], [512, 'icon-512.png']]) {
  await sharp(masked).resize(size, size).png().toFile(path.join('public', name));
}

// ---- Director circle crops (centred on each face) --------------------------
// Coordinates measured on the 2400 x 3000 masters.
const dirSrc = (f) => src('portraits/ecorayy-assets/10-directors', f);
const crops = [
  ['dir-01-yy-singh-director-portrait.png', 'dir-01-yy-singh-circle.jpg', { left: 230, top: 60, width: 1700, height: 1700 }],
  ['dir-02-rama-yadav-director-portrait.png', 'dir-02-rama-yadav-circle.jpg', { left: 221, top: 60, width: 1550, height: 1550 }],
];
for (const [from, to, area] of crops) {
  await sharp(dirSrc(from)).extract(area).resize(800, 800)
    .jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(out, 'images', '10-directors', to));
}
console.log('logo, favicon and director crops written');
