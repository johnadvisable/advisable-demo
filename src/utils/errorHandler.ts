// Centralized error handling utilities

export interface ErrorWithMessage {
  message: string;
  code?: string;
}

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}

// Enhanced logging for development
export function logError(context: string, error: unknown, additionalData?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 Error in ${context}`);
    console.error('Error:', error);
    if (additionalData) {
      console.log('Additional data:', additionalData);
    }
    console.groupEnd();
  }
}

// Production-safe error reporting 
export function reportError(context: string, error: unknown, additionalData?: Record<string, unknown>): void {
  // In production, you would send this to a monitoring service like Sentry
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { tags: { context }, extra: additionalData });
    console.error(`Production Error [${context}]:`, getErrorMessage(error));
  } else {
    logError(context, error, additionalData);
  }
}