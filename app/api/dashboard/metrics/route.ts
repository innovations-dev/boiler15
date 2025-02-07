import { NextResponse } from "next/server";
import { and, eq, gte, sql } from "drizzle-orm";

import { guardDashboardRoute } from "@/lib/auth/dashboard-guard";
import { db } from "@/lib/db";
import { member, session as sessionTable } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { activeOrganizationId } = await guardDashboardRoute();

    // Get total members for the organization
    const membersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(member)
      .where(eq(member.organizationId, activeOrganizationId));

    // Get active sessions in the last hour
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const activeSessions = await db
      .select({ count: sql<number>`count(*)` })
      .from(sessionTable)
      .where(
        and(
          gte(sessionTable.updatedAt, hourAgo),
          eq(sessionTable.activeOrganizationId, activeOrganizationId)
        )
      );

    // For demo purposes, generate some revenue data
    // In a real app, this would come from your billing system
    const revenue = Math.floor(Math.random() * 100000);
    const revenueChange = Math.floor(Math.random() * 40) - 20; // -20 to +20

    return NextResponse.json({
      revenue: {
        total: revenue,
        change: revenueChange,
      },
      subscriptions: {
        total: membersCount[0].count,
        change: 5, // Example change
      },
      activeUsers: {
        total: membersCount[0].count,
        change: 10, // Example change
      },
      currentlyActive: {
        total: activeSessions[0].count,
        change: activeSessions[0].count, // Current vs hour ago
      },
    });
  } catch (error) {
    console.error("Failed to fetch dashboard metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
