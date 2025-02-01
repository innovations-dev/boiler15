import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";
import { queryKeys } from "@/lib/query/keys";
import { isQueryError } from "@/lib/query/types";

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.sessions.all,
    queryFn: () => authClient.listSessions(),
    meta: {
      onError: (error: unknown) => {
        const message = isQueryError(error)
          ? error.message
          : "Failed to load sessions";
        toast.error(message);
      },
    },
  });
}
