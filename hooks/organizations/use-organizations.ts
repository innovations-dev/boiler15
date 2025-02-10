"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/hooks/auth/use-session";
import { useApiQuery } from "@/hooks/query/use-api-query";
import { authClient } from "@/lib/auth/auth-client";
import { omittedOrganizationSelectSchema } from "@/lib/db/schema";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";

export function useOrganizations() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSession();

  // Prefetch on mount if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    void queryClient.prefetchQuery({
      queryKey: queryKeys.organizations.list(),
      queryFn: async () => {
        const { data } = await authClient.organization.list();
        return (
          data?.map((org) => ({
            ...org,
            createdAt: new Date(org.createdAt ?? 0),
          })) ?? []
        );
      },
    });
  }, [queryClient, isAuthenticated]);

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
