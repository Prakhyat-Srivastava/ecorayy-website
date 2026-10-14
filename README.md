# Ecorayy Power Tech — website (frontend)

Static, multi-page website built with **Astro 7**, plain CSS and small vanilla TypeScript modules. No UI framework, no client router — pages change with native cross-document View Transitions.

Design source of truth: `../planning/` (strategy v2, website plan, content checklist, image and portrait prompts).

## Run it

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static site in dist/ (≈2 min: generates AVIF/WebP for every image)
npm run preview      # serve dist/
npm run check:launch # launch gate — lists every sample/placeholder still in the build
```

Requires Node 22+.

### Environment (`.env`)

| Variable | Default | Purpose |
|---|---|---|
| `PUBLIC_SITE_MODE` | `preview` | `preview` shows the preview banner, the "show sample markers" toggle and a `noindex` tag. Set `production` only after `check:launch` passes. |
| `PUBLIC_ENQUIRY_ENDPOINT` | empty | Where enquiries are POSTed. **Empty = nothing is sent**; the form tells the visitor plainly that their request was *not* sent. |

## What's where

```
src/
  data/                 ← all content and sample data (the future CMS)
    site.ts             company facts (REAL), contact details (SAMPLE), Directors
    products.ts         categories, filters, 18 sample product families, variants, specs
    infrastructure.ts   infrastructure service pages
    estimator.ts        SAMPLE solar estimator assumptions
    nav.ts              navigation, mega-menus, footer
    images.ts           image registry: alt text + truth tier for every image
    i18n.ts             Hindi page list, UI strings, link helper
  views/                page templates shared by English and Hindi routes
  pages/                routes (/hi/... = Hindi)
  components/           header, footer, overlays, cards, forms, Sun-to-Switch…
  scripts/              client behaviour (quote list, filters, search, forms…)
  styles/global.css     the whole design system ("Clean Current")
  assets/               images (prepared by scripts/prepare-assets.mjs) + logo
scripts/
  prepare-assets.mjs    copies the delivered images, trims logo canvas, makes crops
  check-launch.mjs      launch gate
```

## Sample content — how it is marked

Anything that is not a verified company fact carries a `data-sample="… (checklist ID)"` attribute. In preview builds, **Show sample markers** (top banner) outlines all of them on the page. `npm run check:launch` lists every one by page and fails while any remain. IDs refer to `../planning/02_Content_Update_Checklist.md`.

Real (verified) data used as-is: legal name, CIN, GSTIN, Udyam, DPIIT number and dates, registered office, incorporation date, Directors' names and designations.

Placeholders that can never reach a real person: phone `+91 00000 00000` (not clickable), email `enquiry@ecorayy.example` (not clickable), WhatsApp buttons disabled. Social links are omitted until real.

Images follow the truth tiers in `planning/03_Image_Generation_Prompts.md §1.1`. All 22 product photographs are **placeholders** labelled "Representative image" on the page, and `check:launch` blocks them.

## Frontend features and their backend hooks

| Feature | Works now (frontend) | Needs later | Integration point |
|---|---|---|---|
| **Enquiry & quote forms** (contact, quote, solar survey, dealer, tender) | Two-step form, validation, intent presets, honeypot, Quote List attached | An endpoint that stores/emails/WhatsApps the enquiry and returns `{ reference }` | `src/scripts/enquiry-client.ts` → set `PUBLIC_ENQUIRY_ENDPOINT`. Payload type `EnquiryPayload` is defined there. Add Cloudflare Turnstile token + rate-limit server-side. |
| **Quote List** | Add/remove/qty with units, note, saved 30 days in the browser, share link, print/PDF | Nothing required. Optional: server-saved lists | `src/scripts/quote-store.ts` |
| **Shared Quote List links** | `/quote/list/#l=…` encodes SKUs + quantities in the URL | — | `encodeShare` / `decodeShare` |
| **Product catalogue** | Categories, subcategories, filters (multi-select, counts, zero-greying, URL state), sort, table view, product pages with variants | Real product data (CMS) | Replace `src/data/products.ts` with Sanity queries returning the same `Category` / `Family` / `Variant` shapes; pages and filters adapt automatically |
| **Search** | Instant search over `/catalogue.json` (names, SKUs, values, typos, synonyms) | Optional: Meilisearch | `src/pages/catalogue.json.ts` + `src/scripts/search.ts`; extend `SYNONYMS` in `products.ts` |
| **Solar estimator** | Full calculation with every assumption shown | Real assumptions (tariffs, generation, cost/kW) with "last checked" date | `src/data/estimator.ts` |
| **Solar pump selector** | Depth × land → pump HP | Engineers' sizing table | table inside `src/views/solar/SolarPumps.astro` |
| **Downloads** | Pages and buttons in place ("Soon") | The PDFs | `src/pages/downloads/index.astro`, product pages |
| **Contact details** | Placeholders | Real phone/WhatsApp/email/hours | `contact` in `src/data/site.ts` (set `phoneHref`, `whatsappHref`, `emailHref`) |
| **Analytics / consent** | Not included | Choice of Plausible or GA4 + consent | `src/layouts/Base.astro` |

## Deployment (GitHub Pages)

Every push to `main` builds and publishes the site with `.github/workflows/deploy.yml`:
**https://prakhyat-srivastava.github.io/ecorayy-website/**

The site is served from a sub-folder, so every internal link goes through `u()` in `src/lib/url.ts` (and path checks through `stripBase()`). `BASE_PATH` and `SITE_URL` are set in the workflow; locally they default to `/`, so `npm run dev` still runs at the root. When the company domain is ready, set `SITE_URL` to it and `BASE_PATH` to `/` (plus a `CNAME`).

## Before launch

1. Work through `planning/02_Content_Update_Checklist.md`.
2. Replace `site` in `astro.config.mjs` with the real domain, and edit `public/robots.txt`.
3. `npm run build && npm run check:launch` must pass.
4. Set `PUBLIC_SITE_MODE=production`, rebuild, deploy (Cloudflare Pages or Vercel: build `npm run build`, output `dist`).

## Quality targets (strategy §12)

- JavaScript: ≈19 KB gzipped total across the site (budget 100 KB); CSS ≈22 KB gzipped.
- Images: AVIF + WebP + JPEG fallback at responsive widths; hero loaded eagerly, everything else lazily.
- Every animation respects `prefers-reduced-motion`; the Sun-to-Switch diagram is fully lit without JS.
- Keyboard: skip link, visible focus ring, menus close with Esc, `/` opens search.
- Forms: labels always visible, errors in words (never colour alone), 52 px inputs, 48 px+ targets.
