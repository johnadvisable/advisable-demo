import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  cacheKey: string;
  localStorageKey?: string;
  cacheDuration?: number; // in milliseconds
  onSuccess?: (data: T) => void;
}

export function useOptimizedQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = { cacheKey: '' }
) {
  const [localData, setLocalData] = useState<T | null>(null);
  const [isLocalDataStale, setIsLocalDataStale] = useState(true);

  // Check for cached data in localStorage
  useEffect(() => {
    if (options.localStorageKey) {
      try {
        const cached = localStorage.getItem(options.localStorageKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const cacheDuration = options.cacheDuration || 5 * 60 * 1000; // 5 minutes default
          const isStale = Date.now() - timestamp > cacheDuration;
          
          if (!isStale) {
            setLocalData(data);
            setIsLocalDataStale(false);
          } else {
            localStorage.removeItem(options.localStorageKey);
          }
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        if (options.localStorageKey) {
          localStorage.removeItem(options.localStorageKey);
        }
      }
    }
  }, [options.localStorageKey, options.cacheDuration]);

  const queryResult = useQuery({
    queryKey,
    queryFn,
    enabled: isLocalDataStale,
    staleTime: options.cacheDuration || 5 * 60 * 1000, // 5 minutes
    gcTime: options.cacheDuration || 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options
  });

  // Handle successful data loading with useEffect
  useEffect(() => {
    if (queryResult.data && queryResult.isSuccess) {
      // Cache successful responses in localStorage
      if (options.localStorageKey && queryResult.data) {
        try {
          localStorage.setItem(
            options.localStorageKey,
            JSON.stringify({
              data: queryResult.data,
              timestamp: Date.now()
            })
          );
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
      }
      setLocalData(queryResult.data);
      setIsLocalDataStale(false);
      options.onSuccess?.(queryResult.data);
    }
  }, [queryResult.data, queryResult.isSuccess, options.localStorageKey, options.onSuccess]);

  // Return local data if available and not stale, otherwise return query result
  return {
    ...queryResult,
    data: !isLocalDataStale && localData ? localData : queryResult.data,
    isLoading: isLocalDataStale ? queryResult.isLoading : false,
    isFetching: queryResult.isFetching,
    isFromCache: !isLocalDataStale && !!localData
  };
}