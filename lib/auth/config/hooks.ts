import { betterAuth, Session } from "better-auth";
import { UserWithRole } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { ApiError } from "@/lib/api/error";
import { db } from "@/lib/db";
import { auditLog, member, organization } from "@/lib/db/schema";
import {
  errorLogger,
  ErrorSeverity,
  ErrorSource,
} from "@/lib/logger/enhanced-logger";
import { API_ERROR_CODES } from "@/lib/schemas/api-types";
import { AUDIT_ACTIONS } from "@/lib/services/audit-log";
import { baseURL } from "@/lib/utils";

async function createPersonalOrganization(userId: string) {
  try {
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
  } catch (error) {
    errorLogger.log(error, ErrorSource.AUTH, {
      context: "createPersonalOrganization",
      severity: ErrorSeverity.ERROR,
      details: { userId },
    });
    throw new ApiError(
      "Failed to create personal organization",
      API_ERROR_CODES.INTERNAL_SERVER_ERROR,
      500
    );
  }
}

export const databaseHooks: Partial<typeof betterAuth> = {
  session: {
    after: async (session: Session) => {
      try {
        const existingOrg = await db.query.organization.findFirst({
          where: eq(member.userId, session.user.id),
          with: {
            members: true,
          },
        });

        const organization =
          existingOrg || (await createPersonalOrganization(session.user.id));

        const endpoint = `${baseURL.toString()}/api/auth/organization/set-active`;
        const response = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({
            organizationId: organization?.id,
            organizationSlug: organization.slug,
          }),
        });

        if (!response.ok) {
          // Use appropriate error code based on response status
          const errorCode =
            response.status >= 500
              ? API_ERROR_CODES.INTERNAL_SERVER_ERROR
              : API_ERROR_CODES.BAD_REQUEST;

          throw new ApiError(
            "Failed to set active organization",
            errorCode,
            response.status
          );
        }

        return {
          data: {
            ...session,
            activeOrganizationId: organization?.id,
          },
        };
      } catch (error) {
        errorLogger.log(error, ErrorSource.AUTH, {
          context: "sessionAfterHook",
          severity:
            error instanceof ApiError && error.status >= 500
              ? ErrorSeverity.ERROR
              : ErrorSeverity.WARNING,
          details: {
            userId: session.user.id,
            error: error instanceof Error ? error.message : "Unknown error",
          },
        });
        // Re-throw the error to let Better-Auth handle it
        throw error;
      }
    },
  },
  user: {
    create: {
      after: async (user: UserWithRole) => {
        try {
          await createPersonalOrganization(user.id);
          return { data: user };
        } catch (error) {
          errorLogger.log(error, ErrorSource.AUTH, {
            context: "userCreateHook",
            severity: ErrorSeverity.WARNING, // Warning since we continue with signup
            details: {
              userId: user.id,
              error: error instanceof Error ? error.message : "Unknown error",
            },
          });
          // Return user even if org creation fails to not block signup
          return { data: user };
        }
      },
    },
  },
};
