"use client";

import { useSession } from "@/hooks/auth/use-session";
import { useApiQuery } from "@/hooks/query/use-api-query";
import { authClient } from "@/lib/auth/auth-client";
import { omittedOrganizationSelectSchema } from "@/lib/db/schema";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";

export function useOrganizations() {
  const { isAuthenticated } = useSession();

  return useApiQuery(
    queryKeys.organizations.list(),
    async () => {
      if (!isAuthenticated) return [];

      const { data } = await authClient.organization.list();
      return (
        data?.map((org) => ({
          ...org,
          createdAt: new Date(org.createdAt ?? 0),
        })) ?? []
      );
    },
    omittedOrganizationSelectSchema.array(),
    {
      ...cacheConfig.queries.organization,
      enabled: !!isAuthenticated,
    }
  );
}
