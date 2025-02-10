import { toast } from "sonner";

import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { sendPasswordResetEmailAction } from "@/lib/email/actions/send-password-reset-email";
import { cacheConfig } from "@/lib/query/cache-config";

/**
 * Custom hook for handling password reset request mutations.
 *
 * This hook wraps the password reset email sending functionality in a mutation,
 * providing loading states, error handling, and success feedback.
 *
 * @example
 * ```tsx
 * function PasswordResetForm() {
 *   const { mutate, isLoading, isError } = useRequestPasswordReset();
 *
 *   const handleReset = (user: UserWithRole) => {
 *     const resetUrl = `${window.location.origin}/reset-password`;
 *     mutate({
 *       user,
 *       url: resetUrl
 *     });
 *   };
 *
 *   return (
 *     // Form implementation
 *   );
 * }
 * ```
 *
 * @returns {Object} Mutation object containing:
 *  - mutate: Function to trigger the password reset email
 *  - isLoading: Boolean indicating if the request is in progress
 *  - isError: Boolean indicating if the request failed
 *  - error: Error object if the request failed
 *  - isSuccess: Boolean indicating if the request succeeded
 *
 * @throws {Error} When email sending fails or network error occurs
 *
 * @see {@link useBaseMutation} For the underlying mutation implementation
 * @see {@link sendPasswordResetEmail} For the email sending service
 */
export function useRequestPasswordReset() {
  return useBaseMutation({
    mutationFn: async () => {
      return await sendPasswordResetEmailAction();
    },
    onSuccess: () => {
      toast.success(
        "Password reset email sent! Check your inbox for further instructions.",
        { duration: 5000 }
      );
    },
    errorMessage: "Failed to send reset email",
    ...cacheConfig.queries.default,
  });
}
