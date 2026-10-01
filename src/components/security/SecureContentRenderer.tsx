import DOMPurify from 'dompurify';
import { useEffect } from 'react';

interface SecureContentRendererProps {
  content: string;
  className?: string;
}

// Allow only trusted video embed providers (YouTube)
const ALLOWED_IFRAME_HOSTS = [
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
  'player.vimeo.com',
];

// Register a hook once that strips any iframe whose src is not on the allowlist
let hookRegistered = false;
const ensureIframeHook = () => {
  if (hookRegistered) return;
  hookRegistered = true;
  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName !== 'iframe') return;
    const src = (node as HTMLIFrameElement).getAttribute('src') || '';
    try {
      const url = new URL(src, window.location.origin);
      if (!ALLOWED_IFRAME_HOSTS.includes(url.hostname)) {
        node.parentNode?.removeChild(node);
      }
    } catch {
      node.parentNode?.removeChild(node);
    }
  });
};

/**
 * Renders HTML content safely by sanitizing it with DOMPurify.
 * Supports inline YouTube/Vimeo embeds via <iframe> with a strict host allowlist.
 */
const SecureContentRenderer = ({ content, className = '' }: SecureContentRendererProps) => {
  useEffect(() => {
    ensureIframeHook();
  }, []);
  ensureIframeHook();

  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'blockquote', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'code', 'pre', 'iframe'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id', 'src', 'alt', 'style', 'loading', 'width', 'height', 'title', 'allow', 'allowfullscreen', 'frameborder', 'referrerpolicy'],
    ADD_TAGS: ['iframe'],
  });

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default SecureContentRenderer;
