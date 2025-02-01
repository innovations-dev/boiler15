import { authClient } from "@/lib/auth/auth-client";
import { sessionSelectSchema } from "@/lib/db/schema";
import { useApiQuery } from "@/lib/hooks/use-api-query";
import { queryKeys } from "@/lib/query/keys";

export function useSessions() {
  return useApiQuery(
    queryKeys.sessions.all,
    async () => {
      const response = await authClient.listSessions();
      const sessions = (response.data ?? []).map((session) => ({
        ...session,
        impersonatedBy: null,
        activeOrganizationId: null,
        ipAddress: session.ipAddress ?? null,
        userAgent: session.userAgent ?? null,
      }));
      return sessions;
    },
    sessionSelectSchema.array(),
    {
      retry: 1,
      initialData: {
        data: [],
        metadata: {
          timestamp: Date.now(),
          requestId: crypto.randomUUID(),
        },
      },
    }
  );
}
