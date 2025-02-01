import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";
import { queryKeys } from "@/lib/query/keys";
import { isQueryError } from "@/lib/query/types";

export function useUsers(limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () =>
      authClient.admin.listUsers({
        query: { limit },
      }),
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
