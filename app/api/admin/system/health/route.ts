import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { guardAdminRoute } from "@/lib/auth/admin-guard";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await guardAdminRoute();

    // Get API response time (simulated for now)
    const apiStart = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate some work
    const apiResponseTime = Math.round(performance.now() - apiStart);

    // Get database connections (example implementation)
    const dbStart = performance.now();
    await db.select({ count: sql`count(*)` }).from(sql`sqlite_master`);
    const dbResponseTime = Math.round(performance.now() - dbStart);

    // Get server load (example implementation)
    const serverLoad = Math.random() * 100; // This should be replaced with actual server metrics

    return NextResponse.json({
      api: {
        status:
          apiResponseTime < 200
            ? "healthy"
            : apiResponseTime < 500
              ? "warning"
              : "error",
        responseTime: apiResponseTime,
      },
      database: {
        status:
          dbResponseTime < 100
            ? "healthy"
            : dbResponseTime < 300
              ? "warning"
              : "error",
        connections: Math.floor(Math.random() * 10) + 1, // Example value
      },
      server: {
        status:
          serverLoad < 50 ? "healthy" : serverLoad < 80 ? "warning" : "error",
        load: Math.round(serverLoad),
      },
    });
  } catch (error) {
    console.error("Failed to fetch system health:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch system health metrics",
      },
      { status: 500 }
    );
  }
}
