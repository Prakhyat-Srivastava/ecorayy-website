/**
 * "Sun to switch, Sun to street": a pulse of light travels along the circuit
 * as the visitor scrolls; each stop lights up in turn and the story panel
 * explains the stop just reached. Hovering or focusing a stop also shows its
 * story. Only transform/opacity/filter change on scroll.
 * Reduced motion / no JS: the whole circuit is drawn fully lit.
 */
type Pt = { x: number; y: number };
type Seg = { el: HTMLElement; start: number; len: number; a: Pt; b: Pt };
type Route = { w: [number, number]; total: number; segs: Seg[]; nodes: { el: HTMLElement; at: number }[]; pulse: HTMLElement };
type Step = { id: string; name: string; long: string; cta: string; href: string };

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function initSunToSwitch() {
  const root = document.querySelector<HTMLElement>('[data-sts]');
  if (!root) return;
  const stage = root.querySelector<HTMLElement>('[data-sts-stage]')!;
  const pin = root.querySelector<HTMLElement>('[data-sts-pin]')!;
  const sticky = pin.querySelector<HTMLElement>('.sts__sticky')!;
  const vwrap = root.querySelector<HTMLElement>('[data-sts-v]')!;
  const steps: Step[] = JSON.parse(root.querySelector('[data-sts-steps]')?.textContent || '[]');
  const story = root.querySelector<HTMLElement>('[data-sts-story]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 1080px)');
  let routes: Route[] = [];
  let order: { el: HTMLElement; id: string; pos: number }[] = [];
  let hoverId: string | null = null;
  let shownId = '';

  const center = (el: Element, box: Element): Pt => {
    const r = el.getBoundingClientRect();
    const c = box.getBoundingClientRect();
    return { x: r.left - c.left + r.width / 2, y: r.top - c.top + r.height / 2 };
  };

  function build() {
    const isD = desktop.matches;
    const box = isD ? stage : vwrap;
    const lines = box.querySelector<HTMLElement>(isD ? '[data-sts-lines]' : '[data-sts-lines-v]')!;
    lines.innerHTML = '';
    const attr = isD ? 'data-sts-node' : 'data-sts-vnode';
    const node = (id: string) => box.querySelector<HTMLElement>(`[${attr}="${id}"]`)!;
    const anchor = (id: string) => node(id).querySelector('.sts__sun, .sts__orb') ?? node(id);
    const P = (id: string) => center(anchor(id), box);
    const pts: Record<string, Pt> = Object.fromEntries(['sun', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7'].map((id) => [id, P(id)]));
    const { n4, n5, n7 } = pts;

    let home: (Pt | string)[];
    let street: (Pt | string)[];
    if (isD) {
      const jx = Math.round((n4.x + n5.x) / 2 - 10);
      home = ['n4', { x: jx, y: n4.y }, { x: jx, y: n5.y }, 'n5', 'n6'];
      street = ['n4', { x: jx, y: n4.y }, { x: jx, y: n7.y }, 'n7'];
    } else {
      const top = box.querySelector('.sts__v-branches')!.getBoundingClientRect().top - box.getBoundingClientRect().top;
      const jy = top - 30;
      home = ['n4', { x: n4.x, y: jy }, { x: n5.x, y: jy }, 'n5', 'n6'];
      street = ['n4', { x: n4.x, y: jy }, { x: n7.x, y: jy }, 'n7'];
    }

    const make = (path: (Pt | string)[], w: [number, number]): Route => {
      const pulse = document.createElement('span');
      pulse.className = 'sts__pulse';
      const r: Route = { w, total: 0, segs: [], nodes: [], pulse };
      for (let i = 0; i < path.length; i++) {
        const cur = typeof path[i] === 'string' ? pts[path[i] as string] : (path[i] as Pt);
        if (typeof path[i] === 'string' && i > 0) r.nodes.push({ el: node(path[i] as string), at: r.total });
        const nextRaw = path[i + 1];
        if (!nextRaw) continue;
        const nxt = typeof nextRaw === 'string' ? pts[nextRaw] : nextRaw;
        const dx = nxt.x - cur.x;
        const dy = nxt.y - cur.y;
        const horizontal = Math.abs(dx) >= Math.abs(dy);
        const len = horizontal ? Math.abs(dx) : Math.abs(dy);
        if (len < 1) continue;
        const el = document.createElement('span');
        el.className = `sts__seg${horizontal ? '' : ' sts__seg--v'}`;
        el.innerHTML = '<i></i>';
        if (horizontal) {
          Object.assign(el.style, { left: `${Math.min(cur.x, nxt.x)}px`, top: `${cur.y - 1}px`, width: `${len}px`, height: '2px' });
          el.style.setProperty('--o', dx >= 0 ? 'left center' : 'right center');
        } else {
          Object.assign(el.style, { left: `${cur.x - 1}px`, top: `${Math.min(cur.y, nxt.y)}px`, width: '2px', height: `${len}px` });
          el.style.setProperty('--o', dy >= 0 ? 'center top' : 'center bottom');
        }
        lines.appendChild(el);
        r.segs.push({ el, start: r.total, len, a: cur, b: nxt });
        r.total += len;
      }
      lines.appendChild(pulse);
      return r;
    };

    routes = [
      make(['sun', 'n1', 'n2', 'n3', 'n4'], [0.04, 0.56]),
      make(home, [0.56, 0.96]),
      make(street, [0.56, 0.96]),
    ];
    // Global order of stops along the journey, for the story panel.
    order = [{ el: node('sun'), id: 'sun', pos: 0 }];
    for (const r of routes) for (const n of r.nodes) {
      order.push({ el: n.el, id: n.el.getAttribute(attr)!, pos: r.w[0] + (n.at / r.total) * (r.w[1] - r.w[0]) });
    }
    order.sort((a, b) => a.pos - b.pos);
    update();
  }

  function progress(): number {
    if (reduce.matches) return 1;
    const vh = window.innerHeight;
    if (desktop.matches) {
      const r = pin.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const travel = r.height - sticky.offsetHeight;
      return travel > 0 ? clamp((top + vh * 0.1 - r.top) / travel) : 1;
    }
    const r = vwrap.getBoundingClientRect();
    return clamp((vh * 0.72 - r.top) / r.height);
  }

  function showStory(id: string) {
    if (!story || id === shownId) return;
    const s = steps.find((x) => x.id === id);
    if (!s) return;
    shownId = id;
    const idx = steps.indexOf(s);
    story.classList.remove('is-swapping');
    void story.offsetWidth;
    story.classList.add('is-swapping');
    story.querySelector('[data-story-num]')!.textContent = String(idx).padStart(2, '0');
    story.querySelector('[data-story-title]')!.textContent = s.name;
    story.querySelector('[data-story-text]')!.textContent = s.long;
    story.querySelector('[data-story-cta]')!.textContent = s.cta;
    story.querySelector<HTMLAnchorElement>('[data-story-link]')!.href = s.href;
    story.querySelectorAll('.sts__bars i').forEach((b, i) => b.classList.toggle('is-on', i < idx));
    root.querySelectorAll('[data-sts-node]').forEach((n) => n.classList.toggle('is-current', n.getAttribute('data-sts-node') === id));
  }

  function update() {
    const p = progress();
    for (const r of routes) {
      const local = clamp((p - r.w[0]) / (r.w[1] - r.w[0]));
      const dist = local * r.total;
      for (const s of r.segs) s.el.style.setProperty('--p', String(clamp((dist - s.start) / s.len)));
      for (const n of r.nodes) n.el.classList.toggle('is-lit', p >= 0.999 || dist >= n.at - 2);
      // Pulse sits at the head of the light while it travels.
      const seg = r.segs.find((s) => dist >= s.start && dist <= s.start + s.len) ?? r.segs.at(-1);
      const moving = local > 0 && local < 1 && !reduce.matches;
      r.pulse.classList.toggle('is-on', moving);
      if (seg) {
        const t = clamp((dist - seg.start) / seg.len);
        r.pulse.style.transform = `translate3d(${seg.a.x + (seg.b.x - seg.a.x) * t}px, ${seg.a.y + (seg.b.y - seg.a.y) * t}px, 0)`;
      }
    }
    if (!hoverId) {
      let current = order[0];
      for (const o of order) if (p >= 0.999 || o.pos <= p + 0.001) current = o;
      showStory(current?.id ?? 'sun');
    }
  }

  // Hover / focus a stop to read its story.
  root.querySelectorAll<HTMLElement>('[data-sts-node]').forEach((n) => {
    const id = n.getAttribute('data-sts-node')!;
    const enter = () => { hoverId = id; showStory(id); };
    const leave = () => { hoverId = null; update(); };
    n.addEventListener('pointerenter', enter);
    n.addEventListener('focus', enter);
    n.addEventListener('pointerleave', leave);
    n.addEventListener('blur', leave);
  });

  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; update(); });
  };
  const setMode = () => {
    root.classList.toggle('sts--animated', !reduce.matches);
    requestAnimationFrame(build);
  };
  setMode();
  window.addEventListener('scroll', onScroll, { passive: true });
  let rt = 0;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(build, 120); });
  desktop.addEventListener('change', setMode);
  reduce.addEventListener('change', setMode);
  document.fonts?.ready.then(build);
  window.addEventListener('load', build);
}
