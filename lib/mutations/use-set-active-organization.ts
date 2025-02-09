"use client";

import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import type { BetterAuthResponse } from "better-auth/api";
import { toast } from "sonner";
import { z } from "zod";

import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { authClient } from "@/lib/auth/auth-client";
import { queryKeys } from "@/lib/query/keys";

const setActiveOrgSchema = z.object({
  organizationId: z.string(),
});

type SetActiveOrgInput = z.infer<typeof setActiveOrgSchema>;

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
        throw new Error("Failed to set active organization");
      }
    },
    onSuccess: () => {
      console.log(
        "useSetActiveOrganization: onSuccess: Setting active organization"
      );
      toast.success("Active organization set");
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.current() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.active(),
      });
    },
    context: "setActiveOrganization",
    errorMessage: "Failed to set active organization",
  });
}
