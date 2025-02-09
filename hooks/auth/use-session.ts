import { useRouter } from "next/navigation";
import type { UserWithRole } from "better-auth/plugins";

import { useApiQuery } from "@/hooks/query/use-api-query";
import { authClient } from "@/lib/auth/auth-client";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";
import { authSessionSchema } from "@/lib/schemas/auth";

export function useSession() {
  const router = useRouter();

  const { data, isLoading } = useApiQuery(
    queryKeys.sessions.current(),
    async () => {
      const { data } = await authClient.getSession();
      console.log("Session data:", data); // Let's see what we get
      return {
        session: {
          user: data?.user as UserWithRole,
          activeOrganizationId: data?.session.activeOrganizationId,
        },
      };
    },
    authSessionSchema,
    cacheConfig.queries.session
  );

  const isAuthenticated = !!data?.session.user;
  const user = data?.session.user;
  const role = user?.role;
  const isAdmin = role === "admin";

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
    session: data?.session,
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    requireAuth,
    requireAdmin,
  };
}
