/**
 * Base-path helpers. The site can be served from a sub-folder (GitHub Pages
 * project site: /ecorayy-website/) or from a domain root. All internal links
 * go through `u()`; all path comparisons use `stripBase()` first.
 */
export const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

/** Prefix an absolute site path with the base ("/products/" → "/ecorayy-website/products/"). */
export function u(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (BASE && (path === BASE || path.startsWith(BASE + '/'))) return path;
  return BASE + path;
}

/** Remove the base from a pathname so routes can be compared ("/ecorayy-website/solar/" → "/solar/"). */
export function stripBase(pathname: string): string {
  if (BASE && pathname.startsWith(BASE)) return pathname.slice(BASE.length) || '/';
  return pathname;
}
