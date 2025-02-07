/**
 * @fileoverview Centralized query key definitions for React Query/TanStack Query cache management.
 * These keys are used to organize and manage server state throughout the application.
 */

/**
 * @constant queryKeys
 * @description A strongly-typed object containing all query keys used for data fetching and cache management.
 * Each key follows a hierarchical structure to ensure proper cache invalidation and data organization.
 *
 * @example
 * // Fetching all organizations
 * useQuery({
 *   queryKey: queryKeys.organizations.list(),
 *   queryFn: fetchOrganizations
 * });
 *
 * // Fetching specific organization details
 * useQuery({
 *   queryKey: queryKeys.organizations.detail("org-123"),
 *   queryFn: () => fetchOrganizationById("org-123")
 * });
 *
 * // Invalidating all organization queries
 * queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
 */
export const queryKeys = {
  /** Organization-related query keys */
  organizations: {
    /** Base key for all organization queries */
    all: ["organizations"] as const,
    /** Key for organization list queries */
    list: () => [...queryKeys.organizations.all, "list"] as const,
    /** Key for specific organization details
     * @param id - Organization ID
     */
    detail: (id: string) =>
      [...queryKeys.organizations.all, "detail", id] as const,
    /** Key for organization members
     * @param id - Organization ID
     */
    members: (id: string) =>
      [...queryKeys.organizations.all, "members", id] as const,
  },

  /** User-related query keys */
  users: {
    /** Base key for all user queries */
    all: ["users"] as const,
    /** Key for user list queries */
    list: () => [...queryKeys.users.all, "list"] as const,
    /** Key for specific user details
     * @param id - User ID
     */
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
    /** Key for users filtered by role
     * @param role - User role
     */
    byRole: (role: string) => [...queryKeys.users.all, "role", role] as const,
  },

  /** Session-related query keys */
  sessions: {
    /** Base key for all session queries */
    all: ["sessions"] as const,
    /** Key for current session queries */
    current: () => [...queryKeys.sessions.all, "current"] as const,
    /** Key for session list queries */
    list: () => [...queryKeys.sessions.all, "list"] as const,
  },

  /** Team-related query keys */
  team: {
    /** Base key for all team queries */
    all: ["team"] as const,
    /** Key for team members within an organization
     * @param orgId - Organization ID
     */
    members: (orgId: string) =>
      [...queryKeys.team.all, orgId, "members"] as const,
  },

  /** Admin-related query keys */
  admin: {
    /** Base key for all admin queries */
    all: ["admin"] as const,
    /** Key for admin statistics queries */
    stats: () => [...queryKeys.admin.all, "stats"] as const,
    /** Key for permission queries with pagination
     * @param limit - Number of permissions to fetch
     */
    permissions: (limit: number) =>
      [...queryKeys.admin.all, "permissions", limit] as const,
    /** Key for system health metrics */
    health: () => [...queryKeys.admin.all, "health"] as const,
  },

  /** Audit-related query keys */
  audit: {
    /** Base key for all audit queries */
    all: ["audit"] as const,
    /** Key for audit logs queries */
    logs: () => [...queryKeys.audit.all, "logs"] as const,
  },
} as const;

/**
 * Common use-cases:
 *
 * 1. Fetching data:
 * ```typescript
 * const { data: organizations } = useQuery({
 *   queryKey: queryKeys.organizations.list(),
 *   queryFn: fetchOrganizations
 * });
 * ```
 *
 * 2. Cache invalidation:
 * ```typescript
 * // Invalidate all organization data
 * queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
 *
 * // Invalidate specific organization
 * queryClient.invalidateQueries({
 *   queryKey: queryKeys.organizations.detail("org-123")
 * });
 * ```
 *
 * 3. Optimistic updates:
 * ```typescript
 * const queryClient = useQueryClient();
 *
 * // Update organization cache optimistically
 * queryClient.setQueryData(
 *   queryKeys.organizations.detail("org-123"),
 *   (old) => ({ ...old, ...newData })
 * );
 * ```
 *
 * 4. Prefetching:
 * ```typescript
 * // Prefetch organization data
 * await queryClient.prefetchQuery({
 *   queryKey: queryKeys.organizations.detail("org-123"),
 *   queryFn: () => fetchOrganizationById("org-123")
 * });
 * ```
 */
