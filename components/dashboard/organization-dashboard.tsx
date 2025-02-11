"use client";

import { z } from "zod";

import { getOrganizationStats } from "@/app/(dashboard)/organizations/[organizationId]/actions";
import { Card } from "@/components/ui/card";
import { useOrganizationAccess } from "@/hooks/auth/use-organization-access";
import { useSession } from "@/hooks/auth/use-session";
import { useApiQuery } from "@/hooks/query/use-api-query";
import { authClient } from "@/lib/auth/auth-client";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";
import { DashboardSkeleton } from "./dashboard-skeleton";

const organizationStatsSchema = z.object({
  totalMembers: z.number(),
  activeMembers: z.number(),
  pendingInvitations: z.number(),
});

export function OrganizationDashboard() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { isAuthenticated } = useSession();
  const {
    isLoading: isOrgLoading,
    isAdmin,
    isOwner,
  } = useOrganizationAccess(activeOrg?.id);

  const { data: stats, isLoading: isStatsLoading } = useApiQuery(
    queryKeys.organizations.stats(activeOrg?.id ?? ""),
    async () => {
      if (!activeOrg?.id) throw new Error("No active organization");
      const response = await getOrganizationStats(activeOrg.id);
      if (!response.success || !response.data) {
        throw new Error(
          response.error?.message ?? "Failed to fetch organization stats"
        );
      }
      return response.data;
    },
    organizationStatsSchema,
    {
      ...cacheConfig.queries.organization,
      enabled: Boolean(activeOrg?.id) && isAuthenticated,
    }
  );

  if (isOrgLoading || isStatsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <h3 className="font-semibold">Members</h3>
        <p className="text-2xl">{stats?.totalMembers ?? 0}</p>
      </Card>

      {isAdmin && (
        <Card className="p-4">
          <h3 className="font-semibold">Pending Invites</h3>
          <p className="text-2xl">{stats?.pendingInvitations ?? 0}</p>
        </Card>
      )}

      {isOwner && (
        <Card className="p-4">
          <h3 className="font-semibold">Active Members</h3>
          <p className="text-2xl">{stats?.activeMembers ?? 0}</p>
        </Card>
      )}
    </div>
  );
}
