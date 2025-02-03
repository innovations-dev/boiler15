import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UserWithRole } from "better-auth/plugins";

import { useApiQuery } from "@/hooks/query/use-api-query";
import { authClient } from "@/lib/auth/auth-client";
import { userSelectSchema } from "@/lib/db/schema";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";
import { createApiResponseSchema } from "@/lib/schemas/api-types";

const defaultResponse = (
  response: Awaited<ReturnType<typeof authClient.admin.listUsers>>
) => ({
  data:
    response.data?.users.map((user: UserWithRole) =>
      userSelectSchema.parse(user)
    ) ?? [],
});

/**
 * Custom hook for fetching and managing user data in the application.
 *
 * @description
 * This hook provides access to the list of users with their roles, utilizing React Query for
 * data fetching and caching. It automatically prefetches user data on mount for improved UX.
 *
 * @example
 * ```tsx
 * function UserList() {
 *   const { data, isLoading, error } = useUsers();
 *
 *   if (isLoading) return <div>Loading users...</div>;
 *   if (error) return <div>Error loading users</div>;
 *
 *   return (
 *     <ul>
 *       {data?.users.map((user) => (
 *         <li key={user.id}>{user.email}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 *
 * @returns {Object} Query object containing:
 * - data: Array of parsed user objects with their roles
 * - isLoading: Boolean indicating if the query is loading
 * - error: Error object if the query failed
 * - and other React Query properties
 *
 * @useCase
 * - Admin dashboards displaying user management interfaces
 * - User lists in administrative sections
 * - User role management systems
 * - Any component requiring access to the full user list
 *
 * @see {@link https://tanstack.com/query/latest/docs/react/reference/useQuery}
 */
export function useUsers() {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.users.all,
      queryFn: async () => {
        const response = await authClient.admin.listUsers({ query: {} });
        return defaultResponse(response);
      },
    });
  }, [queryClient]);

  return useApiQuery(
    queryKeys.users.all,
    async () => {
      const response = await authClient.admin.listUsers({ query: {} });
      return defaultResponse(response);
    },
    createApiResponseSchema(userSelectSchema.array()),
    {
      ...cacheConfig.queries.user,
    }
  );
}
