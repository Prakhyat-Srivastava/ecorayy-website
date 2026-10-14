/**
 * Category filtering (strategy §8.2–8.3, Baymard findings):
 * promoted filters as chips, every filter explained, applied filters as
 * removable chips, multi-select within a filter, instant counts, zero-result
 * options greyed out, state in the URL so a filtered view can be shared.
 */
type V = { sku: string; label: string; v: Record<string, string> };
type Fam = { slug: string; name: string; order: number; isNew: boolean; unit: unknown; img: string; url: string; variants: V[] };
type Data = { attrs: { key: string; label: string; numeric: boolean }[]; sortKey: string | null; families: Fam[] };

const num = (s?: string) => (s ? parseFloat(s.replace(/,/g, '')) : NaN);

export function initCatalogue() {
  const root = document.querySelector<HTMLElement>('[data-catalogue]');
  const raw = document.querySelector('[data-catalogue-data]');
  if (!root || !raw) return;
  const data: Data = JSON.parse(raw.textContent || '{}');
  const keys = data.attrs.map((a) => a.key);
  const labelOf = Object.fromEntries(data.attrs.map((a) => [a.key, a.label]));
  const state = new Map<string, Set<string>>();
  const params = new URL(location.href).searchParams;
  for (const k of keys) {
    const v = params.get(k);
    if (v) state.set(k, new Set(v.split('|')));
  }
  let sort = params.get('sort') ?? 'rec';
  let view = params.get('view') === 'table' ? 'table' : 'grid';
  let tableSort: { key: string; dir: 1 | -1 } | null = null;

  const grid = root.querySelector<HTMLElement>('[data-grid]')!;
  const table = root.querySelector<HTMLElement>('[data-table]');
  const results = root.querySelector<HTMLElement>('[data-results]')!;
  const countEl = root.querySelector<HTMLElement>('[data-results-count]')!;
  const applied = root.querySelector<HTMLElement>('[data-applied]')!;
  const noResults = root.querySelector<HTMLElement>('[data-no-results]')!;
  const drawer = document.querySelector<HTMLDialogElement>('[data-filters-drawer]');
  const sortSel = root.querySelector<HTMLSelectElement>('[data-sort]')!;
  sortSel.value = sort;

  const matches = (v: V, except?: string) => {
    for (const [k, set] of state) {
      if (k === except || set.size === 0) continue;
      if (!set.has(v.v[k])) return false;
    }
    return true;
  };
  const famMatch = (f: Fam, except?: string) => f.variants.some((v) => matches(v, except));

  function syncUrl() {
    const u = new URL(location.href);
    for (const k of keys) {
      const s = state.get(k);
      if (s && s.size) u.searchParams.set(k, [...s].join('|'));
      else u.searchParams.delete(k);
    }
    sort === 'rec' ? u.searchParams.delete('sort') : u.searchParams.set('sort', sort);
    view === 'grid' ? u.searchParams.delete('view') : u.searchParams.set('view', view);
    history.replaceState(null, '', u);
  }

  function familySortValue(f: Fam): number {
    if (!data.sortKey) return 0;
    const vals = f.variants.filter((v) => matches(v)).map((v) => num(v.v[data.sortKey!])).filter((n) => !Number.isNaN(n));
    return vals.length ? Math.min(...vals) : Infinity;
  }

  function apply(animate = true) {
    if (animate) results.classList.add('is-updating');
    const visible = data.families.filter((f) => famMatch(f));
    const order = [...visible];
    if (sort === 'new') order.sort((a, b) => Number(b.isNew) - Number(a.isNew) || a.order - b.order);
    else if (sort === 'asc') order.sort((a, b) => familySortValue(a) - familySortValue(b));
    else if (sort === 'desc') order.sort((a, b) => familySortValue(b) - familySortValue(a));
    else if (sort === 'name') order.sort((a, b) => a.name.localeCompare(b.name));
    else order.sort((a, b) => a.order - b.order);

    const set = new Set(visible.map((f) => f.slug));
    grid.querySelectorAll<HTMLElement>('[data-family]').forEach((card) => {
      const slug = card.dataset.family!;
      card.classList.toggle('is-hidden', !set.has(slug));
      card.style.order = String(order.findIndex((f) => f.slug === slug));
      // "Add" on a card adds the first variant that matches the filters.
      const f = data.families.find((x) => x.slug === slug)!;
      const v = f.variants.find((x) => matches(x)) ?? f.variants[0];
      const btn = card.querySelector<HTMLElement>('[data-add-quote]');
      if (btn) btn.dataset.item = JSON.stringify({ sku: v.sku, name: f.name, variant: v.label, unit: f.unit, img: f.img, url: `${f.url}?v=${v.sku}` });
    });

    let vcount = 0;
    if (table) {
      const rows = [...table.querySelectorAll<HTMLTableRowElement>('tbody tr')];
      const byFam = new Map(data.families.map((f) => [f.slug, f]));
      rows.forEach((r) => {
        const f = byFam.get(r.dataset.family!)!;
        const v = f.variants.find((x) => x.sku === r.dataset.sku)!;
        const ok = matches(v);
        r.classList.toggle('is-hidden', !ok);
        if (ok) vcount++;
      });
      if (tableSort) {
        const { key, dir } = tableSort;
        const val = (r: HTMLTableRowElement) => (key === 'name' ? r.cells[0].textContent ?? '' : r.querySelector<HTMLElement>(`[data-k="${key}"]`)?.textContent ?? '');
        const numeric = data.attrs.find((a) => a.key === key)?.numeric;
        rows.sort((a, b) => {
          const x = val(a), y = val(b);
          return dir * (numeric ? num(x) - num(y) : x.localeCompare(y, 'en', { numeric: true }));
        });
        const tb = table.querySelector('tbody')!;
        rows.forEach((r) => tb.appendChild(r));
      }
    } else {
      vcount = visible.reduce((s, f) => s + f.variants.filter((v) => matches(v)).length, 0);
    }

    countEl.innerHTML = view === 'table'
      ? `<strong>${vcount}</strong> ${vcount === 1 ? 'variant' : 'variants'} in <strong>${visible.length}</strong> ${visible.length === 1 ? 'product' : 'products'}`
      : `<strong>${visible.length}</strong> ${visible.length === 1 ? 'product' : 'products'}${state.size ? ` · <span class="mono">${vcount}</span> matching variants` : ''}`;
    noResults.hidden = visible.length > 0;
    grid.hidden = view !== 'grid' || visible.length === 0;
    if (table) table.hidden = view !== 'table' || visible.length === 0;

    // Option counts + zero-result greying (counted against the other filters).
    document.querySelectorAll<HTMLLabelElement>('.fopt').forEach((opt) => {
      const input = opt.querySelector<HTMLInputElement>('input')!;
      const k = input.dataset.fkey!;
      const n = data.families.filter((f) => f.variants.some((v) => v.v[k] === input.value && matches(v, k))).length;
      input.checked = state.get(k)?.has(input.value) ?? false;
      opt.querySelector<HTMLElement>('[data-optcount]')!.textContent = String(n);
      opt.classList.toggle('is-zero', n === 0 && !input.checked);
      input.disabled = n === 0 && !input.checked;
    });
    // Chip badges
    let total = 0;
    document.querySelectorAll<HTMLElement>('[data-fchip]').forEach((c) => {
      const n = state.get(c.dataset.fchip!)?.size ?? 0;
      const badge = c.querySelector<HTMLElement>('[data-fcount]')!;
      badge.hidden = n === 0;
      badge.textContent = String(n);
      c.querySelector('.chip')!.classList.toggle('is-active', n > 0);
    });
    for (const s of state.values()) total += s.size;
    const allBadge = root.querySelector<HTMLElement>('[data-fcount-all]');
    if (allBadge) { allBadge.hidden = total === 0; allBadge.textContent = String(total); }
    drawer?.querySelector('[data-show-results]')?.replaceChildren(document.createTextNode(`Show ${view === 'table' ? vcount : visible.length} results`));

    // Applied chips
    applied.innerHTML = '';
    for (const [k, s] of state) {
      for (const val of s) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip';
        b.dataset.remove = `${k}::${val}`;
        b.setAttribute('aria-label', `Remove filter ${labelOf[k]}: ${val}`);
        b.innerHTML = `${labelOf[k]}: ${val}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`;
        applied.appendChild(b);
      }
    }
    if (total) {
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'clear';
      clear.dataset.clearFilters = '';
      clear.textContent = 'Clear all';
      applied.appendChild(clear);
    }
    syncUrl();
    if (animate) window.setTimeout(() => results.classList.remove('is-updating'), 150);
  }

  function toggle(k: string, val: string, on: boolean) {
    const s = state.get(k) ?? new Set<string>();
    on ? s.add(val) : s.delete(val);
    s.size ? state.set(k, s) : state.delete(k);
    apply();
  }

  document.addEventListener('change', (e) => {
    const input = (e.target as HTMLElement).closest<HTMLInputElement>('input[data-fkey]');
    if (input) toggle(input.dataset.fkey!, input.value, input.checked);
  });
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const rm = t.closest<HTMLElement>('[data-remove]');
    if (rm) { const [k, v] = rm.dataset.remove!.split('::'); toggle(k, v, false); return; }
    if (t.closest('[data-clear-filters]')) { state.clear(); apply(); return; }
    if (t.closest('[data-open-filters]')) { closePop(); drawer?.showModal(); return; }
  });

  // ---- popovers anchored to chips (bottom sheets on small screens via CSS)
  let openPop: HTMLElement | null = null;
  let openChip: HTMLElement | null = null;
  function closePop() {
    if (!openPop) return;
    openPop.hidden = true;
    openChip?.classList.remove('is-open');
    openChip?.querySelector('button')?.setAttribute('aria-expanded', 'false');
    openPop = openChip = null;
  }
  function placePop() {
    if (!openPop || !openChip) return;
    const r = openChip.getBoundingClientRect();
    const w = openPop.offsetWidth;
    openPop.style.left = `${Math.max(12, Math.min(r.left, innerWidth - w - 12))}px`;
    openPop.style.top = `${r.bottom + 8}px`;
  }
  document.querySelectorAll<HTMLElement>('[data-fchip]').forEach((chip) => {
    const btn = chip.querySelector('button')!;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pop = document.querySelector<HTMLElement>(`[data-fpop="${chip.dataset.fchip}"]`)!;
      if (openPop === pop) return closePop();
      closePop();
      pop.hidden = false;
      openPop = pop;
      openChip = chip;
      chip.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      placePop();
      pop.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus({ preventScroll: true });
    });
  });
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-fpop-close]')) return closePop();
    if (openPop && !openPop.contains(t)) closePop();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openPop) { const b = openChip?.querySelector('button'); closePop(); b?.focus(); }
  });
  window.addEventListener('scroll', placePop, { passive: true });
  window.addEventListener('resize', placePop);

  // ---- sort + view
  sortSel.addEventListener('change', () => { sort = sortSel.value; apply(); });
  root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.view === view));
    b.addEventListener('click', () => {
      view = b.dataset.view as 'grid' | 'table';
      root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      apply();
    });
  });
  // Tables collapse to the card list on small screens (hidden columns are worse than a list).
  const small = matchMedia('(max-width: 899px)');
  const onSmall = () => { if (small.matches && view === 'table') { view = 'grid'; apply(false); } };
  small.addEventListener('change', onSmall);
  onSmall();

  table?.querySelectorAll<HTMLButtonElement>('[data-tsort]').forEach((b) => {
    b.addEventListener('click', () => {
      const key = b.dataset.tsort!;
      tableSort = { key, dir: tableSort?.key === key && tableSort.dir === 1 ? -1 : 1 };
      table.querySelectorAll('th').forEach((th) => { th.removeAttribute('aria-sort'); const d = th.querySelector('[data-sort-dir]'); if (d) d.textContent = ''; });
      const th = b.closest('th')!;
      th.setAttribute('aria-sort', tableSort.dir === 1 ? 'ascending' : 'descending');
      const numeric = data.attrs.find((a) => a.key === key)?.numeric;
      const d = th.querySelector('[data-sort-dir]');
      if (d) d.textContent = numeric ? (tableSort.dir === 1 ? 'Smallest first' : 'Largest first') : (tableSort.dir === 1 ? 'A–Z' : 'Z–A');
      apply(false);
    });
  });

  apply(false);
}
