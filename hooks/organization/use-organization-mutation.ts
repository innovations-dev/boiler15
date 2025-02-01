import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";
import { queryKeys } from "@/lib/query/keys";
import { isQueryError } from "@/lib/query/types";

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizationId: string) =>
      authClient.organization.delete({ organizationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all,
      });
      toast.success("Organization deleted successfully");
    },
    onError: (error) => {
      const message = isQueryError(error)
        ? error.message
        : "Failed to delete organization";
      toast.error(message);
    },
  });
}
