import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UserWithRole } from "better-auth/plugins";

import { useApiQuery } from "@/hooks/query/use-api-query";
import { authClient } from "@/lib/auth/auth-client";
import { UserRole } from "@/lib/constants/roles";
import { userSelectSchema } from "@/lib/db/schema";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";
import { createApiResponseSchema } from "@/lib/schemas/api-types";

/**
 * Interface defining the options for the useUsersByRole hook
 * @interface UseUsersByRoleOptions
 * @property {UserRole} role - The role to filter users by
 * @property {number} [limit=10] - Maximum number of users to return
 */
interface UseUsersByRoleOptions {
  role: UserRole;
  limit?: number;
}

/**
 * Transforms the API response to match the expected schema
 * @private
 * @param {Awaited<ReturnType<typeof authClient.admin.listUsers>>} response - The raw API response
 * @returns {{ data: Array<ReturnType<typeof userSelectSchema.parse>> }} Parsed user data
 */
const defaultResponse = (
  response: Awaited<ReturnType<typeof authClient.admin.listUsers>>
) => ({
  data:
    response.data?.users.map((user: UserWithRole) =>
      userSelectSchema.parse(user)
    ) ?? [],
});

/**
 * Hook to fetch and manage users filtered by role
 *
 * @description
 * This hook provides functionality to fetch users based on their role, with built-in
 * prefetching and caching using React Query. It automatically handles data validation
 * using Zod schemas and provides type-safe responses.
 *
 * @example
 * ```tsx
 * function AdminUsersList() {
 *   const { data, isLoading, error } = useUsersByRole({
 *     role: 'ADMIN',
 *     limit: 20
 *   });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <ul>
 *       {data?.users.map(user => (
 *         <li key={user.id}>{user.email}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 *
 * @param {UseUsersByRoleOptions} options - Configuration options for the hook
 * @param {UserRole} options.role - The role to filter users by
 * @param {number} [options.limit=10] - Maximum number of users to return
 *
 * @returns {UseQueryResult} A React Query result object containing:
 * - data: Array of users matching the role
 * - isLoading: Boolean indicating if the query is loading
 * - error: Any error that occurred during the query
 * - And other React Query properties
 *
 * @throws Will throw an error if the API request fails or if the response doesn't match the expected schema
 */
export function useUsersByRole({ role, limit = 10 }: UseUsersByRoleOptions) {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.users.byRole(role),
      queryFn: async () => {
        const response = await authClient.admin.listUsers({
          query: {
            limit,
            filterField: "role",
            filterValue: role,
            filterOperator: "eq",
          },
        });
        return defaultResponse(response);
      },
    });
  }, [queryClient, role, limit]);

  return useApiQuery(
    queryKeys.users.byRole(role),
    async () => {
      const response = await authClient.admin.listUsers({
        query: {
          limit,
          filterField: "role",
          filterValue: role,
          filterOperator: "eq",
        },
      });
      return defaultResponse(response);
    },
    createApiResponseSchema(userSelectSchema.array()),
    {
      ...cacheConfig.queries.user,
    }
  );
}
