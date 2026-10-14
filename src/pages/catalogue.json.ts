import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { allFamilies, categories, categoryUrl, familyUrl, familiesIn, SYNONYMS } from '../data/products';
import { images } from '../data/images';
import { searchPages } from '../data/pages-index';
import { u } from '../lib/url';

/**
 * Build-time JSON used by search and by shared Quote List links.
 * When a CMS/search backend (Sanity + Meilisearch) is connected, this
 * endpoint is the single thing to replace.
 */
export const GET: APIRoute = async () => {
  const thumbs = new Map<string, string>();
  const thumb = async (id: keyof typeof images) => {
    if (!thumbs.has(id)) thumbs.set(id, (await getImage({ src: images[id].src, width: 160, height: 160, fit: 'cover', format: 'webp', quality: 70 })).src);
    return thumbs.get(id)!;
  };

  const cats = [];
  for (const c of categories) {
    cats.push({ name: c.name, url: categoryUrl(c.slug), text: c.short, count: familiesIn(c.slug).length, img: await thumb(c.image) });
    for (const s of c.subs ?? []) {
      cats.push({ name: s.name, url: categoryUrl(c.slug, s.slug), text: `${c.name} · ${s.short}`, count: familiesIn(c.slug, s.slug).length, img: await thumb(s.image) });
    }
  }

  const families = [];
  for (const f of allFamilies) {
    const cat = categories.find((c) => c.slug === f.category)!;
    families.push({
      slug: f.slug,
      name: f.name,
      series: f.series,
      category: cat.name,
      url: familyUrl(f),
      img: await thumb(f.image),
      unit: f.unit,
      text: [f.name, f.series, f.benefit, cat.name, f.sub ?? ''].join(' '),
      variants: f.variants.map((v) => ({ sku: v.sku, label: v.label, text: Object.values(v.v).join(' ') })),
    });
  }

  return new Response(JSON.stringify({ categories: cats, families, pages: searchPages.map((p) => ({ ...p, url: u(p.url) })), synonyms: SYNONYMS }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
