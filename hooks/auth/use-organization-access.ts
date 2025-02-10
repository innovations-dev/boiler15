import { useRouter } from "next/navigation";
import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";

import { Member, Organization } from "@/lib/db/schema";
import { queryKeys } from "@/lib/query/keys";
import { useSession } from "./use-session";

export interface OrganizationAccess {
  organization: Organization;
  member: Member;
}

/**
 * Hook for managing organization access control and permissions
 *
 * @param organizationId - The ID of the organization to check access for
 * @returns Organization access data and permission check utilities
 *
 * @example
 * ```tsx
 * const {
 *   isAdmin,
 *   requireAccess,
 *   organization
 * } = useOrganizationAccess(orgId);
 *
 * // Guard sensitive operations
 * requireAccess(() => {
 *   // Protected operation
 * });
 * ```
 */
export function useOrganizationAccess(organizationId?: string) {
  const router = useRouter();
  const { isAuthenticated, isLoading: isSessionLoading } = useSession();

  // Get organization details
  const { data: organization, isLoading: isOrgLoading } = useQuery({
    queryKey: queryKeys.organizations.access(organizationId ?? ""),
    queryFn: async () => {
      if (!organizationId || !isAuthenticated) return null;
      const { data } = await betterFetch<{ organization: Organization }>(
        `/api/organization/get-full-organization?organizationId=${organizationId}`
      );
      return data?.organization;
    },
    enabled: Boolean(organizationId) && isAuthenticated,
  });

  // Get member details - includes role and permissions
  const { data: member, isLoading: isMemberLoading } = useQuery({
    queryKey: queryKeys.organizations.member(organizationId ?? ""),
    queryFn: async () => {
      if (!organizationId || !isAuthenticated) return null;
      const { data } = await betterFetch<{ member: Member }>(
        `/api/organization/get-active-member?organizationId=${organizationId}`
      );
      return data?.member;
    },
    enabled: Boolean(organizationId) && isAuthenticated,
  });

  const isLoading = isSessionLoading || isOrgLoading || isMemberLoading;
  const isMember = Boolean(member);
  const role = member?.role;
  const isOwner = role === "owner";
  const isAdmin = role === "admin" || isOwner;

  /**
   * Guards operations requiring basic membership
   */
  const requireAccess = (callback: () => void) => {
    if (!isMember && !isLoading) {
      router.push("/organizations");
      return;
    }
    callback();
  };

  /**
   * Guards operations requiring admin privileges
   */
  const requireAdmin = (callback: () => void) => {
    if (!isAdmin && !isLoading) {
      router.push("/organizations");
      return;
    }
    callback();
  };

  /**
   * Guards operations requiring owner privileges
   */
  const requireOwner = (callback: () => void) => {
    if (!isOwner && !isLoading) {
      router.push("/organizations");
      return;
    }
    callback();
  };

  return {
    organization,
    member,
    isLoading,
    isMember,
    isAdmin,
    isOwner,
    role,
    requireAccess,
    requireAdmin,
    requireOwner,
  };
}
