import { betterAuth, Session } from "better-auth";

import { getActiveOrganization } from "../actions/organization";

export const databaseHooks: Partial<typeof betterAuth> = {
  session: {
    create: {
      before: async (session: Session) => {
        // This is the session hook that is used to set the active organization id when a new session is created.
        try {
          const organization = await getActiveOrganization(session.userId);

          return {
            data: {
              ...session,
              activeOrganizationId: organization?.id,
            },
          };
        } catch (error) {
          console.error(error);

          return {
            data: session,
          };
        }
      },
    },
  },
};
