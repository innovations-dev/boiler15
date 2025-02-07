import { desc, eq } from "drizzle-orm";

import { guardAdminRoute } from "@/lib/auth/admin-guard";
import { db } from "@/lib/db";
import { auditLog, user } from "@/lib/db/schema";

export async function GET() {
  try {
    await guardAdminRoute();

    const logs = await db
      .select()
      .from(auditLog)
      .leftJoin(user, eq(auditLog.actorId, user.id))
      .orderBy(desc(auditLog.createdAt))
      .limit(100);

    return Response.json(
      logs.map((log) => ({
        ...log.audit_log,
        actorName: log.user?.name,
      }))
    );
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    return Response.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
