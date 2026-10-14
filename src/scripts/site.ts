import { u } from '../lib/url';
/**
 * Site-wide behaviour: header, mega-menus, mobile menu, dialogs, search,
 * scroll reveals and the preview sample-marker toggle.
 * Every motion respects prefers-reduced-motion (CSS handles the fallback).
 */
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

// ---------------------------------------------------------- header compaction
const header = $('[data-header]');
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    header?.classList.toggle('is-compact', window.scrollY > 24);
    ticking = false;
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ------------------------------------------------------------------ mega-menus
const items = $$('[data-mega]');
let openItem: HTMLElement | null = null;
const timers = new WeakMap<HTMLElement, number>();

function loadPreviews(item: HTMLElement) {
  $$<HTMLImageElement>('img[data-src]', item).forEach((img) => {
    img.src = img.dataset.src!;
    img.removeAttribute('data-src');
  });
}
function openMega(item: HTMLElement) {
  if (openItem && openItem !== item) closeMega(openItem);
  loadPreviews(item);
  item.classList.add('is-open');
  $('button', item)?.setAttribute('aria-expanded', 'true');
  openItem = item;
}
function closeMega(item: HTMLElement, focus = false) {
  item.classList.remove('is-open');
  const btn = $<HTMLButtonElement>('button', item);
  btn?.setAttribute('aria-expanded', 'false');
  if (focus) btn?.focus();
  if (openItem === item) openItem = null;
}
const canHover = matchMedia('(hover: hover) and (pointer: fine)');
items.forEach((item) => {
  const btn = $<HTMLButtonElement>('button', item)!;
  btn.addEventListener('click', () => (item.classList.contains('is-open') ? closeMega(item) : openMega(item)));
  item.addEventListener('pointerenter', () => {
    if (!canHover.matches) return;
    clearTimeout(timers.get(item));
    // 120 ms intent delay stops menus flickering open as the mouse passes over.
    timers.set(item, window.setTimeout(() => openMega(item), openItem ? 0 : 120));
  });
  item.addEventListener('pointerleave', () => {
    if (!canHover.matches) return;
    clearTimeout(timers.get(item));
    // 300 ms close delay forgives diagonal mouse movement into the panel.
    timers.set(item, window.setTimeout(() => closeMega(item), 300));
  });
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMega(item, true);
  });
  item.addEventListener('focusout', (e) => {
    if (!item.contains(e.relatedTarget as Node)) closeMega(item);
  });
  // Preview image follows the hovered / focused link.
  const show = (link: HTMLElement) => {
    const i = link.dataset.preview;
    $$('.mega__link', item).forEach((l) => l.classList.toggle('is-active', l === link));
    $$('[data-preview-img]', item).forEach((p) => p.classList.toggle('is-shown', p.dataset.previewImg === i));
    const text = $('[data-preview-text]', item);
    if (text) text.textContent = link.dataset.desc ?? '';
  };
  $$<HTMLAnchorElement>('.mega__link', item).forEach((l) => {
    l.addEventListener('pointerenter', () => show(l));
    l.addEventListener('focus', () => show(l));
  });
});
document.addEventListener('click', (e) => {
  if (openItem && !openItem.contains(e.target as Node)) closeMega(openItem);
});

// --------------------------------------------------------------------- dialogs
document.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;
  const close = t.closest('[data-close]');
  if (close) close.closest('dialog')?.close();
  // Click on the backdrop (the dialog element itself) closes it.
  if (t instanceof HTMLDialogElement && t.open) {
    const r = t.getBoundingClientRect();
    const ev = e as MouseEvent;
    const inside = ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
    if (!inside || t.classList.contains('search-dlg')) t.close();
  }
});
// Lock page scroll while a modal is open.
const lock = () => document.documentElement.style.setProperty('overflow', $$('dialog[open]').length ? 'hidden' : '');
new MutationObserver(lock).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });

// ----------------------------------------------------------------- mobile menu
const mnav = $<HTMLDialogElement>('[data-mnav]');
$$('[data-open-menu]').forEach((b) => b.addEventListener('click', () => mnav?.showModal()));
if (mnav) {
  const root = $('[data-panel="root"]', mnav)!;
  mnav.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const go = t.closest<HTMLElement>('[data-goto]');
    if (go) {
      const panel = $(`[data-panel="${go.dataset.goto}"]`, mnav)!;
      root.classList.add('is-behind');
      root.classList.remove('is-active');
      panel.classList.add('is-active');
      panel.removeAttribute('aria-hidden');
      // Focus without letting the overflow-hidden viewport scroll sideways.
      $<HTMLElement>('[data-back]', panel)?.focus({ preventScroll: true });
      $('.mnav__viewport', mnav)!.scrollLeft = 0;
    }
    if (t.closest('[data-back]')) {
      const panel = t.closest<HTMLElement>('.mnav__panel')!;
      panel.classList.remove('is-active');
      panel.setAttribute('aria-hidden', 'true');
      root.classList.remove('is-behind');
      root.classList.add('is-active');
      $('.mnav__viewport', mnav)!.scrollLeft = 0;
      $<HTMLElement>(`[data-goto="${panel.dataset.panel}"]`, root)?.focus({ preventScroll: true });
    }
  });
  mnav.addEventListener('close', () => {
    $$('.mnav__panel[data-level="1"]', mnav).forEach((p) => { p.classList.remove('is-active'); p.setAttribute('aria-hidden', 'true'); });
    root.classList.add('is-active');
    root.classList.remove('is-behind');
  });
}

// ---------------------------------------------------------------- contact sheet
const sheet = $<HTMLDialogElement>('[data-contact-sheet]');
$$('[data-open-contact]').forEach((b) => b.addEventListener('click', () => sheet?.showModal()));

// ---------------------------------------------------------------------- search
const searchDlg = $<HTMLDialogElement>('[data-search]');
let searchReady: Promise<unknown> | null = null;
function openSearch(q = '') {
  if (!searchDlg) return;
  searchReady ??= import('./search').then((m) => m.initSearch(searchDlg));
  searchDlg.showModal();
  const input = $<HTMLInputElement>('[data-search-input]', searchDlg)!;
  if (q) { input.value = q; input.dispatchEvent(new Event('input')); }
  input.focus();
  input.select();
}
$$('[data-open-search]').forEach((b) => b.addEventListener('click', () => openSearch()));
document.addEventListener('keydown', (e) => {
  const tag = (e.target as HTMLElement).tagName;
  if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) && !$('dialog[open]')) {
    e.preventDefault();
    openSearch();
  }
});

// --------------------------------------------------------------- scroll reveal
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io!.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.01 })
  : null;
$$('.reveal, .step').forEach((el) => (io ? io.observe(el) : el.classList.add('is-in')));

// ------------------------------------------------- sample-content marker toggle
const toggle = $<HTMLButtonElement>('[data-toggle-samples]');
const syncToggle = () => {
  const on = document.documentElement.classList.contains('show-samples');
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(on));
    toggle.textContent = on ? toggle.dataset.on! : toggle.dataset.off!;
  }
};
toggle?.addEventListener('click', () => {
  const on = document.documentElement.classList.toggle('show-samples');
  try { localStorage.setItem('ecorayy.showSamples', on ? '1' : '0'); } catch { /* ignore */ }
  syncToggle();
});
syncToggle();

// ------------------------------------------------------------- language memory
$$<HTMLAnchorElement>('[data-lang-link]').forEach((a) =>
  a.addEventListener('click', () => {
    try { localStorage.setItem('ecorayy.lang', a.dataset.langLink!); } catch { /* ignore */ }
  }),
);
// Returning Hindi visitors land on the Hindi home page.
try {
  const pref = localStorage.getItem('ecorayy.lang');
  const fromOutside = !document.referrer || new URL(document.referrer).origin !== location.origin;
  if (pref === 'hi' && location.pathname === u('/') && fromOutside) location.replace(u('/hi/'));
} catch { /* ignore */ }
