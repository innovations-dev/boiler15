import { betterAuth, Session } from "better-auth";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { member } from "@/lib/db/schema";

export const getActiveOrganization = async (userId: string) => {
  const org = await db.query.organization.findFirst({
    where: eq(member.userId, userId),
    with: {
      members: true,
    },
  });

  return org;
};

export const databaseHooks: Partial<typeof betterAuth> = {
  session: {
    create: {
      before: async (session: Session) => {
        // This is the session hook that is used to set the active organization id when a new session is created.
        try {
          const organization = await getActiveOrganization(session.userId);
          console.log("db:hook:before:organization", organization);

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
