// @ts-nocheck
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { buildWebMcpTools } from './tools';

/**
 * Registers the site's WebMCP tools on `document.modelContext` so agentic
 * browsers (ChatGPT Atlas, Comet, Copilot Mode, Claude in Chrome) can use the
 * website directly. The runtime is loaded lazily and after first paint so it
 * never blocks initial rendering.
 */
export default function WebMcpProvider() {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const navigateRef = useRef(navigate);
  const languageRef = useRef(currentLanguage);

  navigateRef.current = navigate;
  languageRef.current = currentLanguage;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let controller: AbortController | null = null;
    let cancelled = false;

    const start = async () => {
      try {
        const { initializeWebModelContext } = await import('@mcp-b/global');
        if (cancelled) return;

        initializeWebModelContext({
          transport: { tabServer: { allowedOrigins: ['*'] } },
        });

        const modelContext = (document as any).modelContext;
        if (!modelContext?.registerTool) return;

        controller = new AbortController();
        const tools = buildWebMcpTools({
          get language() {
            return languageRef.current;
          },
          navigate: (path: string) => navigateRef.current(path),
        });

        for (const tool of tools) {
          await modelContext.registerTool(tool, { signal: controller.signal });
        }
      } catch (error) {
        // WebMCP is progressive enhancement: never break the site if it fails.
        console.warn('WebMCP initialization skipped:', error);
      }
    };

    const idle = (window as any).requestIdleCallback
      ? (window as any).requestIdleCallback(start, { timeout: 3000 })
      : window.setTimeout(start, 1200);

    return () => {
      cancelled = true;
      controller?.abort();
      if ((window as any).cancelIdleCallback) (window as any).cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  return null;
}
