import { defineConfig } from 'astro/config';

// Static multi-page site. Cross-document View Transitions are enabled in CSS
// (@view-transition), so no client router is needed.
//
// SITE_URL and BASE_PATH are set by the deploy workflow:
//   GitHub Pages project site → SITE_URL=https://prakhyat-srivastava.github.io  BASE_PATH=/ecorayy-website
//   Own domain later          → SITE_URL=https://your-domain.in                BASE_PATH=/
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://ecorayy.example', // TODO(B1): real domain
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
