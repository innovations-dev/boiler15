import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { guardAdminRoute } from "@/lib/auth/admin-guard";
import { db } from "@/lib/db";
import { auditLog, user } from "@/lib/db/schema";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
});

interface AuditLogError extends Error {
  name: string;
  message: string;
  stack?: string;
}

function convertTimestamp(timestamp: unknown): string {
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }

  if (typeof timestamp === "string") {
    return new Date(timestamp).toISOString();
  }

  if (typeof timestamp === "number") {
    const ms = timestamp < 1000000000000 ? timestamp * 1000 : timestamp;
    return new Date(ms).toISOString();
  }

  throw new Error(`Invalid timestamp format: ${typeof timestamp}`);
}

export async function GET(request: Request) {
  try {
    await guardAdminRoute();

    const url = new URL(request.url);
    const parsed = querySchema.safeParse({
      page: url.searchParams.get("page"),
      limit: url.searchParams.get("limit"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { page, limit } = parsed.data;
    const offset = (page - 1) * limit;

    try {
      const [logs, total] = await Promise.all([
        db
          .select({
            audit_log: auditLog,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          })
          .from(auditLog)
          .leftJoin(user, eq(auditLog.actorId, user.id))
          .orderBy(desc(auditLog.createdAt))
          .limit(limit)
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)` })
          .from(auditLog)
          .then((result) => result[0].count),
      ]);

      return NextResponse.json({
        logs: logs.map((log) => {
          try {
            const createdAt = convertTimestamp(log.audit_log.createdAt);
            return {
              ...log.audit_log,
              createdAt,
              actorName: log.user?.name,
              actorEmail: log.user?.email,
            };
          } catch (err) {
            // Fallback to original timestamp if conversion fails
            return {
              ...log.audit_log,
              actorName: log.user?.name,
              actorEmail: log.user?.email,
            };
          }
        }),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (dbError) {
      throw new Error("Failed to query database");
    }
  } catch (error) {
    const err = error as AuditLogError;

    // Handle specific error types
    if (err.message === "Admin access required") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    if (err.message === "Invalid session") {
      return NextResponse.json(
        { error: "Unauthorized: Invalid session" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch audit logs",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
