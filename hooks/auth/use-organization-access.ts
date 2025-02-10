import { useRouter } from "next/navigation";
import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";

import { Member, Organization } from "@/lib/db/schema";
import { queryKeys } from "@/lib/query/keys";
import { useSession } from "./use-session";

export type OrganizationAccess = {
  organization: Organization;
  member: Member;
};

/**
 * TODO: This is unused and needs to be refactored to use the update ApiQuery api.
 * Hook for managing organization access control
 * @param organizationId - The ID of the organization to check access for
 * @returns Organization access data and utility functions
 */
export function useOrganizationAccess(organizationId?: string) {
  const router = useRouter();
  const { isAuthenticated, isLoading: isSessionLoading } = useSession();

  const { data: access, isLoading: isAccessLoading } = useQuery({
    queryKey: queryKeys.organizations.access(organizationId ?? ""),
    queryFn: async () => {
      if (!organizationId || !isAuthenticated) return null;
      try {
        const { data } = await betterFetch<OrganizationAccess>(
          `/api/organizations/${organizationId}/access` // NOTE:  This endpoint doesn't exist yet
        );
        return data;
      } catch (error) {
        return null;
      }
    },
    enabled: Boolean(organizationId) && isAuthenticated,
  });

  const isLoading = isSessionLoading || isAccessLoading;
  const isMember = Boolean(access?.member);
  const role = access?.member?.role;
  const isOwner = role === "owner";
  const isAdmin = role === "admin" || isOwner;

  const requireAccess = (callback: () => void) => {
    if (!isMember && !isLoading) {
      router.push("/organizations");
      return;
    }
    callback();
  };

  const requireAdmin = (callback: () => void) => {
    if (!isAdmin && !isLoading) {
      router.push("/organizations");
      return;
    }
    callback();
  };

  const requireOwner = (callback: () => void) => {
    if (!isOwner && !isLoading) {
      router.push("/organizations");
      return;
    }
    callback();
  };

  return {
    organization: access?.organization,
    member: access?.member,
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
