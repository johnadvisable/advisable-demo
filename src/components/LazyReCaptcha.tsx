import { lazy, Suspense } from 'react';

// Lazy load ReCaptcha only when needed
const ReCAPTCHA = lazy(() => import('react-google-recaptcha'));

interface LazyReCaptchaProps {
  sitekey: string;
  onChange: (token: string | null) => void;
  onExpired?: () => void;
  className?: string;
}

const LazyReCaptcha = (props: LazyReCaptchaProps) => {
  return (
    <Suspense fallback={
      <div className="h-20 bg-gray-100 animate-pulse rounded flex items-center justify-center">
        <span className="text-gray-500">Loading security check...</span>
      </div>
    }>
      <ReCAPTCHA {...props} />
    </Suspense>
  );
};

export default LazyReCaptcha;