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
    all: ["organizations"] as const, // Used as a parent key for invalidating all session-related queries at once
    /** Key for organization list */
    list: () => [...queryKeys.organizations.all, "list"] as const, // Specifically for fetching the list of sessions
    /** Key for organization access */
    access: (organizationId: string) =>
      [...queryKeys.organizations.all, "access", organizationId] as const, // Specifically for fetching a single organization by ID
    member: (organizationId: string) =>
      [...queryKeys.organizations.all, "member", organizationId] as const, // Specifically for fetching the member of an organization
    active: () => [...queryKeys.organizations.all, "active"] as const, // Specifically for fetching the active organization
  },

  /** Session-related query keys */
  sessions: {
    /** Base key for all session queries */
    all: ["sessions"] as const,
    list: () => ["sessions", "list"] as const,
    /** Key for current session */
    current: () => ["sessions", "current"] as const,
  },

  /** User-related query keys */
  users: {
    /** Base key for all user queries */
    all: ["users"] as const,
    /** Key for current user */
    current: () => [...queryKeys.users.all, "current"] as const,
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
