/**
 * @fileoverview Contains mutation helpers for invalidating React Query cache entries
 * @module lib/query/mutations
 */

import { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "./keys";

/**
 * Invalidates all admin-related queries in the cache, triggering refetches
 *
 * @param queryClient - The React Query client instance
 *
 * @example
 * // Inside a mutation's onSuccess callback
 * const queryClient = useQueryClient();
 * invalidateAdminQueries(queryClient);
 *
 * @example
 * // After an admin action that modifies data
 * const handleUserUpdate = async () => {
 *   await updateUser(data);
 *   invalidateAdminQueries(queryClient);
 * };
 *
 * @useCase
 * - After updating user permissions
 * - After modifying admin settings
 * - When admin stats need refreshing
 * - After bulk user operations
 *
 * @remarks
 * This function invalidates three query types:
 * 1. Admin statistics
 * 2. Permission listings (with default limit of 100)
 * 3. User listings
 */
export function invalidateAdminQueries(queryClient: QueryClient) {
  void Promise.all([
    queryClient.invalidateQueries({
      queryKey: queryKeys.admin.stats(),
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.admin.permissions(100), // Default limit
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.users.list(),
    }),
  ]);
}
