"use client";

import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import type { BetterAuthResponse } from "better-auth/api";
import { toast } from "sonner";

import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { authClient } from "@/lib/auth/auth-client";
import { queryKeys } from "@/lib/query/keys";

interface SetActiveOrgInput {
  organizationId: string;
}

export function useSetActiveOrganization(): UseMutationResult<
  BetterAuthResponse<void>,
  unknown,
  SetActiveOrgInput
> {
  const queryClient = useQueryClient();

  return useBaseMutation<BetterAuthResponse<void>, unknown, SetActiveOrgInput>({
    mutationFn: async ({ organizationId }) => {
      try {
        await authClient.organization.setActive({
          organizationId,
        });
        console.log(
          "useSetActiveOrganization: success: Setting active organization"
        );
        return { data: undefined, success: true };
      } catch (error) {
        console.error(
          "useSetActiveOrganization: error: Failed to set active organization",
          error
        );
        throw new Error(
          "useSetActiveOrganization: Failed to set active organization"
        );
      }
    },
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.organizations.active(),
      });

      // Save previous value
      const previousOrg = queryClient.getQueryData(
        queryKeys.organizations.active()
      );

      return { previousOrg };
    },
    onSuccess: (data: BetterAuthResponse<void>) => {
      console.log(
        "useSetActiveOrganization: onSuccess: Setting active organization"
      );
      toast.success("Active organization set");
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.current() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.active(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.stats(),
      });
    },
    context: "useSetActiveOrganization",
    errorMessage: "useSetActiveOrganization: Failed to set active organization",
  });
}
