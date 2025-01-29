import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";
import type { MagicLinkInput } from "@/lib/schemas/auth";

export function useMagicLink() {
  return useMutation({
    mutationFn: async (data: MagicLinkInput) => {
      return authClient.signIn.magicLink({
        email: data.email,
        callbackURL: "/dashboard",
      });
    },
    onSuccess: () => {
      toast.success("Check your email for the magic link!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send magic link");
    },
  });
}
