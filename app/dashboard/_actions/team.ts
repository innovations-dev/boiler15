"use server";

import { headers } from "next/headers";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  member,
  organization,
  sessionSelectSchema,
  user,
  type TeamMember,
} from "@/lib/db/schema";
import { UnauthorizedError } from "@/lib/query/error";
import { createApiResponse, type ApiResponse } from "@/lib/schemas/api-types";

export async function getTeamMembersAction(): Promise<
  ApiResponse<TeamMember[]>
> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const parsedSession = sessionSelectSchema.safeParse(session?.session);
    if (!parsedSession.success) {
      throw new UnauthorizedError("Invalid session");
    }

    if (!parsedSession.data.activeOrganizationId) {
      return createApiResponse([]);
    }

    const results = await db
      .select({
        id: member.id,
        role: member.role,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        organization: {
          id: organization.id,
          name: organization.name,
        },
      })
      .from(member)
      .innerJoin(user, eq(member.userId, user.id))
      .innerJoin(organization, eq(member.organizationId, organization.id))
      .where(eq(member.organizationId, parsedSession.data.activeOrganizationId))
      .orderBy(desc(member.createdAt));

    const members = results.map((result) => ({
      ...result,
      updatedAt: result.updatedAt || null,
    }));

    return createApiResponse(members);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    return createApiResponse([], {
      message: "Failed to fetch team members",
      code: "FETCH_ERROR",
    });
  }
}
