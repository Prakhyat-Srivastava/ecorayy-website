/**
 * Launch gate (planning/01_Website_Plan.md §10, decision D8).
 * Scans the built site for sample content, placeholder images and
 * placeholder contact details. Exits with code 1 if anything remains.
 *
 *   npm run build && npm run check:launch
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) { console.error('Run `npm run build` first.'); process.exit(2); }

const checks = [
  { name: 'Sample-content markers', re: /data-sample="([^"]*)"/g },
  { name: 'Placeholder product images', re: /data-tier="placeholder"/g },
  { name: 'Placeholder phone number', re: /00000 00000/g },
  { name: 'Placeholder domain', re: /ecorayy\.example/g },
  { name: 'Unconfirmed text', re: /\[To be confirmed\]|\[Retention period to be confirmed\.\]/g },
];
const found = new Map(checks.map((c) => [c.name, new Map()]));
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
for (const file of walk(dist).filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  const page = '/' + path.relative(dist, file).replace(/index\.html$/, '');
  for (const c of checks) {
    for (const m of html.matchAll(c.re)) {
      const key = m[1] ?? m[0];
      const bucket = found.get(c.name);
      bucket.set(key, (bucket.get(key) ?? new Set()).add(page));
    }
  }
}
let total = 0;
for (const [name, items] of found) {
  if (!items.size) continue;
  console.log(`\n✗ ${name}`);
  for (const [key, pages] of items) {
    total++;
    const list = [...pages];
    console.log(`  • ${key}  (${list.length} page${list.length === 1 ? '' : 's'}, e.g. ${list.slice(0, 3).join(', ')})`);
  }
}
if (total) {
  console.log(`\n${total} item(s) must be replaced before launch. See planning/02_Content_Update_Checklist.md.\n`);
  process.exit(1);
}
console.log('✓ No sample content or placeholders found. Ready for launch review.');
