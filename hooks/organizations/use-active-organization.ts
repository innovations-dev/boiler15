"use client";

import { useApiQuery } from "@/hooks/query/use-api-query";
import { authClient } from "@/lib/auth/auth-client";
import { omittedOrganizationSelectSchema } from "@/lib/db/schema";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";
import { useSession } from "../auth/use-session";

export function useActiveOrganization() {
  // const { session } = useSession();
  // const activeOrganizationId = session?.activeOrganizationId;

  return useApiQuery(
    queryKeys.organizations.active(),
    async () => {
      const { data } = await authClient.getSession();
      console.log("🚀 ~ useActiveOrganization: queryKeys.organizations.active");
      const activeOrganizationId = data?.session.activeOrganizationId;
      if (!activeOrganizationId) {
        console.log("useActiveOrganization: No active organization id found");
        return null;
      }
      console.log(
        "🚀 ~ useActiveOrganization: param check: activeOrganizationId",
        activeOrganizationId
      );

      const { data: organizations } = await authClient.useActiveOrganization();
      console.log("🚀 ~ useActiveOrganization:data:", organizations);
      return organizations ?? null;
    },
    omittedOrganizationSelectSchema.nullable(),
    {
      ...cacheConfig.queries.organization,
      enabled: true,
    }
  );
}
