import { toast } from "sonner";

import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { handleHttpError } from "@/lib/query/error";

interface ResetPasswordInput {
  email: string;
}

export function useResetPassword() {
  return useBaseMutation({
    mutationFn: async ({ email }: ResetPasswordInput) => {
      try {
        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw await response.json();
        }

        return response.json();
      } catch (error) {
        throw handleHttpError(error);
      }
    },
    onSuccess: () => {
      toast.success(
        "Password reset email sent! Check your inbox for further instructions.",
        { duration: 5000 }
      );
    },
    errorMessage: "Failed to send reset email",
  });
}
