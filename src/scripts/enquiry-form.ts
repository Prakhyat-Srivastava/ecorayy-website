/**
 * Enquiry form behaviour: two short steps, gentle validation (on blur, in
 * plain words, never colour alone), Quote List attached automatically, and an
 * honest result: if no backend is connected, the visitor is told clearly that
 * the request has NOT been sent.
 */
import * as quote from './quote-store';
import { replyBy, submitEnquiry, type EnquiryPayload } from './enquiry-client';

const BUSINESS = ['dealer', 'distributor', 'builder', 'business', 'government'];
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function initEnquiryForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-enquiry]').forEach(init);
}

function init(form: HTMLFormElement) {
  if (form.dataset.ready) return;
  form.dataset.ready = '1';
  const S = JSON.parse(form.dataset.strings || '{}') as Record<string, string>;
  const lang = (form.dataset.lang as 'en' | 'hi') ?? 'en';
  const hi = lang === 'hi';
  const hours = JSON.parse(form.dataset.hours || '{"days":[1,2,3,4,5,6],"open":10,"close":18}');
  const step1 = form.querySelector<HTMLElement>('[data-step="1"]')!;
  const step2 = form.querySelector<HTMLElement>('[data-step="2"]')!;
  const panel = form.querySelector<HTMLElement>('[data-panel]')!;
  const result = form.querySelector<HTMLElement>('[data-result]')!;
  const el = <T extends HTMLElement = HTMLInputElement>(name: string) => form.elements.namedItem(name) as unknown as T;

  // ---- prefill from URL (search "send your requirement", estimator, intents)
  const params = new URL(location.href).searchParams;
  const msg = params.get('msg');
  if (msg) el<HTMLTextAreaElement>('message').value = msg;
  const bill = params.get('bill');
  if (bill && el('x_bill')) el('x_bill').value = `₹${Number(bill).toLocaleString('en-IN')} / month`;
  const est = params.get('estimate');
  if (est) el<HTMLTextAreaElement>('message').value = est;
  const urlIntent = params.get('intent');
  if (urlIntent) setIntent(urlIntent);

  function intent(): string {
    const r = form.querySelector<HTMLInputElement>('input[name="intent"]:checked') ?? form.querySelector<HTMLInputElement>('input[name="intent"]');
    return r?.value ?? 'products';
  }
  function setIntent(v: string) {
    const radio = form.querySelector<HTMLInputElement>(`input[name="intent"][value="${CSS.escape(v)}"]`);
    if (radio) radio.checked = true;
    else { const h = form.querySelector<HTMLInputElement>('input[type=hidden][name="intent"]'); if (h) h.value = v; }
    syncConditional();
  }
  form.addEventListener('enquiry:intent', ((e: CustomEvent) => setIntent(e.detail)) as EventListener);

  function role(): string {
    return form.querySelector<HTMLInputElement>('input[name="role"]:checked')?.value ?? '';
  }
  function syncConditional() {
    const r = role();
    const i = intent();
    form.querySelectorAll<HTMLElement>('[data-show-for]').forEach((f) => (f.hidden = !f.dataset.showFor!.split(' ').includes(r)));
    form.querySelectorAll<HTMLElement>('[data-intent-only]').forEach((f) => (f.hidden = f.dataset.intentOnly !== i));
  }
  form.addEventListener('change', syncConditional);
  syncConditional();

  // ---- attached Quote List summary
  const attached = form.querySelector<HTMLElement>('[data-attached]')!;
  function renderAttached() {
    const s = quote.snapshot();
    attached.hidden = s.items.length === 0;
    if (!s.items.length) return;
    attached.innerHTML = `
      <div class="attached__head"><strong>${hi ? 'आपकी कोटेशन सूची साथ भेजी जाएगी' : 'Your Quote List will be attached'}</strong>
      <button type="button" class="link-arrow" data-open-quote style="min-height:32px">${hi ? 'बदलें' : 'Edit'}</button></div>
      <ul role="list">${s.items.slice(0, 4).map((i) => `<li><span>${esc(i.name)} <span class="muted">· ${esc(i.variant)}</span></span><span class="mono">× ${i.qty}</span></li>`).join('')}
      ${s.items.length > 4 ? `<li class="muted">+ ${s.items.length - 4} ${hi ? 'और' : 'more'}</li>` : ''}</ul>`;
  }
  window.addEventListener('quote:change', renderAttached);
  renderAttached();

  // ---- validation
  const rules: Record<string, (v: string) => string | null> = {
    name: (v) => (v.trim().length >= 2 ? null : S.name),
    mobile: (v) => (/^[6-9]\d{9}$/.test(v.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '')) ? null : S.mobile),
    location: (v) => {
      const t = v.trim();
      if (/^\d+$/.test(t)) return /^[1-9]\d{5}$/.test(t) ? null : S.location;
      return t.length >= 2 ? null : S.location;
    },
    email: (v) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : S.email),
    gstin: (v) => (!v.trim() || /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v.trim().toUpperCase()) ? null : S.gstin),
  };
  function showError(field: HTMLElement | null, msg: string | null) {
    if (!field) return;
    field.classList.toggle('has-error', !!msg);
    const span = field.querySelector('.field__error span');
    if (span) span.textContent = msg ?? '';
    const input = field.querySelector<HTMLInputElement>('input, textarea, select');
    if (input) {
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const err = field.querySelector('.field__error');
      if (err) { err.id ||= `${input.id || input.name}-err`; input.setAttribute('aria-describedby', err.id); }
    }
  }
  function check(name: string): boolean {
    const input = el(name);
    if (!input || !rules[name]) return true;
    const msg = rules[name](input.value);
    showError(input.closest('.field'), msg);
    return !msg;
  }
  Object.keys(rules).forEach((n) => {
    const input = el(n);
    input?.addEventListener('blur', () => { if (input.value || n !== 'email') check(n); });
    input?.addEventListener('input', () => { if (input.closest('.field')?.classList.contains('has-error')) check(n); });
  });
  function checkRole(): boolean {
    const ok = !!role();
    showError(form.querySelector('[data-field="role"]'), ok ? null : S.role);
    return ok;
  }
  form.addEventListener('change', (e) => { if ((e.target as HTMLInputElement).name === 'role') checkRole(); });

  // ---- steps
  const setStep = (n: 1 | 2) => {
    step1.hidden = n !== 1;
    step2.hidden = n !== 2;
    form.querySelector('[data-step-label]')!.textContent = S.step.replace('{n}', String(n));
    (form.querySelector('[data-step-bar]') as HTMLElement).style.transform = `scaleX(${n === 1 ? 0.5 : 1})`;
    const first = (n === 1 ? step1 : step2).querySelector<HTMLElement>('input:not([type=hidden]):not([hidden]), textarea');
    first?.focus({ preventScroll: true });
    panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  };
  form.querySelector('[data-next]')!.addEventListener('click', () => {
    const fieldsOk = ['name', 'mobile', 'location'].map(check).every(Boolean);
    const roleOk = checkRole(); // always run, so every problem is shown at once
    const ok = fieldsOk && roleOk;
    if (!ok) {
      form.querySelector<HTMLElement>('.has-error input, .has-error')?.focus();
      return;
    }
    syncConditional();
    setStep(2);
  });
  form.querySelector('[data-back]')!.addEventListener('click', () => setStep(1));

  // ---- submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (step1.hidden === false) { form.querySelector<HTMLButtonElement>('[data-next]')!.click(); return; }
    if (!['email', 'gstin'].map(check).every(Boolean)) return;
    if (el('website').value) return; // honeypot: silently ignore bots
    const btn = form.querySelector<HTMLButtonElement>('[data-submit]')!;
    btn.disabled = true;
    const original = btn.innerHTML;
    btn.textContent = S.sending;
    const s = quote.snapshot();
    const extra: Record<string, string> = {};
    form.querySelectorAll<HTMLInputElement>('[name^="x_"]').forEach((x) => { if (x.value && !x.closest('[hidden]')) extra[x.name.slice(2)] = x.value; });
    const mobileDigits = el('mobile').value.replace(/\D/g, '').slice(-10);
    const payload: EnquiryPayload = {
      intent: intent(),
      name: el('name').value.trim(),
      mobile: `+91${mobileDigits}`,
      location: el('location').value.trim(),
      role: role(),
      organisation: el('organisation')?.value.trim() || undefined,
      gstin: el('gstin')?.value.trim().toUpperCase() || undefined,
      tenderRef: el('tenderRef')?.value.trim() || undefined,
      email: el('email').value.trim() || undefined,
      replyVia: form.querySelector<HTMLInputElement>('input[name="replyVia"]:checked')?.value,
      message: el<HTMLTextAreaElement>('message').value.trim() || undefined,
      extra: Object.keys(extra).length ? extra : undefined,
      items: s.items.map((i) => ({ sku: i.sku, name: i.name, variant: i.variant, qty: i.qty, unit: i.qty === 1 ? i.unit.one : i.unit.many })),
      listNote: s.note || undefined,
      marketingOptIn: el('marketing').checked,
      lang,
      page: location.pathname,
      submittedAt: new Date().toISOString(),
    };
    const res = await submitEnquiry(payload);
    btn.disabled = false;
    btn.innerHTML = original;
    renderResult(res.status, payload, res.status === 'sent' ? res.reference : res.status === 'error' ? res.message : '');
  });

  function summary(p: EnquiryPayload): string {
    const rows: [string, string][] = [
      [hi ? 'नाम' : 'Name', p.name],
      [hi ? 'मोबाइल' : 'Mobile', p.mobile],
      [hi ? 'शहर / पिन' : 'City / PIN', p.location],
    ];
    if (p.organisation) rows.push([hi ? 'संस्था' : 'Organisation', p.organisation]);
    if (p.items.length) rows.push([hi ? 'कोटेशन सूची' : 'Quote List', p.items.map((i) => `${i.name} (${i.variant}) × ${i.qty}`).join('; ')]);
    if (p.message) rows.push([hi ? 'संदेश' : 'Message', p.message]);
    return `<dl class="kv">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;
  }
  function plainText(p: EnquiryPayload): string {
    return [
      `Ecorayy enquiry (${p.intent})`,
      `Name: ${p.name}`, `Mobile: ${p.mobile}`, `City/PIN: ${p.location}`, `I am a: ${p.role}`,
      p.organisation && `Organisation: ${p.organisation}`, p.gstin && `GSTIN: ${p.gstin}`, p.tenderRef && `Tender: ${p.tenderRef}`,
      p.email && `Email: ${p.email}`, p.replyVia && `Reply via: ${p.replyVia}`,
      p.items.length ? `Items:\n${p.items.map((i) => `- ${i.name} · ${i.variant} · ${i.sku} × ${i.qty} ${i.unit}`).join('\n')}` : '',
      p.listNote && `Note: ${p.listNote}`, p.message && `Message: ${p.message}`,
    ].filter(Boolean).join('\n');
  }

  function renderResult(status: string, p: EnquiryPayload, info: string) {
    const first = esc(p.name.split(' ')[0]);
    const by = replyBy(new Date(), hours, lang);
    if (status === 'sent') {
      result.innerHTML = `
        <div class="confirm">
          <span class="confirm__check"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg></span>
          <h2 class="h2">${hi ? `धन्यवाद, ${first}। आपका अनुरोध मिल गया है।` : `Thank you, ${first}. We’ve got your request.`}</h2>
          <p class="confirm__ref">${hi ? 'संदर्भ' : 'Reference'} <span class="mono">${esc(info)}</span></p>
          <p class="lead">${hi ? `हमारी टीम आपको ${by} कॉल या WhatsApp करेगी।` : `Our team will call or WhatsApp you ${by}.`}</p>
          ${summary(p)}
        </div>`;
      quote.clear();
    } else if (status === 'not-connected') {
      result.innerHTML = `
        <div class="confirm confirm--preview">
          <span class="tag tag--warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3.5 2.5 20h19L12 3.5Z"/><path d="M12 10v4.5"/><path d="M12 17.5v.1"/></svg>${hi ? 'प्रीव्यू, नहीं भेजा गया' : 'Preview, not sent'}</span>
          <h2 class="h2">${hi ? `${first}, आपका अनुरोध तैयार है, लेकिन अभी भेजा नहीं गया है।` : `Your request is ready, ${first}, but it has not been sent.`}</h2>
          <p class="lead">${hi ? 'यह वेबसाइट अभी प्रीव्यू में है। हमारी पूछताछ प्रणाली लॉन्च से पहले जोड़ी जाएगी। आपने जो भी भरा है, वह इस डिवाइस से बाहर नहीं गया है। आप इसे स्वयं हमें ईमेल कर सकते हैं।' : 'This website is a preview. Enquiries will be delivered once our enquiry system is connected before launch. Nothing you entered has left this device. You can email it to us yourself instead.'}</p>
          ${summary(p)}
          <div class="confirm__future">
            <p class="caption">${hi ? 'लॉन्च के बाद आपको यह दिखेगा:' : 'After launch, you’ll see this instead:'}</p>
            <p><strong>${hi ? `धन्यवाद, ${first}। आपका अनुरोध मिल गया है।` : `Thank you, ${first}. We’ve got your request.`}</strong></p>
            <p class="muted">${hi ? 'संदर्भ संख्या (जैसे EQ-2026-0001), और' : 'A reference number (like EQ-2026-0001), and'} ${hi ? `हमारी टीम आपको ${by} कॉल या WhatsApp करेगी।` : `“Our team will call or WhatsApp you ${by}.”`}</p>
          </div>
          <div class="cluster">
            ${form.dataset.email ? `<a class="btn" href="mailto:${esc(form.dataset.email)}?subject=${encodeURIComponent(hi ? 'वेबसाइट से पूछताछ' : 'Website enquiry')}&body=${encodeURIComponent(plainText(p))}">${hi ? 'यह अनुरोध ईमेल करें' : 'Email this request'}</a>` : ''}
            <button class="btn btn--secondary" type="button" data-copy-request>${hi ? 'अनुरोध कॉपी करें' : 'Copy request text'}</button>
            <button class="btn btn--quiet" type="button" data-edit>${hi ? 'विवरण बदलें' : 'Edit details'}</button>
          </div>
        </div>`;
    } else {
      result.innerHTML = `<div class="notice"><span>⚠</span><span><strong>${hi ? 'अनुरोध नहीं भेजा जा सका।' : 'We couldn’t send your request.'}</strong> ${esc(info)}. ${hi ? 'कृपया फिर से कोशिश करें।' : 'Please try again.'}</span></div>
        <button class="btn" type="button" data-edit style="margin-top:12px">${hi ? 'फिर से कोशिश करें' : 'Try again'}</button>`;
    }
    panel.hidden = true;
    form.querySelector<HTMLElement>('[data-intents]')?.setAttribute('hidden', '');
    result.hidden = false;
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    result.querySelector('[data-edit]')?.addEventListener('click', () => {
      result.hidden = true;
      panel.hidden = false;
      form.querySelector<HTMLElement>('[data-intents]')?.removeAttribute('hidden');
      setStep(1);
    });
    result.querySelector('[data-copy-request]')?.addEventListener('click', async (ev) => {
      const b = ev.currentTarget as HTMLButtonElement;
      try { await navigator.clipboard.writeText(plainText(p)); b.textContent = hi ? 'कॉपी हो गया ✓' : 'Copied ✓'; } catch { /* ignore */ }
    });
  }
}
