import { u } from '../lib/url';
/**
 * Instant site search (frontend). Matches names, SKUs and values such as
 * "2.5 sq mm", "32A MCB" or "9W B22", with typo tolerance and everyday
 * synonyms ("taar" → wire). Planned backend: Meilisearch (strategy §8.5).
 */
type Variant = { sku: string; label: string; text: string };
type Fam = { slug: string; name: string; series: string; category: string; url: string; img: string; text: string; variants: Variant[] };
type Cat = { name: string; url: string; text: string; count: number; img: string };
type Page = { title: string; url: string; text: string; group: 'Pages' | 'Downloads' };
type Data = { categories: Cat[]; families: Fam[]; pages: Page[]; synonyms: Record<string, string[]> };

let data: Promise<Data> | null = null;
export const loadCatalogue = () => (data ??= fetch(u('/catalogue.json')).then((r) => r.json()));

export function normalise(s: string): string {
  return s
    .toLowerCase()
    .replace(/sq\.?\s*mm|mm2|mm²|sqmm/g, ' sqmm ')
    .replace(/(\d)\s*(sqmm|wp|kwh|kw|ma|ka|a|w|k|m|v)\b/g, '$1 $2')
    .replace(/[^a-z0-9.ऀ-ॿ\s/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
const tokens = (s: string) => normalise(s).split(' ').filter(Boolean);

function lev(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    let rowMin = dp[0];
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
      rowMin = Math.min(rowMin, dp[j]);
    }
    if (rowMin > max) return max + 1;
  }
  return dp[b.length];
}

function tokenScore(q: string, hay: string[], fuzzy = true): number {
  let best = 0;
  for (const h of hay) {
    if (h === q) return 3;
    if (h.startsWith(q) && q.length >= 2) best = Math.max(best, 2);
    else if (/^\d/.test(q)) continue; // numbers must match exactly or by prefix
    else if (fuzzy && q.length >= 4) {
      const d = lev(q, h, q.length >= 7 ? 2 : 1);
      if (d <= (q.length >= 7 ? 2 : 1)) best = Math.max(best, 1);
    }
  }
  return best;
}

type Alt = { t: string[]; fuzzy: boolean };
function expand(query: string, syn: Record<string, string[]>): Alt[] {
  const n = normalise(query);
  const alts: Alt[] = [{ t: tokens(query), fuzzy: true }];
  for (const [k, vals] of Object.entries(syn)) {
    if (new RegExp(`(^|\\s)${k}(\\s|$)`).test(n)) {
      // Synonym expansions match exactly (no typo tolerance) to avoid noise.
      for (const v of vals) alts.push({ t: tokens(n.replace(k, v)), fuzzy: false });
    }
  }
  return alts;
}

function score(qs: Alt[], hay: string[], requireAll = true): number {
  let best = 0;
  for (const { t: q, fuzzy } of qs) {
    let s = 0;
    let hits = 0;
    for (const t of q) {
      const ts = tokenScore(t, hay, fuzzy);
      if (ts > 0) hits++;
      s += ts;
    }
    if (requireAll ? hits === q.length : hits >= Math.ceil(q.length / 2)) best = Math.max(best, s / q.length);
  }
  return best;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
function mark(text: string, q: string[]) {
  let out = esc(text);
  for (const t of q.filter((x) => x.length > 1)) {
    out = out.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>');
  }
  return out;
}

export type Results = { cats: Cat[]; fams: { f: Fam; v?: Variant }[]; pages: Page[]; downloads: Page[] };

export async function search(query: string): Promise<Results> {
  const d = await loadCatalogue();
  const qs = expand(query, d.synonyms);
  const cats = d.categories
    .map((c) => ({ c, s: score(qs, tokens(`${c.name} ${c.text}`)) }))
    .filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 3).map((x) => x.c);
  const fams = d.families
    .map((f) => {
      const famHay = tokens(`${f.text} ${f.variants.map((v) => v.sku).join(' ')}`);
      let s = score(qs, famHay);
      let bestV: Variant | undefined;
      let bestVs = 0;
      for (const v of f.variants) {
        const vs = score(qs, tokens(`${f.name} ${f.category} ${v.label} ${v.text} ${v.sku}`));
        if (vs > bestVs) { bestVs = vs; bestV = v; }
      }
      // Prefer showing a specific variant when the query names a value or SKU.
      const specific = /\d/.test(query) && bestVs >= s;
      s = Math.max(s, bestVs);
      return { f, v: specific ? bestV : undefined, s };
    })
    .filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 6);
  const pg = d.pages
    .map((p) => ({ p, s: score(qs, tokens(`${p.title} ${p.text}`), false) }))
    .filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
  return {
    cats,
    fams,
    pages: pg.filter((x) => x.p.group === 'Pages').slice(0, 4).map((x) => x.p),
    downloads: pg.filter((x) => x.p.group === 'Downloads').slice(0, 3).map((x) => x.p),
  };
}

export function renderResults(r: Results, query: string, isHi: boolean): string {
  const q = tokens(query);
  const icon = (d: string) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const page = icon('<path d="M7 3h7l5 5v11.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19.5v-15A1.5 1.5 0 0 1 7.5 3Z"/><path d="M14 3v5h5"/>');
  const dl = icon('<path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/>');
  const groups: string[] = [];
  const g = (title: string, rows: string[]) => rows.length && groups.push(`<div class="search-group"><p class="search-group__title">${title}</p>${rows.join('')}</div>`);
  g(isHi ? 'श्रेणियाँ' : 'Categories', r.cats.map((c) => `<a class="search-hit" href="${c.url}"><span class="search-hit__img"><img src="${c.img}" alt="" width="52" height="52"></span><span><strong>${mark(c.name, q)}</strong><span>${esc(c.text)}</span></span><span class="caption">${c.count}</span></a>`));
  g(isHi ? 'उत्पाद' : 'Products', r.fams.map(({ f, v }) => `<a class="search-hit" href="${f.url}${v ? `?v=${encodeURIComponent(v.sku)}` : ''}"><span class="search-hit__img"><img src="${f.img}" alt="" width="52" height="52"></span><span><strong>${mark(f.name, q)}</strong><span>${v ? `${mark(v.label, q)} · <span class="mono">${mark(v.sku, q)}</span>` : `${esc(f.category)} · ${f.variants.length} ${isHi ? 'विकल्प' : 'options'}`}</span></span></a>`));
  g(isHi ? 'पेज' : 'Pages', r.pages.map((p) => `<a class="search-hit" href="${p.url}"><span class="search-hit__img">${page}</span><span><strong>${mark(p.title, q)}</strong></span></a>`));
  g(isHi ? 'डाउनलोड' : 'Downloads', r.downloads.map((p) => `<a class="search-hit" href="${p.url}"><span class="search-hit__img">${dl}</span><span><strong>${mark(p.title, q)}</strong></span></a>`));
  if (!groups.length) {
    return `<div class="search-empty"><p><strong>${isHi ? 'हमें यह नहीं मिला।' : 'We couldn’t find that.'}</strong></p><p class="small">${isHi ? 'अपनी ज़रूरत हमें भेजें, हम जवाब देंगे।' : 'Send us your requirement and we’ll reply.'}</p><a class="btn btn--sm" href="${isHi ? u('/hi/contact/') : u('/contact/')}?intent=products&msg=${encodeURIComponent(query)}">${isHi ? 'ज़रूरत भेजें' : 'Send your requirement'}</a></div>`;
  }
  return groups.join('');
}

export function initSearch(dlg: HTMLDialogElement) {
  const input = dlg.querySelector<HTMLInputElement>('[data-search-input]')!;
  const out = dlg.querySelector<HTMLElement>('[data-search-results]')!;
  const initial = out.innerHTML;
  const isHi = document.documentElement.lang === 'hi';
  let seq = 0;
  let active = -1;
  void loadCatalogue();

  const run = async () => {
    const q = input.value.trim();
    const my = ++seq;
    if (q.length < 2) { out.innerHTML = initial; active = -1; return; }
    const r = await search(q);
    if (my !== seq) return;
    out.innerHTML = renderResults(r, q, isHi);
    active = -1;
  };
  let t = 0;
  input.addEventListener('input', () => { clearTimeout(t); t = window.setTimeout(run, 90); });
  out.addEventListener('click', (e) => {
    const s = (e.target as HTMLElement).closest<HTMLElement>('[data-search-suggest]');
    if (s) { input.value = s.dataset.searchSuggest!; void run(); input.focus(); }
  });
  input.addEventListener('keydown', (e) => {
    const hits = [...out.querySelectorAll<HTMLAnchorElement>('.search-hit')];
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!hits.length) return;
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + hits.length) % hits.length;
      hits.forEach((h, i) => h.classList.toggle('is-active', i === active));
      hits[active].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && active >= 0 && hits[active]) {
      e.preventDefault();
      location.href = hits[active].href;
    }
  });
}
