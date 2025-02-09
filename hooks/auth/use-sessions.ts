/**
 * @fileoverview Hook for managing and querying user sessions
 * @see {@link @/app/_providers/query-client-provider.tsx} for default query options
 */

/**
 * @module useSessions
 * @description A React hook that provides functionality to fetch and manage user sessions
 *
 * @example
 * // Basic usage
 * function SessionsList() {
 *   const { data, isLoading, error } = useSessions();
 *
 *   if (isLoading) return <div>Loading sessions...</div>;
 *   if (error) return <div>Error loading sessions</div>;
 *
 *   return (
 *     <ul>
 *       {data?.map(session => (
 *         <li key={session.id}>{session.userAgent}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 *
 * @use-cases
 * - Displaying a list of user's active sessions
 * - Monitoring user's login activity
 * - Managing multi-device sessions
 * - Security auditing and session tracking
 */

/*
@See: @/app/_providers/query-client-provider.tsx for the default options for this query
*/

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useApiQuery } from "@/hooks/query/use-api-query";
import { authClient } from "@/lib/auth/auth-client";
import { sessionSelectSchemaCoerced } from "@/lib/db/schema";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";

/**
 * Hook for fetching and managing user sessions
 * @returns {UseQueryResult} Query result object containing session data, loading state, and error state
 * @throws Will throw an error if the API request fails or if the response validation fails
 */
export function useSessions() {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.sessions.all,
      queryFn: async () => {
        const { data } = await authClient.listSessions();
        return (
          data?.map((session) => sessionSelectSchemaCoerced.parse(session)) ??
          []
        );
      },
    });
  }, [queryClient]);

  return useApiQuery(
    queryKeys.sessions.all,
    async () => {
      const { data } = await authClient.listSessions();
      return (
        data?.map((session) => sessionSelectSchemaCoerced.parse(session)) ?? []
      );
    },
    sessionSelectSchemaCoerced.array(),
    {
      ...cacheConfig.queries.session,
    }
  );
}
