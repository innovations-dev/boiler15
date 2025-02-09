import { betterAuth, Session } from "better-auth";
import { UserWithRole } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "@/lib/db";
import { auditLog, member, organization } from "@/lib/db/schema";
import { AUDIT_ACTIONS } from "@/lib/services/audit-log";
import { baseURL } from "@/lib/utils";

async function createPersonalOrganization(userId: string) {
  const personalOrg = await db.transaction(async (tx) => {
    // Create organization
    const [org] = await tx
      .insert(organization)
      .values({
        id: nanoid(),
        name: "Personal",
        slug: `personal-${userId}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Add user as owner
    await tx.insert(member).values({
      id: nanoid(),
      organizationId: org.id,
      userId: userId,
      role: "owner",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Add audit log
    await tx.insert(auditLog).values({
      id: nanoid(),
      action: AUDIT_ACTIONS.ORGANIZATION.CREATE,
      entityType: "organization",
      entityId: org.id,
      actorId: userId,
      metadata: JSON.stringify({ isPersonal: true }),
      ipAddress: "system",
      userAgent: "system",
      createdAt: new Date(),
    });

    return org;
  });

  return personalOrg;
}

export const databaseHooks: Partial<typeof betterAuth> = {
  session: {
    after: async (session: Session) => {
      // create personal organization if it doesn't exist and set active org
      console.log("CreateSessionDBHook: Session hook after:", session);
      const existingOrg = await db.query.organization.findFirst({
        where: eq(member.userId, session.user.id),
        with: {
          members: true,
        },
      });

      console.log("CreateSessionDBHook: Existing org check:", existingOrg);

      const organization =
        existingOrg || (await createPersonalOrganization(session.user.id));
      console.log("CreateSessionDBHook: Final organization:", organization);

      const endpoint = `${baseURL.toString()}/api/auth/organization/set-active`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          organizationId: organization?.id,
          organizationSlug: organization.slug,
        }),
      });

      if (!response.ok) {
        console.error(
          "CreateSessionDBHook: Failed to set active organization:",
          response
        );
        throw new Error(
          "CreateSessionDBHook: Failed to set active organization"
        );
      }

      console.log(
        "CreateSessionDBHook: Active organization set:",
        response,
        organization?.id
      );
      return {
        data: {
          ...session,
          activeOrganizationId: organization?.id,
        },
      };
    },
  },
  // Add user creation hook to ensure org is created immediately
  user: {
    create: {
      after: async (user: UserWithRole) => {
        console.log("CreateOrgDBHook: User creation hook triggered:", user.id);
        try {
          const organization = await createPersonalOrganization(user.id);
          console.log("CreateOrgDBHook: Personal org created:", organization);

          return { data: user };
        } catch (error) {
          console.error("CreateOrgDBHook: User creation hook error:", error);
          return { data: user };
        }
      },
    },
  },
};
