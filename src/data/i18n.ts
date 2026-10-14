import type { Lang } from './site';
import { stripBase, u } from '../lib/url';

/**
 * Pages that exist in Hindi at launch (strategy "Change 4"): Home, Solar,
 * Contact and the quote form. Everything else is English first.
 * Hindi copy is a DRAFT for native-speaker review (checklist H1).
 */
export const HINDI_PAGES = new Set([
  '/',
  '/solar/',
  '/solar/homes/',
  '/solar/business/',
  '/solar/parks-epc/',
  '/solar/pumps/',
  '/solar/how-it-works/',
  '/solar/estimator/',
  '/contact/',
  '/quote/',
]);

/** Strip a leading /hi to get the canonical English path. */
export function basePath(pathname: string): string {
  const raw = stripBase(pathname);
  const p = raw.endsWith('/') ? raw : raw + '/';
  return p.startsWith('/hi/') ? p.slice(3) || '/' : p === '/hi/' ? '/' : p;
}

/** Link to `path` in `lang` if that page exists in that language. */
export function href(path: string, lang: Lang): string {
  const clean = stripBase(path);
  const [p, rest = ''] = clean.split(/(?=[?#])/);
  if (lang === 'hi' && HINDI_PAGES.has(p)) return u((p === '/' ? '/hi/' : '/hi' + p) + rest);
  return u(clean);
}

export function hasHindi(path: string) {
  return HINDI_PAGES.has(basePath(path));
}

/** Pick a translated string with English fallback. */
export function tr<T extends { en: string; hi?: string }>(v: T | string, lang: Lang): string {
  if (typeof v === 'string') return v;
  return (lang === 'hi' ? v.hi : undefined) ?? v.en;
}

export const ui = {
  en: {
    skip: 'Skip to content',
    menu: 'Menu',
    close: 'Close',
    search: 'Search',
    searchPlaceholder: 'Search products, sizes, SKUs or services',
    quoteList: 'Quote List',
    downloads: 'Downloads',
    whatsapp: 'WhatsApp',
    call: 'Call',
    sendEnquiry: 'Send an enquiry',
    back: 'Back',
    overview: 'overview',
    hiUnavailable: 'This page is in English for now',
    previewTitle: 'Preview build.',
    previewText: 'Contact details, products and some text are sample content, marked for replacement before launch.',
    showSamples: 'Show sample markers',
    hideSamples: 'Hide sample markers',
    notConnected: 'Coming soon',
    learnMore: 'Learn more',
    verify: 'How to verify',
    getQuote: 'Get a quote',
    addToList: 'Add to Quote List',
    added: 'Added',
    viewList: 'View list',
    representative: 'Representative image',
    illustrative: 'Illustrative image',
  },
  hi: {
    skip: 'सीधे सामग्री पर जाएँ',
    menu: 'मेन्यू',
    close: 'बंद करें',
    search: 'खोजें',
    searchPlaceholder: 'उत्पाद, साइज़, SKU या सेवाएँ खोजें',
    quoteList: 'कोटेशन सूची',
    downloads: 'डाउनलोड',
    whatsapp: 'WhatsApp',
    call: 'कॉल करें',
    sendEnquiry: 'पूछताछ भेजें',
    back: 'वापस',
    overview: 'पूरा देखें',
    hiUnavailable: 'यह पेज अभी केवल अंग्रेज़ी में है',
    previewTitle: 'प्रीव्यू संस्करण।',
    previewText: 'संपर्क विवरण, उत्पाद और कुछ टेक्स्ट नमूना सामग्री हैं, जिन्हें लॉन्च से पहले बदला जाएगा।',
    showSamples: 'नमूना सामग्री दिखाएँ',
    hideSamples: 'नमूना चिह्न छिपाएँ',
    notConnected: 'जल्द उपलब्ध',
    learnMore: 'और जानें',
    verify: 'कैसे जाँचें',
    getQuote: 'कोटेशन लें',
    addToList: 'कोटेशन सूची में जोड़ें',
    added: 'जोड़ा गया',
    viewList: 'सूची देखें',
    representative: 'प्रतिनिधि चित्र',
    illustrative: 'उदाहरण चित्र',
  },
} satisfies Record<Lang, Record<string, string>>;
