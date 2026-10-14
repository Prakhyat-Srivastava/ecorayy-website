/** Small toast + screen-reader announcer used across the site. */
let current: HTMLElement | null = null;
let timer = 0;

export function toast(html: string, action?: { label: string; onClick: () => void }, ms = 4000) {
  const region = document.querySelector<HTMLElement>('[data-toasts]');
  if (!region) return;
  // Toasts must sit above an open modal dialog, so move into it when needed.
  const openDialog = document.querySelector<HTMLDialogElement>('dialog[open]');
  (openDialog ?? document.body).appendChild(region);
  current?.remove();
  window.clearTimeout(timer);
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="toast__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><span class="toast__text">${html}</span>`;
  if (action) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'toast__action';
    b.textContent = action.label;
    b.addEventListener('click', () => { action.onClick(); dismiss(el); });
    el.appendChild(b);
  }
  region.appendChild(el);
  current = el;
  timer = window.setTimeout(() => dismiss(el), ms);
}

function dismiss(el: HTMLElement) {
  el.classList.add('is-leaving');
  window.setTimeout(() => el.remove(), 200);
  if (current === el) current = null;
}

export function announce(text: string) {
  const a = document.querySelector<HTMLElement>('[data-announcer]');
  if (!a) return;
  a.textContent = '';
  window.setTimeout(() => (a.textContent = text), 50);
}
