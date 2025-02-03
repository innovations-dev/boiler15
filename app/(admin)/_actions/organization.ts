"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { createAction } from "@/lib/actions/create-action";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  omittedOrganizationSelectSchema,
  organization,
  user,
} from "@/lib/db/schema";
import { errorLogger, ErrorSource } from "@/lib/logger/enhanced-logger";
import { ForbiddenError, UnauthorizedError } from "@/lib/query/error";

export async function getOrganizationsAction() {
  return createAction({
    handler: async () => {
      try {
        const session = await auth.api.getSession({
          headers: await headers(),
        });

        if (!session?.session?.userId) {
          throw new UnauthorizedError("User not found");
        }

        const _user = await db.query.user.findFirst({
          where: eq(user.id, session.session.userId),
        });

        if (!_user || _user.role !== "admin") {
          throw new ForbiddenError("Admin access required");
        }

        const orgs = await db.select().from(organization);

        const transformedOrgs = orgs.map((org) => ({
          ...org,
          metadata: org.metadata ?? "",
        }));

        return transformedOrgs.map((org) =>
          omittedOrganizationSelectSchema.parse(org)
        );
      } catch (error) {
        errorLogger.log(error, ErrorSource.ACTION, {
          context: "getOrganizationsAction",
        });
        throw error;
      }
    },
    input: undefined,
  });
}
