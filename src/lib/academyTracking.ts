// @ts-nocheck
/**
 * Lightweight CRO tracking helpers for the Academy seminar pages.
 * Sends events to GTM/GA (dataLayer + gtag) and to the Meta pixel (fbq).
 */

type Params = Record<string, unknown>;

function pushDataLayer(event: string, params: Params = {}) {
  if (typeof window === 'undefined') return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event, ...params });
}

function gtagEvent(event: string, params: Params = {}) {
  if (typeof window === 'undefined') return;
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', event, params);
  }
}

function fbqTrack(event: string, params: Params = {}) {
  if (typeof window === 'undefined') return;
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', event, params);
  }
}

export interface BookingClickInfo {
  /** where on the page the click happened, e.g. 'hero_primary' */
  source: string;
  /** 'online' | 'onsite' | 'any' */
  mode?: string;
  value?: number;
  seminar?: string;
}

export function trackBookingClick({ source, mode = 'any', value, seminar = 'ai-for-business' }: BookingClickInfo) {
  const params = {
    seminar,
    booking_source: source,
    attendance_mode: mode,
    value,
    currency: 'EUR',
  };
  pushDataLayer('booking_click', params);
  gtagEvent('begin_checkout', {
    ...params,
    items: [{ item_id: seminar, item_name: seminar, item_variant: mode, price: value, quantity: 1 }],
  });
  fbqTrack('InitiateCheckout', {
    content_name: seminar,
    content_category: mode,
    value,
    currency: 'EUR',
  });
}

export function trackAcademyEvent(event: string, params: Params = {}) {
  pushDataLayer(event, params);
  gtagEvent(event, params);
}

/** Fires 25/50/75/100 % scroll-depth events once each, for the current page. */
export function initScrollDepthTracking(seminar = 'ai-for-business') {
  if (typeof window === 'undefined') return () => {};
  const marks = [25, 50, 75, 100];
  const fired = new Set<number>();

  const onScroll = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
    for (const m of marks) {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        trackAcademyEvent('scroll_depth', { seminar, percent_scrolled: m });
      }
    }
    if (fired.size === marks.length) window.removeEventListener('scroll', onScroll);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener('scroll', onScroll);
}
