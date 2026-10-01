// @ts-nocheck
/**
 * Single source of truth for pushing analytics signals into the GTM dataLayer.
 *
 * The site loads Google Analytics only through Google Tag Manager, so
 * `gtag('event', ...)` calls made from page code are NOT picked up by GA4.
 * Everything must be pushed as a named dataLayer event that a GTM trigger
 * can listen to.
 */

type Params = Record<string, unknown>;

export function pushDataLayer(event: string, params: Params = {}) {
  if (typeof window === 'undefined') return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event, ...params });
}

/** Pushes a named dataLayer event and mirrors it to gtag when GA is loaded directly. */
export function trackEvent(event: string, params: Params = {}) {
  pushDataLayer(event, params);
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', event, params);
  }
}

/** Fires one SPA page view signal. Deduplicated by the caller. */
export function trackPageView(path: string) {
  pushDataLayer('page_view_spa', {
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : path,
    page_title: typeof document !== 'undefined' ? document.title : '',
  });
}
