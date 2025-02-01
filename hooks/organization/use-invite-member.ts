import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";
import { queryKeys } from "@/lib/query/keys";
import { isQueryError } from "@/lib/query/types";

interface InviteMemberInput {
  email: string;
  role: string;
}

interface InviteMemberError {
  message: string;
  status?: number;
}

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InviteMemberInput) => {
      try {
        return await authClient.organization.inviteMember(data);
      } catch (error) {
        // Type guard for our error structure
        const isAuthError = (err: unknown): err is InviteMemberError =>
          typeof err === "object" &&
          err !== null &&
          "message" in err &&
          typeof (err as any).message === "string";

        if (isAuthError(error)) {
          // Handle rate limiting
          if (error.status === 429) {
            throw new Error(
              "Too many invitation attempts. Please try again in a few minutes."
            );
          }

          // Handle other known errors
          throw new Error(error.message);
        }

        // Handle unexpected errors
        console.error("Unexpected error during member invitation:", error);
        throw new Error(
          "An unexpected error occurred. Please try again later."
        );
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.members,
      });

      // Show success message
      toast.success(
        "Invitation sent successfully! The member will receive an email shortly.",
        {
          duration: 5000,
        }
      );
    },
    onError: (error: Error) => {
      // Log client-side errors for monitoring
      console.error("Member invitation error:", error);

      // Show user-friendly error message
      toast.error(error.message || "Failed to send invitation", {
        duration: 4000,
      });
    },
  });
}
