"use server";

import { sql } from "drizzle-orm";

import { createAction } from "@/lib/actions/create-action";
import { guardAdminRoute } from "@/lib/auth/admin-guard";
import { db } from "@/lib/db";
import { organization, session, user } from "@/lib/db/schema";
import type { AdminStatsResponse } from "@/lib/types/admin";

export async function getAdminStatsAction(): Promise<AdminStatsResponse> {
  return createAction({
    handler: async () => {
      await guardAdminRoute();

      const [stats] = await db
        .select({
          userCount: sql`count(distinct ${user.id})`,
          orgCount: sql`count(distinct ${organization.id})`,
          sessionCount: sql`count(distinct ${session.id})`,
        })
        .from(user)
        .leftJoin(organization, sql`1=1`)
        .leftJoin(session, sql`1=1`);

      return {
        totalUsers: Number(stats.userCount ?? 0),
        totalOrganizations: Number(stats.orgCount ?? 0),
        activeSessions: Number(stats.sessionCount ?? 0),
      };
    },
    input: undefined,
  });
}
