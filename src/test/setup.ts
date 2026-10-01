import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Ensure import.meta.env exists with required keys for components
// Vitest provides import.meta in ESM; we ensure env object has our key
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const im: any = import.meta as any;
im.env = {
  ...(im.env || {}),
  VITE_RECAPTCHA_SITE_KEY: im.env?.VITE_RECAPTCHA_SITE_KEY || 'test-site-key',
  VITE_BACKEND_URL: '',
};

// Provide a minimal console.error suppressor for expected noisy errors in tests
// You can remove this if you want to see all logs during tests
const origError = console.error;
console.error = (...args: unknown[]) => {
  // Suppress expected reCAPTCHA load error logs during unit tests (script not truly loaded)
  if (typeof args[0] === 'string' && args[0].includes('reCAPTCHA')) return;
  origError(...args);
};

// --- DOM polyfills (guarded) ---
// Ensure this file is safe in both node and jsdom environments
const hasDOM = typeof window !== 'undefined' && typeof document !== 'undefined';

if (hasDOM) {
  // Polyfill scrollIntoView for jsdom to satisfy Radix UI Select behavior
  // jsdom doesn't implement this API; many UI libs call it during menu open
  if (typeof (HTMLElement as any) !== 'undefined') {
    const proto: any = (HTMLElement as any).prototype;
    if (typeof proto.scrollIntoView !== 'function') {
      Object.defineProperty(proto, 'scrollIntoView', {
        value: () => {},
        writable: true,
        configurable: true,
      });
    }
  }

  // Polyfill pointer capture APIs used by Radix and React Aria
  // jsdom elements may not implement these; provide no-op versions
  if (typeof (Element as any) !== 'undefined') {
    const eProto: any = (Element as any).prototype;
    if (typeof eProto.hasPointerCapture !== 'function') {
      Object.defineProperty(eProto, 'hasPointerCapture', {
        value: () => false,
        writable: true,
        configurable: true,
      });
    }
    if (typeof eProto.setPointerCapture !== 'function') {
      Object.defineProperty(eProto, 'setPointerCapture', {
        value: () => {},
        writable: true,
        configurable: true,
      });
    }
    if (typeof eProto.releasePointerCapture !== 'function') {
      Object.defineProperty(eProto, 'releasePointerCapture', {
        value: () => {},
        writable: true,
        configurable: true,
      });
    }
  }

  // Polyfill ResizeObserver for components that rely on it
  if (typeof (window as any).ResizeObserver === 'undefined') {
    class ResizeObserverPolyfill {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      observe(_target: Element, _options?: ResizeObserverOptions) {}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      unobserve(_target: Element) {}
      disconnect() {}
    }
    (window as any).ResizeObserver = ResizeObserverPolyfill as any;
    (globalThis as any).ResizeObserver = ResizeObserverPolyfill as any;
  }
}
