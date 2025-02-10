"use client";

import { z } from "zod";

import { getOrganizationStats } from "@/app/organizations/[organizationId]/actions";
import { Card } from "@/components/ui/card";
import { useOrganizationAccess } from "@/hooks/auth/use-organization-access";
import { useSession } from "@/hooks/auth/use-session";
import { useApiQuery } from "@/hooks/query/use-api-query";
import { queryKeys } from "@/lib/query/keys";
import { DashboardSkeleton } from "./dashboard-skeleton";

interface OrganizationDashboardProps {
  organizationId?: string;
}

const organizationStatsSchema = z.object({
  totalMembers: z.number(),
  activeMembers: z.number(),
  pendingInvitations: z.number(),
});

export function OrganizationDashboard({
  organizationId,
}: OrganizationDashboardProps) {
  const { isAuthenticated } = useSession();
  const {
    // organization,
    isLoading: isOrgLoading,
    isAdmin,
    isOwner,
    requireAccess,
  } = useOrganizationAccess(organizationId);

  const { data: stats, isLoading: isStatsLoading } = useApiQuery(
    queryKeys.organizations.stats(organizationId ?? ""),
    async () => {
      const response = await getOrganizationStats(organizationId ?? "");
      console.log("🚀 ~ dashboard:response:", response);
      if (!response.success || !response.data)
        throw new Error(
          response.error?.message ?? "Failed to fetch organization stats"
        );
      return response.data;
    },
    organizationStatsSchema,
    {
      enabled: Boolean(organizationId) && isAuthenticated,
    }
  );
  console.log("🚀 ~ stats:", stats);

  const content =
    isOrgLoading || isStatsLoading ? (
      <DashboardSkeleton />
    ) : (
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

  return content;
}
