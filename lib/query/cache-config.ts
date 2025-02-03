/**
 * @fileoverview Configuration for React Query cache management and defaults
 * @module lib/query/cache-config
 */

import { type QueryClient } from "@tanstack/react-query";

/**
 * Cache configuration settings for different data types
 * @typedef {Object} CacheConfig
 * @property {Object} queries - Query-specific cache settings
 */
export const cacheConfig = {
  queries: {
    // Default cache settings
    default: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    // User data - shorter stale time due to importance of freshness
    user: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
    // Organization data - can be cached longer
    organization: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    },
    // Static data - long cache times
    static: {
      staleTime: 24 * 60 * 60 * 1000, // 24 hours
      gcTime: 48 * 60 * 60 * 1000, // 48 hours
    },
  },
};

/**
 * Configures default cache settings for a QueryClient instance
 * @param {QueryClient} queryClient - The React Query client instance to configure
 *
 * @example
 * // In your app initialization:
 * const queryClient = new QueryClient();
 * configureCacheDefaults(queryClient);
 *
 * @example
 * // Custom usage with provider:
 * function QueryProvider({ children }: { children: React.ReactNode }) {
 *   const [queryClient] = useState(() => {
 *     const client = new QueryClient();
 *     configureCacheDefaults(client);
 *     return client;
 *   });
 *
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       {children}
 *     </QueryClientProvider>
 *   );
 * }
 *
 * @description
 * This function sets up default caching behavior with:
 * - 3 retry attempts for failed queries
 * - Exponential backoff for retry delays (capped at 30s)
 * - Disabled refetching on window focus
 *
 * Different cache durations are configured for various data types:
 * - Default: 5min stale / 10min garbage collection
 * - User data: 1min stale / 5min garbage collection
 * - Organization data: 10min stale / 30min garbage collection
 * - Static data: 24h stale / 48h garbage collection
 */
export function configureCacheDefaults(queryClient: QueryClient) {
  queryClient.setDefaultOptions({
    queries: {
      ...cacheConfig.queries.default,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
  });
}
