import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";
import { queryKeys } from "@/lib/query/keys";
import { isQueryError } from "@/lib/query/types";

interface InviteMemberInput {
  email: string;
  role: string;
}

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteMemberInput) =>
      authClient.organization.inviteMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.members,
      });
      toast.success("Invitation sent successfully");
    },
    onError: (error) => {
      const message = isQueryError(error)
        ? error.message
        : "Failed to send invitation";
      toast.error(message);
    },
  });
}
