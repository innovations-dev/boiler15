import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";
import { queryKeys } from "@/lib/query/keys";
import { isQueryError } from "@/lib/query/types";

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      const result = await authClient.organization.create(data);
      // After creation, set it as active
      await authClient.organization.setActive({
        organizationId: result.data?.id,
      });
      return result;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.organizations.all,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.sessions.all,
        }),
      ]);
      toast.success("Organization created successfully");
      // Force reload to ensure all data is in sync
      window.location.reload();
    },
    onError: (error) => {
      const message = isQueryError(error)
        ? error.message
        : "Failed to create organization";
      toast.error(message);
    },
  });
}
