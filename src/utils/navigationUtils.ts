// Navigation utilities to replace window.location.href usage
import { NavigateFunction } from 'react-router-dom';

export const safeNavigate = (navigate: NavigateFunction, path: string, options?: { replace?: boolean }) => {
  try {
    navigate(path, options);
  } catch (error) {
    // Fallback to window.location if React Router navigation fails
    console.warn('React Router navigation failed, falling back to window.location:', error);
    window.location.href = path;
  }
};

export const handleExternalLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

// Replace window.location.reload() with a smarter refresh pattern
export const smartRefresh = (navigate: NavigateFunction, currentPath: string) => {
  navigate(0); // React Router's way to refresh current route
  // Fallback if navigate(0) doesn't work in all cases
  setTimeout(() => {
    if (window.location.pathname === currentPath) {
      window.location.reload();
    }
  }, 100);
};