import { betterAuth, Session } from "better-auth";

import { authClient } from "../auth-client";

export const databaseHooks: Partial<typeof betterAuth> = {
  session: {
    create: {
      before: async (session: Session) => {
        // This is the session hook that is used to set the active organization id when a new session is created.
        const organization = await authClient.useActiveOrganization();

        return {
          data: {
            ...session,
            activeOrganizationId: organization.data?.id,
          },
        };
      },
    },
  },
};
