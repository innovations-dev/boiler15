"use server";

import { headers } from "next/headers";
import { eq, sql } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { organization, session, user } from "@/lib/db/schema";

export async function getAdminStatsAction() {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      throw new Error("Unauthorized: User not found");
    }

    const _user = await db.query.user.findFirst({
      where: eq(user.id, authSession.user.id),
    });

    if (!_user || _user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    // Single query for all counts
    const [stats] = await db
      .select({
        userCount: sql`count(distinct ${user.id})`,
        orgCount: sql`count(distinct ${organization.id})`,
        sessionCount: sql`count(distinct ${session.id})`,
      })
      .from(user)
      .crossJoin(organization)
      .crossJoin(session);

    return {
      data: {
        totalUsers: Number(stats.userCount ?? 0),
        totalOrganizations: Number(stats.orgCount ?? 0),
        activeSessions: Number(stats.sessionCount ?? 0),
      },
      error: null,
    };
  } catch (error) {
    console.error("Admin stats error:", error);
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to load admin stats",
      },
    };
  }
}
