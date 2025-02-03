/**
 * @fileoverview Hook for fetching and managing admin user permissions data
 * @module hooks/admin/use-admin-permissions
 */

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UserWithRole } from "better-auth/plugins";

import { useApiQuery } from "@/hooks/query/use-api-query";
import { authClient } from "@/lib/auth/auth-client";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";
import {
  AdminPermissionsData,
  adminPermissionsSchema,
} from "@/lib/types/admin";

/**
 * Transforms the raw user data response into a standardized AdminPermissionsData format
 * @param {Awaited<ReturnType<typeof authClient.admin.listUsers>>} response - Raw response from the auth client
 * @returns {AdminPermissionsData} Normalized admin permissions data
 * @private
 */
const defaultResponse = (
  response: Awaited<ReturnType<typeof authClient.admin.listUsers>>
): AdminPermissionsData => {
  return {
    users:
      response.data?.users.map((user: UserWithRole) => ({
        ...user,
        role: user.role ?? null,
        banned: user.banned ?? null,
        image: user.image ?? null,
        banReason: user.banReason ?? null,
        banExpires: user.banExpires ? new Date(user.banExpires) : null,
      })) ?? [],
  };
};

/**
 * Custom hook for fetching and managing admin user permissions
 *
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const { data, isLoading, error } = useAdminPermissions(50);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error loading admin data</div>;
 *
 *   return (
 *     <div>
 *       {data?.users.map(user => (
 *         <UserRow key={user.id} user={user} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @param {number} [limit=100] - Maximum number of users to fetch
 * @returns {UseQueryResult<AdminPermissionsData>} Query result containing admin permissions data
 *
 * @throws Will throw an error if the user doesn't have admin privileges
 * @throws Will throw an error if the data fails validation against adminPermissionsSchema
 *
 * @see {@link AdminPermissionsData} for the structure of the returned data
 * @see {@link authClient.admin.listUsers} for the underlying API call
 */
export function useAdminPermissions(limit: number = 100) {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.admin.permissions(limit),
      queryFn: async () => {
        const response = await authClient.admin.listUsers({
          query: { limit },
        });
        return defaultResponse(response);
      },
    });
  }, [queryClient, limit]);

  return useApiQuery(
    queryKeys.admin.permissions(limit),
    async () => {
      const response = await authClient.admin.listUsers({
        query: { limit },
      });
      return defaultResponse(response);
    },
    adminPermissionsSchema,
    {
      ...cacheConfig.queries.default,
    }
  );
}
