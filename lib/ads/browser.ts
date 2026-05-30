/**
 * Client-only browser runtime helpers for ads and consent.
 *
 * Prefer `globalThis` over `window` so these modules stay safe in workers,
 * edge runtimes, and other non-window browser contexts.
 *
 * Future: if server-side consent awareness is needed (e.g. proxy.ts, RSC, or
 * ad-free subscription checks), mirror consent in an httpOnly cookie and read it
 * here alongside localStorage.
 */
export type BrowserGlobal = typeof globalThis & {
  localStorage?: Storage;
  dataLayer?: unknown[];
  adsbygoogle?: unknown[];
};

export function getBrowserGlobal(): BrowserGlobal {
  return globalThis as BrowserGlobal;
}

export function isBrowser(): boolean {
  return typeof globalThis.document !== "undefined";
}
