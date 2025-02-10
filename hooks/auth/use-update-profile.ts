import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { handleApiError } from "@/lib/api/error";
import { authClient } from "@/lib/auth/auth-client";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";
import { type AuthSession } from "@/lib/schemas/auth";

/**
 * Schema for profile update validation
 * @remarks Requires a non-empty name string
 */
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Custom hook for updating user profile information
 *
 * @remarks
 * This hook provides optimistic updates for the user profile, automatically
 * handling loading states, error handling, and cache invalidation.
 *
 * @example
 * ```tsx
 * function ProfileForm() {
 *   const { mutate, isLoading } = useUpdateProfile();
 *
 *   const onSubmit = (data: UpdateProfileInput) => {
 *     mutate(data, {
 *       onSuccess: () => {
 *         toast.success('Profile updated successfully');
 *       }
 *     });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       // ... form fields
 *     </form>
 *   );
 * }
 * ```
 *
 * @returns {UseMutationResult} A mutation object containing:
 * - mutate: Function to trigger the profile update
 * - isLoading: Boolean indicating if update is in progress
 * - isError: Boolean indicating if there was an error
 * - error: Error object if update failed
 * - reset: Function to reset mutation state
 *
 * @throws {ApiError} When the API request fails
 * @throws {ValidationError} When input validation fails
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      try {
        return await authClient.updateUser(data);
      } catch (error) {
        throw handleApiError(error);
      }
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.sessions.current(),
      });

      const previousData = queryClient.getQueryData<AuthSession>(
        queryKeys.sessions.current()
      );

      queryClient.setQueryData<AuthSession | undefined>(
        queryKeys.sessions.current(),
        (old) => {
          if (!old) return undefined;
          return {
            session: {
              ...old.session,
              user: {
                ...old.session.user,
                name: newData.name,
              },
            },
          };
        }
      );

      return { previousData } as const;
    },
    onError: (_err, _newData, context: unknown) => {
      if (context && typeof context === "object" && "previousData" in context) {
        const { previousData } = context as { previousData: AuthSession };
        queryClient.setQueryData(queryKeys.sessions.current(), previousData);
      }
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.current(),
      });
    },
    errorMessage: "Failed to update profile",
    ...cacheConfig.queries.user,
  });
}
