import { u } from '../lib/url';
import * as quote from './quote-store';
import { toast, announce } from './toast';

const isHi = document.documentElement.lang === 'hi';
const L = isHi
  ? { added: 'कोटेशन सूची में जोड़ा गया', view: 'सूची देखें', removed: 'हटाया गया', undo: 'वापस लें', cleared: 'सूची साफ़ की गई', copied: 'लिंक कॉपी हो गया', items: (n: number) => `${n} आइटम`, remove: 'हटाएँ', dec: 'कम करें', inc: 'बढ़ाएँ', qty: 'मात्रा' }
  : { added: 'Added to Quote List', view: 'View list', removed: 'Removed', undo: 'Undo', cleared: 'Quote List cleared', copied: 'Link copied, paste it into WhatsApp or email', items: (n: number) => `${n} ${n === 1 ? 'item' : 'items'}`, remove: 'Remove', dec: 'Decrease', inc: 'Increase', qty: 'Quantity' };

const drawer = document.querySelector<HTMLDialogElement>('[data-quote-drawer]');
const list = drawer?.querySelector<HTMLUListElement>('[data-quote-items]');

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function renderBadges(bump = false) {
  const n = quote.count();
  document.querySelectorAll<HTMLElement>('[data-quote-count]').forEach((b) => {
    b.textContent = String(n);
    b.dataset.count = String(n);
    if (bump) { b.classList.remove('is-bumping'); void b.offsetWidth; b.classList.add('is-bumping'); }
  });
}

function renderDrawer() {
  if (!drawer || !list) return;
  const s = quote.snapshot();
  const empty = s.items.length === 0;
  drawer.querySelector<HTMLElement>('[data-quote-empty]')!.hidden = !empty;
  drawer.querySelector<HTMLElement>('[data-quote-foot]')!.hidden = empty;
  drawer.querySelector<HTMLElement>('[data-quote-note-wrap]')!.hidden = empty;
  const note = drawer.querySelector<HTMLTextAreaElement>('[data-quote-note]')!;
  if (document.activeElement !== note) note.value = s.note;
  list.innerHTML = s.items.map((i) => `
    <li class="ql-item" data-sku="${esc(i.sku)}">
      <a class="ql-item__img" href="${esc(i.url)}" tabindex="-1" aria-hidden="true">${i.img ? `<img src="${esc(i.img)}" alt="" width="72" height="72" loading="lazy">` : ''}</a>
      <div class="ql-item__main">
        <a class="ql-item__name" href="${esc(i.url)}">${esc(i.name)}</a>
        <span class="ql-item__variant">${esc(i.variant)}</span>
        <span class="ql-item__sku mono">${esc(i.sku)}</span>
        <div class="ql-item__row">
          <div class="qty qty--sm" role="group" aria-label="${L.qty}">
            <button type="button" data-q="-1" aria-label="${L.dec}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg></button>
            <input type="number" inputmode="numeric" min="1" max="9999" value="${i.qty}" aria-label="${L.qty}" data-q-input>
            <button type="button" data-q="1" aria-label="${L.inc}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
          </div>
          <span class="qty__unit">${esc(quote.unitLabel(i.unit, i.qty))}${i.unit.note ? ` · ${esc(i.unit.note)}` : ''}</span>
        </div>
      </div>
      <button class="icon-btn ql-item__remove" type="button" data-remove aria-label="${L.remove} ${esc(i.name)}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </li>`).join('');
}

function render(bump = false) {
  renderBadges(bump);
  renderDrawer();
}

export function openDrawer() {
  if (!drawer) return;
  renderDrawer();
  drawer.showModal();
}

function itemFrom(el: HTMLElement): Omit<quote.QuoteItem, 'qty'> | null {
  try { return JSON.parse(el.dataset.item || 'null'); } catch { return null; }
}
function qtyFrom(el: HTMLElement): number {
  const sel = el.dataset.qtyFrom;
  const input = sel ? document.querySelector<HTMLInputElement>(sel) : null;
  return input ? Math.max(1, parseInt(input.value, 10) || 1) : 1;
}

function morph(btn: HTMLElement) {
  const label = btn.querySelector<HTMLElement>('[data-label]');
  if (!label) return;
  const original = label.dataset.original ?? label.textContent ?? '';
  label.dataset.original = original;
  btn.classList.add('is-added');
  label.textContent = isHi ? 'जोड़ा गया ✓' : 'Added ✓';
  clearTimeout(Number(btn.dataset.t));
  btn.dataset.t = String(window.setTimeout(() => { btn.classList.remove('is-added'); label.textContent = original; }, 2200));
}

document.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;

  const addBtn = t.closest<HTMLElement>('[data-add-quote]');
  if (addBtn) {
    e.preventDefault();
    const item = itemFrom(addBtn);
    if (!item) return;
    quote.add(item, qtyFrom(addBtn));
    morph(addBtn);
    toast(`<strong>${esc(item.name)}</strong><br><span style="opacity:.8">${esc(item.variant)}</span>`, { label: L.view, onClick: openDrawer });
    announce(`${L.added}, ${L.items(quote.count())}`);
    return;
  }

  const nowBtn = t.closest<HTMLElement>('[data-quote-now]');
  if (nowBtn) {
    e.preventDefault();
    const item = itemFrom(nowBtn);
    if (item) quote.add(item, qtyFrom(nowBtn));
    location.href = isHi ? u('/hi/quote/') : u('/quote/');
    return;
  }

  if (t.closest('[data-open-quote]')) {
    document.querySelector<HTMLDialogElement>('dialog.mnav[open]')?.close();
    document.querySelector<HTMLDialogElement>('dialog[data-contact-sheet][open]')?.close();
    openDrawer();
    return;
  }

  if (!drawer?.contains(t)) return;
  const row = t.closest<HTMLElement>('.ql-item');
  if (row) {
    const sku = row.dataset.sku!;
    if (t.closest('[data-remove]')) {
      const prev = quote.snapshot();
      quote.remove(sku);
      toast(L.removed, { label: L.undo, onClick: () => quote.restore(prev) });
      return;
    }
    const step = t.closest<HTMLElement>('[data-q]');
    if (step) {
      const it = quote.snapshot().items.find((i) => i.sku === sku);
      if (it) quote.setQty(sku, it.qty + Number(step.dataset.q));
      return;
    }
  }
  if (t.closest('[data-clear-list]')) {
    const prev = quote.clear();
    toast(L.cleared, { label: L.undo, onClick: () => quote.restore(prev) });
    return;
  }
  if (t.closest('[data-share-list]')) {
    void shareList();
  }
});

drawer?.addEventListener('change', (e) => {
  const input = (e.target as HTMLElement).closest<HTMLInputElement>('[data-q-input]');
  if (input) quote.setQty(input.closest<HTMLElement>('.ql-item')!.dataset.sku!, Number(input.value));
});
drawer?.querySelector('[data-quote-note]')?.addEventListener('input', (e) => {
  quote.setNote((e.target as HTMLTextAreaElement).value);
});

export async function shareList() {
  const url = `${location.origin}${u('/quote/list/')}#l=${quote.encodeShare()}`;
  const title = isHi ? 'Ecorayy कोटेशन सूची' : 'Ecorayy Quote List';
  if (navigator.share && matchMedia('(pointer: coarse)').matches) {
    try { await navigator.share({ title, url }); return; } catch { /* cancelled */ }
  }
  try {
    await navigator.clipboard.writeText(url);
    toast(L.copied);
  } catch {
    prompt(title, url);
  }
}

let last = quote.count();
window.addEventListener('quote:change', () => {
  const n = quote.count();
  render(n > last);
  last = n;
});
render();
