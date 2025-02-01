import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getAdminStatsAction } from "@/app/(admin)/_actions/stats";
import { queryKeys } from "@/lib/query/keys";
import { isQueryError } from "@/lib/query/types";
import type { AdminStatsResponse } from "@/lib/types/admin";

export function useAdminStats() {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.admin.stats(),
      queryFn: getAdminStatsAction,
    });
  }, [queryClient]);

  return useQuery<AdminStatsResponse>({
    queryKey: queryKeys.admin.stats(),
    queryFn: getAdminStatsAction,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    meta: {
      onError: (error: unknown) => {
        const message = isQueryError(error)
          ? error.message
          : "Failed to load admin stats";
        toast.error(message);
      },
    },
  });
}
