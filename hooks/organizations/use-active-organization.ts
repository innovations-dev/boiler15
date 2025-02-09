"use client";

import { useApiQuery } from "@/hooks/query/use-api-query";
import { authClient } from "@/lib/auth/auth-client";
import { omittedOrganizationSelectSchema } from "@/lib/db/schema";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";

export function useActiveOrganization() {
  const { data } = authClient.useSession();
  const activeOrganizationId = data?.session?.activeOrganizationId;

  return useApiQuery(
    queryKeys.organizations.active(),
    async () => {
      if (!activeOrganizationId) return null;

      const { data } = await authClient.useActiveOrganization();
      return data ?? null;
    },
    omittedOrganizationSelectSchema.nullable(),
    {
      ...cacheConfig.queries.organization,
      enabled: !!activeOrganizationId,
    }
  );
}
