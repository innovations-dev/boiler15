"use server";

import { sql } from "drizzle-orm";

import { createAction } from "@/lib/actions/create-action";
import { guardAdminRoute } from "@/lib/auth/admin-guard";
import { db } from "@/lib/db";
import { organization, session, user } from "@/lib/db/schema";
import type { AdminStats, AdminStatsResponse } from "@/lib/types/admin";

const getAdminStats = async (): Promise<AdminStats> => {
  await guardAdminRoute();

  const [stats] = await db
    .select({
      totalUsers: sql`count(distinct ${user.id})`,
      totalOrganizations: sql`count(distinct ${organization.id})`,
      activeSessions: sql`count(distinct ${session.id})`,
    })
    .from(user)
    .leftJoin(organization, sql`1=1`)
    .leftJoin(session, sql`1=1`);

  return {
    totalUsers: Number(stats.totalUsers ?? 0),
    totalOrganizations: Number(stats.totalOrganizations ?? 0),
    activeSessions: Number(stats.activeSessions ?? 0),
  };
};

export async function getAdminStatsAction(): Promise<AdminStatsResponse> {
  return createAction({
    handler: getAdminStats,
    input: undefined,
  });
}
