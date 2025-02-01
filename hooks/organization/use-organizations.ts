import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";
import { queryKeys } from "../../lib/query/keys";
import { isQueryError } from "../../lib/query/types";

export function useOrganizations() {
  return useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: () => authClient.organization.list(),
    meta: {
      onError: (error: unknown) => {
        const message = isQueryError(error)
          ? error.message
          : "Failed to load organizations";
        toast.error(message);
      },
    },
  });
}
