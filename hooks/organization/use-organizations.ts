import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getOrganizationsAction } from "@/app/(admin)/_actions/organization";
import type { Organization } from "@/lib/db/schema";
import { queryKeys } from "@/lib/query/keys";
import { isQueryError } from "@/lib/query/types";

export function useOrganizations() {
  return useQuery<Organization[]>({
    queryKey: queryKeys.organizations.list(),
    queryFn: getOrganizationsAction,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
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
