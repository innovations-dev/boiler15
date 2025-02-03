import { toast } from "sonner";

import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { authClient } from "@/lib/auth/auth-client";
import { handleHttpError } from "@/lib/query/error";
import type { MagicLinkInput } from "@/lib/schemas/auth";

/**
 * Custom hook for handling passwordless authentication via magic links.
 *
 * This hook provides a mutation function to initiate the magic link authentication flow.
 * When successful, it sends a magic link to the user's email and displays a success toast.
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const { mutate: sendMagicLink, isPending } = useMagicLink();
 *
 *   const handleSubmit = (email: string) => {
 *     sendMagicLink({ email });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       // ... form implementation
 *     </form>
 *   );
 * }
 * ```
 *
 * @returns {Object} A mutation object containing:
 *  - mutate: Function to trigger the magic link email
 *  - isPending: Boolean indicating if the request is in progress
 *  - error: Any error that occurred during the request
 *  - reset: Function to reset the mutation state
 *
 * @throws {Error} Throws an error if the magic link request fails
 *
 * @see {@link MagicLinkInput} for the expected input type
 *
 * @usecase
 * - Passwordless authentication flow
 * - Quick login for returning users
 * - Secure authentication without password management
 * - User invitation flows
 */
export function useMagicLink() {
  return useBaseMutation({
    mutationFn: async (data: MagicLinkInput) => {
      try {
        return await authClient.signIn.magicLink({
          email: data.email,
          callbackURL: "/dashboard",
        });
      } catch (error) {
        throw handleHttpError(error);
      }
    },
    onSuccess: () => {
      toast.success(
        "Check your email for the magic link! If you don't see it, check your spam folder.",
        { duration: 6000 }
      );
    },
    errorMessage: "Failed to send magic link",
  });
}
