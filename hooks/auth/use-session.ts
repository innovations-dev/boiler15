import { useRouter } from "next/navigation";
import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";

import { Session, User } from "@/lib/db/schema";
import { queryKeys } from "@/lib/query/keys";

export type AuthSession = {
  session: Session & {
    user: User;
  };
};

/**
 * Hook for managing authentication session state
 * @returns Session data and utility functions for session management
 */
export function useSession() {
  const router = useRouter();

  const { data: session, isLoading } = useQuery({
    queryKey: queryKeys.sessions.current(),
    queryFn: async () => {
      try {
        const { data } = await betterFetch<AuthSession>(
          "/api/auth/get-session"
        );
        return data?.session;
      } catch (error) {
        return null;
      }
    },
  });

  const isAuthenticated = Boolean(session?.user);
  const isAdmin = session?.user?.role === "admin";

  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated && !isLoading) {
      router.push("/sign-in");
      return;
    }
    callback();
  };

  const requireAdmin = (callback: () => void) => {
    if (!isAdmin && !isLoading) {
      router.push("/");
      return;
    }
    callback();
  };

  return {
    session,
    user: session?.user,
    isLoading,
    isAuthenticated,
    isAdmin,
    requireAuth,
    requireAdmin,
  };
}
