/**
 * Quote List, one engine, three doors (strategy §9).
 * Stored only in this browser (localStorage) for 30 days. Nothing personal
 * is stored here; contact details are only ever entered in the enquiry form.
 */
export type QuoteUnit = { one: string; many: string; note?: string };
export type QuoteItem = {
  sku: string;
  name: string;
  variant: string;
  qty: number;
  unit: QuoteUnit;
  img?: string;
  url: string;
};
type State = { items: QuoteItem[]; note: string; updated: number };

const KEY = 'ecorayy.quoteList.v1';
const TTL = 30 * 24 * 60 * 60 * 1000;
const empty = (): State => ({ items: [], note: '', updated: Date.now() });

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const s = JSON.parse(raw) as State;
    if (!Array.isArray(s.items) || Date.now() - (s.updated ?? 0) > TTL) {
      localStorage.removeItem(KEY);
      return empty();
    }
    return s;
  } catch {
    return empty();
  }
}

let state = load();

function emit() {
  window.dispatchEvent(new CustomEvent('quote:change', { detail: snapshot() }));
}
function persist() {
  state.updated = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode: list lives for this tab only */ }
  emit();
}

export function snapshot(): State {
  return { items: state.items.map((i) => ({ ...i })), note: state.note, updated: state.updated };
}
export const count = () => state.items.length;

export function add(item: Omit<QuoteItem, 'qty'>, qty = 1) {
  const existing = state.items.find((i) => i.sku === item.sku);
  if (existing) existing.qty = Math.min(9999, existing.qty + qty);
  else state.items.push({ ...item, qty: Math.max(1, qty) });
  persist();
}
export function setQty(sku: string, qty: number) {
  const it = state.items.find((i) => i.sku === sku);
  if (!it) return;
  it.qty = Math.max(1, Math.min(9999, Math.round(qty) || 1));
  persist();
}
export function remove(sku: string) {
  state.items = state.items.filter((i) => i.sku !== sku);
  persist();
}
export function setNote(note: string) {
  state.note = note.slice(0, 1000);
  persist();
}
export function clear(): State {
  const prev = snapshot();
  state = empty();
  persist();
  return prev;
}
export function restore(prev: State) {
  state = { ...prev, updated: Date.now() };
  persist();
}

// ----- share links: /quote/list/#l=<base64url(JSON)> -------------------------
export function encodeShare(s: State = state): string {
  const payload = JSON.stringify({ i: s.items.map((i) => [i.sku, i.qty]), n: s.note || undefined });
  const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(payload)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function decodeShare(code: string): { i: [string, number][]; n?: string } | null {
  try {
    const b64 = code.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const data = JSON.parse(new TextDecoder().decode(bytes));
    if (!Array.isArray(data.i)) return null;
    return { i: data.i.filter((x: unknown) => Array.isArray(x) && typeof x[0] === 'string').slice(0, 200), n: typeof data.n === 'string' ? data.n : undefined };
  } catch {
    return null;
  }
}

window.addEventListener('storage', (e) => {
  if (e.key === KEY) { state = load(); emit(); }
});

export const unitLabel = (u: QuoteUnit, qty: number) => (qty === 1 ? u.one : u.many);
