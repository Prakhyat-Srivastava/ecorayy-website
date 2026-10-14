/**
 * Enquiry submission adapter, the ONLY place that talks to a backend.
 *
 * Until PUBLIC_ENQUIRY_ENDPOINT is set, nothing is sent anywhere and the
 * form shows an honest "not sent, preview" state. When the backend exists,
 * set the env var; the endpoint should accept this JSON and return
 * { reference: "EQ-2026-0001" } (see README "Backend integration").
 */
export type EnquiryPayload = {
  intent: string;
  name: string;
  mobile: string;
  location: string;
  role: string;
  organisation?: string;
  gstin?: string;
  tenderRef?: string;
  email?: string;
  replyVia?: string;
  message?: string;
  extra?: Record<string, string>;
  items: { sku: string; name: string; variant: string; qty: number; unit: string }[];
  listNote?: string;
  marketingOptIn: boolean;
  lang: 'en' | 'hi';
  page: string;
  submittedAt: string;
};

export type EnquiryResult =
  | { status: 'sent'; reference: string }
  | { status: 'not-connected' }
  | { status: 'error'; message: string };

const ENDPOINT = import.meta.env.PUBLIC_ENQUIRY_ENDPOINT as string | undefined;

export async function submitEnquiry(payload: EnquiryPayload): Promise<EnquiryResult> {
  if (!ENDPOINT) {
    await new Promise((r) => setTimeout(r, 450)); // keep the UI honest but not jumpy
    return { status: 'not-connected' };
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { status: 'error', message: `Server responded ${res.status}` };
    const data = await res.json().catch(() => ({}));
    return { status: 'sent', reference: String(data.reference ?? '') };
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : 'Network error' };
  }
}

/** "by today, 6 pm" / "by tomorrow, 6 pm" / "by Monday, 6 pm" from office hours. */
export function replyBy(now: Date, spec: { days: number[]; open: number; close: number }, lang: 'en' | 'hi'): string {
  const d = new Date(now);
  const isWorking = (x: Date) => spec.days.includes(x.getDay());
  let days = 0;
  if (!(isWorking(d) && d.getHours() < spec.open)) {
    do { d.setDate(d.getDate() + 1); days++; } while (!isWorking(d));
  }
  const hour = spec.close > 12 ? spec.close - 12 : spec.close;
  if (lang === 'hi') {
    const dayHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'][d.getDay()];
    const when = days === 0 ? 'आज' : days === 1 ? 'कल' : dayHi;
    return `${when} शाम ${hour} बजे तक`;
  }
  const day = d.toLocaleDateString('en-IN', { weekday: 'long' });
  const when = days === 0 ? 'today' : days === 1 ? 'tomorrow' : day;
  return `by ${when}, ${hour} pm`;
}
