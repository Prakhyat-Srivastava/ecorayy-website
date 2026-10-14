/**
 * Product page: variant chips update specs, SKU and the Quote List item
 * without a reload (strategy §8.4). ?v=SKU deep-links a variant (search,
 * shared lists). Gallery thumbnails + light on/off toggle (300 ms fade).
 */
type PV = { sku: string; label: string; sel: Record<string, string>; key: string[]; specs: string[][] };
type PD = { url: string; name: string; unit: { one: string; many: string; note?: string }; img: string; axes: string[]; variants: PV[] };

export function initProduct() {
  const root = document.querySelector<HTMLElement>('[data-product]');
  const raw = document.querySelector('[data-product-data]');
  if (!root || !raw) return;
  const d: PD = JSON.parse(raw.textContent || '{}');
  const qty = root.querySelector<HTMLInputElement>('#pqty')!;
  const unitEl = root.querySelector<HTMLElement>('[data-unit]')!;

  let current = d.variants.find((v) => v.sku === new URL(location.href).searchParams.get('v')) ?? d.variants[0];

  function render(v: PV, push = true) {
    current = v;
    root.querySelectorAll<HTMLButtonElement>('[data-axis]').forEach((b) => {
      const axis = b.dataset.axis!;
      const val = b.dataset.value!;
      b.setAttribute('aria-pressed', String(v.sel[axis] === val));
      // Mark values that don't exist with the other current selections.
      const exists = d.variants.some((x) => x.sel[axis] === val && d.axes.every((a) => a === axis || x.sel[a] === v.sel[a]));
      b.classList.toggle('is-unavailable', !exists);
      b.title = exists ? '' : 'Not available with the current selection, choosing it will adjust other options';
    });
    root.querySelectorAll<HTMLElement>('[data-axis-current]').forEach((s) => (s.textContent = v.sel[s.dataset.axisCurrent!]));
    root.querySelectorAll<HTMLElement>('[data-key]').forEach((el) => {
      const next = v.key[Number(el.dataset.key)];
      if (el.textContent !== next) {
        el.style.opacity = '0';
        window.setTimeout(() => { el.textContent = next; el.style.opacity = '1'; }, 120);
      }
    });
    root.querySelector<HTMLElement>('[data-sku]')!.textContent = v.sku;
    document.querySelectorAll<HTMLElement>('[data-spec]').forEach((td) => {
      const [g, r] = td.dataset.spec!.split('-').map(Number);
      td.textContent = v.specs[g]?.[r] ?? '-';
    });
    const item = { sku: v.sku, name: d.name, variant: v.label, unit: d.unit, img: d.img, url: `${d.url}?v=${v.sku}` };
    root.querySelectorAll<HTMLElement>('[data-add-quote], [data-quote-now]').forEach((b) => (b.dataset.item = JSON.stringify(item)));
    if (push) {
      const u = new URL(location.href);
      u.searchParams.set('v', v.sku);
      history.replaceState(null, '', u);
    }
  }

  root.addEventListener('click', (e) => {
    const chip = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-axis]');
    if (!chip) return;
    const axis = chip.dataset.axis!;
    const val = chip.dataset.value!;
    const want = { ...current.sel, [axis]: val };
    const exact = d.variants.find((x) => d.axes.every((a) => x.sel[a] === want[a]));
    // Otherwise keep as many other choices as possible.
    const fallback = d.variants
      .filter((x) => x.sel[axis] === val)
      .sort((a, b) => score(b, want) - score(a, want))[0];
    render(exact ?? fallback);
  });
  const score = (x: PV, want: Record<string, string>) => d.axes.filter((a) => x.sel[a] === want[a]).length;

  // Quantity stepper
  const unit = () => {
    const n = Math.max(1, parseInt(qty.value, 10) || 1);
    unitEl.textContent = `${n === 1 ? d.unit.one : d.unit.many}${d.unit.note ? ` · ${d.unit.note}` : ''}`;
  };
  root.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b) =>
    b.addEventListener('click', () => {
      qty.value = String(Math.min(9999, Math.max(1, (parseInt(qty.value, 10) || 1) + Number(b.dataset.step))));
      unit();
    }),
  );
  qty.addEventListener('input', unit);
  qty.addEventListener('change', () => { qty.value = String(Math.min(9999, Math.max(1, parseInt(qty.value, 10) || 1))); unit(); });

  // Gallery
  const slides = [...root.querySelectorAll<HTMLElement>('[data-slide]')];
  const thumbs = [...root.querySelectorAll<HTMLButtonElement>('[data-thumb]')];
  const power = root.querySelector<HTMLButtonElement>('[data-power]');
  const lit = power ? Number(power.dataset.lit) : -1;
  const show = (i: number) => {
    slides.forEach((s, j) => s.classList.toggle('is-active', i === j));
    thumbs.forEach((t, j) => t.setAttribute('aria-pressed', String(i === j)));
    if (power) {
      const on = i === lit;
      power.setAttribute('aria-checked', String(on));
      power.querySelector('[data-power-label]')!.textContent = on ? 'Light on' : 'Light off';
      power.closest('.gallery__main')!.classList.toggle('is-lit', on);
    }
  };
  thumbs.forEach((t) => t.addEventListener('click', () => show(Number(t.dataset.thumb))));
  power?.addEventListener('click', () => show(power.getAttribute('aria-checked') === 'true' ? 0 : lit));
  // Swipe between images on touch screens.
  const main = root.querySelector<HTMLElement>('[data-gallery-main]');
  let sx = 0;
  main?.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
  main?.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) < 40 || slides.length < 2) return;
    const cur = slides.findIndex((s) => s.classList.contains('is-active'));
    show((cur + (dx < 0 ? 1 : -1) + slides.length) % slides.length);
  });

  render(current, false);
}
