import type { QueryClient } from "@tanstack/react-query";

/**
 * Prefetches data for a React Query query and stores it in the cache.
 * This utility simplifies the prefetching process by providing a type-safe wrapper
 * around queryClient.prefetchQuery.
 *
 * @template T - The type of data that will be returned by the queryFn
 *
 * @param {Object} options - The prefetch options
 * @param {QueryClient} options.queryClient - The React Query client instance
 * @param {readonly unknown[]} options.queryKey - The query key used to identify this query in the cache
 * @param {() => Promise<T>} options.queryFn - The function that fetches the data
 *
 * @example
 * // Basic usage in a server component
 * await prefetchQuery({
 *   queryClient,
 *   queryKey: ['users'],
 *   queryFn: () => fetchUsers()
 * });
 *
 * @example
 * // Usage with type parameters
 * await prefetchQuery<User[]>({
 *   queryClient,
 *   queryKey: ['users', { status: 'active' }],
 *   queryFn: () => fetchUsersByStatus('active')
 * });
 *
 * @example
 * // Common use-case in Next.js page/layout
 * export default async function UsersPage() {
 *   await prefetchQuery({
 *     queryClient,
 *     queryKey: ['users'],
 *     queryFn: () => fetchUsers()
 *   });
 *
 *   return <UsersList />;
 * }
 */
export function prefetchQuery<T>({
  queryClient,
  queryKey,
  queryFn,
}: {
  queryClient: QueryClient;
  queryKey: readonly unknown[];
  queryFn: () => Promise<T>;
}) {
  void queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
}
