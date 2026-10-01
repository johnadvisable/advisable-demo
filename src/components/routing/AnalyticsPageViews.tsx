// @ts-nocheck
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/lib/analyticsTracking';

/**
 * Sends one page view signal per client-side navigation.
 * The very first (hard) load is skipped: GTM's own Page View trigger already
 * covers it, so counting it here would double it.
 */
const AnalyticsPageViews = () => {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);
  const initialPath = useRef<string | null>(
    typeof window !== 'undefined' ? window.location.pathname : null
  );

  useEffect(() => {
    const path = location.pathname + location.search;

    // Skip the initial render (already counted by the GTM container load).
    if (lastPath.current === null && location.pathname === initialPath.current) {
      lastPath.current = path;
      return;
    }

    if (lastPath.current === path) return;
    lastPath.current = path;

    // Let the new page set its <title> before reporting.
    const timer = setTimeout(() => trackPageView(path), 60);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsPageViews;
