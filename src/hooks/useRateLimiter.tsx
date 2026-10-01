import { useState, useCallback } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

interface RateLimitState {
  attempts: number;
  firstAttempt: number;
  isBlocked: boolean;
  blockUntil: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 20000, // 2 sec
  blockDurationMs: 100000, // 1 minutes
};

export const useRateLimiter = (key: string, config: Partial<RateLimitConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const storageKey = `rateLimiter_${key}`;

  const [state, setState] = useState<RateLimitState>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        
        // Check if block has expired
        if (parsed.isBlocked && now > parsed.blockUntil) {
          return { attempts: 0, firstAttempt: 0, isBlocked: false, blockUntil: 0 };
        }
        
        // Check if window has expired
        if (now - parsed.firstAttempt > finalConfig.windowMs) {
          return { attempts: 0, firstAttempt: 0, isBlocked: false, blockUntil: 0 };
        }
        
        return parsed;
      }
    } catch (error) {
      console.error('Error reading rate limiter state:', error);
    }
    
    return { attempts: 0, firstAttempt: 0, isBlocked: false, blockUntil: 0 };
  });

  const updateState = useCallback((newState: RateLimitState) => {
    setState(newState);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving rate limiter state:', error);
    }
  }, [storageKey]);

  const attempt = useCallback(() => {
    const now = Date.now();
    
    // Check if currently blocked
    if (state.isBlocked && now < state.blockUntil) {
      return false;
    }
    
    // Reset if block expired
    if (state.isBlocked && now >= state.blockUntil) {
      updateState({ attempts: 1, firstAttempt: now, isBlocked: false, blockUntil: 0 });
      return true;
    }
    
    // Reset if window expired
    if (now - state.firstAttempt > finalConfig.windowMs) {
      updateState({ attempts: 1, firstAttempt: now, isBlocked: false, blockUntil: 0 });
      return true;
    }
    
    // Increment attempts
    const newAttempts = state.attempts + 1;
    const firstAttempt = state.firstAttempt || now;
    
    // Check if should block
    if (newAttempts > finalConfig.maxAttempts) {
      updateState({
        attempts: newAttempts,
        firstAttempt,
        isBlocked: true,
        blockUntil: now + finalConfig.blockDurationMs
      });
      return false;
    }
    
    // Update attempts
    updateState({
      attempts: newAttempts,
      firstAttempt,
      isBlocked: false,
      blockUntil: 0
    });
    
    return true;
  }, [state, finalConfig, updateState]);

  const reset = useCallback(() => {
    updateState({ attempts: 0, firstAttempt: 0, isBlocked: false, blockUntil: 0 });
  }, [updateState]);

  const getTimeUntilReset = useCallback(() => {
    const now = Date.now();
    if (state.isBlocked) {
      return Math.max(0, state.blockUntil - now);
    }
    if (state.firstAttempt) {
      return Math.max(0, (state.firstAttempt + finalConfig.windowMs) - now);
    }
    return 0;
  }, [state, finalConfig]);

  return {
    canAttempt: !state.isBlocked || Date.now() >= state.blockUntil,
    attemptsRemaining: Math.max(0, finalConfig.maxAttempts - state.attempts),
    isBlocked: state.isBlocked && Date.now() < state.blockUntil,
    attempt,
    reset,
    getTimeUntilReset
  };
};