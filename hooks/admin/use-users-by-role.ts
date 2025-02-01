import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";
import { UserRole } from "@/lib/constants/roles";
import { UserSelectSchema } from "@/lib/db/schema";
import { queryKeys } from "@/lib/query/keys";
import { isQueryError } from "@/lib/query/types";

interface UseUsersByRoleOptions {
  role: UserRole;
  limit?: number;
}

export function useUsersByRole({ role, limit = 10 }: UseUsersByRoleOptions) {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.users.byRole(role),
      queryFn: () =>
        authClient.admin.listUsers({
          query: {
            limit,
            filterField: "role",
            filterValue: role,
            filterOperator: "eq",
          },
        }),
    });
  }, [queryClient, role, limit]);

  return useQuery({
    queryKey: queryKeys.users.byRole(role),
    queryFn: async () => {
      const response = await authClient.admin.listUsers({
        query: {
          limit,
          filterField: "role",
          filterValue: role,
          filterOperator: "eq",
        },
      });
      return {
        data: {
          users:
            response.data?.users.map((u) => UserSelectSchema.parse(u)) ?? [],
        },
      };
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    meta: {
      onError: (error: unknown) => {
        const message = isQueryError(error)
          ? error.message
          : "Failed to load users";
        toast.error(message);
      },
    },
  });
}
