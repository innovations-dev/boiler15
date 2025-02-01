import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";
import type { MagicLinkInput } from "@/lib/schemas/auth";

interface MagicLinkError {
  message: string;
  status?: number;
}

export function useMagicLink() {
  return useMutation({
    mutationFn: async (data: MagicLinkInput) => {
      try {
        return await authClient.signIn.magicLink({
          email: data.email,
          callbackURL: "/dashboard",
        });
      } catch (error) {
        // Type guard for our error structure
        const isAuthError = (err: unknown): err is MagicLinkError =>
          typeof err === "object" &&
          err !== null &&
          "message" in err &&
          typeof (err as any).message === "string";

        if (isAuthError(error)) {
          // Handle rate limiting
          if (error.status === 429) {
            throw new Error(
              "Too many attempts. Please try again in a few minutes."
            );
          }

          // Handle other known errors
          throw new Error(error.message);
        }

        // Handle unexpected errors
        console.error("Unexpected error during magic link sign in:", error);
        throw new Error(
          "An unexpected error occurred. Please try again later."
        );
      }
    },
    onSuccess: () => {
      toast.success(
        "Check your email for the magic link! If you don't see it, check your spam folder.",
        {
          duration: 6000, // Show for 6 seconds
        }
      );
    },
    onError: (error: Error) => {
      // Log client-side errors for monitoring
      console.error("Magic link error:", error);

      // Show user-friendly error message
      toast.error(error.message || "Failed to send magic link", {
        duration: 4000,
      });
    },
  });
}
