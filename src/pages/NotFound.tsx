import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import { buildNavigationUrl } from "@/utils/multilanguageUtils";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation('shared');
  const currentLanguage = useCurrentLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    // Signal Prerender.io / prerender-alpine to capture the snapshot now
    // and emit an HTTP 404 status (instead of an empty 200 body).
    if (typeof window !== 'undefined') {
      // @ts-expect-error – prerenderReady is read by the headless renderer
      window.prerenderReady = true;
    }
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Advisable</title>
        <meta name="description" content="The page you're looking for doesn't exist. Please check the URL or navigate back to our homepage." />
        <meta name="robots" content="noindex, nofollow" />
        {/* Tells prerender to return real HTTP 404 instead of empty 200 */}
        <meta name="prerender-status-code" content="404" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <div className="text-8xl">🧑‍🚀</div>
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <p className="text-xl text-muted-foreground">{t('notFound.description')}</p>
          <Link
            to={buildNavigationUrl('/', currentLanguage)}
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t('notFound.goHome')}
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
