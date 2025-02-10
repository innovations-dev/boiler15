"use client";

import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { useOrganizationAccess } from "@/hooks/auth/use-organization-access";
import { useSession } from "@/hooks/auth/use-session";
import { queryKeys } from "@/lib/query/keys";
import { DashboardSkeleton } from "./dashboard-skeleton";

interface OrganizationDashboardProps {
  organizationId?: string;
}

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

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: queryKeys.organizations.access(organizationId ?? ""),
    queryFn: async () => {
      if (!organizationId) return null;
      const response = await fetch(
        `/api/organizations/${organizationId}/stats`
      );
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
    enabled: Boolean(organizationId) && isAuthenticated,
  });

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
            <p className="text-2xl">{stats?.pendingInvites ?? 0}</p>
          </Card>
        )}

        {isOwner && (
          <Card className="p-4">
            <h3 className="font-semibold">Usage</h3>
            <p className="text-2xl">{stats?.usage ?? 0}%</p>
          </Card>
        )}
      </div>
    );

  return content;
}
