import { betterAuth, Session } from "better-auth";
import { UserWithRole } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "@/lib/db";
import { auditLog, member, organization } from "@/lib/db/schema";
import { AUDIT_ACTIONS } from "@/lib/services/audit-log";

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

export const getActiveOrganization = async (userId: string) => {
  const org = await db.query.organization.findFirst({
    where: eq(member.userId, userId),
    with: {
      members: true,
    },
  });

  if (!org) {
    // Create personal organization if none exists
    return createPersonalOrganization(userId);
  }

  return org;
};

export const databaseHooks: Partial<typeof betterAuth> = {
  session: {
    create: {
      before: async (session: Session) => {
        console.log("Session hook triggered with userId:", session.userId);
        try {
          const existingOrg = await db.query.organization.findFirst({
            where: eq(member.userId, session.userId),
            with: {
              members: true,
            },
          });

          console.log("Existing org check:", existingOrg);

          const organization =
            existingOrg || (await createPersonalOrganization(session.userId));
          console.log("Final organization:", organization);

          return {
            data: {
              ...session,
              activeOrganizationId: organization?.id,
            },
          };
        } catch (error) {
          console.error("Session hook error:", error);
          return {
            data: session,
          };
        }
      },
    },
  },
  // Add user creation hook to ensure org is created immediately
  user: {
    create: {
      after: async (user: UserWithRole) => {
        console.log("User creation hook triggered:", user.id);
        try {
          const organization = await createPersonalOrganization(user.id);
          console.log("Personal org created:", organization);
          return { data: user };
        } catch (error) {
          console.error("User creation hook error:", error);
          return { data: user };
        }
      },
    },
  },
};
