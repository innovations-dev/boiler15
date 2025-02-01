import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getOrganizationsAction } from "@/app/(admin)/_actions/organization";
import {
  omittedOrganizationSelectSchema,
  type Organization,
} from "@/lib/db/schema";
import { useApiQuery } from "@/lib/hooks/use-api-query";
import { queryKeys } from "@/lib/query/keys";
import { isQueryError } from "@/lib/query/types";

interface UseOrganizationsOptions {
  initialData?: Organization[];
}

export function useOrganizations() {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.organizations.list(),
      queryFn: async () => {
        const response = await getOrganizationsAction();
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data ?? [];
      },
    });
  }, [queryClient]);

  return useQuery<Organization[]>({
    queryKey: queryKeys.organizations.list(),
    queryFn: async () => {
      const response = await getOrganizationsAction();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data ?? [];
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to load organizations: ${error.message}`);
      },
    },
  });
}

export function useOrganizationsApi({
  initialData,
}: UseOrganizationsOptions = {}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.organizations.listApi(),
      queryFn: async () => {
        const response = await getOrganizationsAction();
        if (response.error) throw new Error(response.error.message);
        return response.data ?? [];
      },
    });
  }, [queryClient]);

  return useApiQuery(
    queryKeys.organizations.listApi(),
    async () => {
      const response = await getOrganizationsAction();
      if (response.error) throw new Error(response.error.message);
      return response.data ?? [];
    },
    omittedOrganizationSelectSchema.array(),
    {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      initialData: initialData
        ? {
            data: initialData,
            metadata: {
              timestamp: Date.now(),
              requestId: crypto.randomUUID(),
            },
          }
        : undefined,
    }
  );
}
