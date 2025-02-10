import { headers } from "next/headers";
import { nanoid } from "nanoid";

import { db } from "@/lib/db";
import { auditLog } from "@/lib/db/schema";
import type { AuditLogInsert } from "@/lib/db/schema";

type AuditAction =
  | "user.create"
  | "user.update"
  | "user.delete"
  | "user.ban"
  | "user.unban"
  | "organization.create"
  | "organization.update"
  | "organization.delete"
  | "member.add"
  | "member.remove"
  | "member.update_role"
  | "admin.login"
  | "admin.impersonate"
  | "admin.stop_impersonate";

export const AUDIT_ACTIONS = {
  USER: {
    CREATE: "user.create",
    UPDATE: "user.update",
    DELETE: "user.delete",
    BAN: "user.ban",
    UNBAN: "user.unban",
  },
  ORGANIZATION: {
    CREATE: "organization.create",
    UPDATE: "organization.update",
    DELETE: "organization.delete",
  },
  MEMBER: {
    ADD: "member.add",
    REMOVE: "member.remove",
    UPDATE_ROLE: "member.update_role",
  },
  ADMIN: {
    LOGIN: "admin.login",
    IMPERSONATE: "admin.impersonate",
    STOP_IMPERSONATE: "admin.stop_impersonate",
  },
} as const;

export const ENTITY_TYPES = {
  USER: "user",
  ORGANIZATION: "organization",
  MEMBER: "member",
  ADMIN: "admin",
} as const;

type EntityType = (typeof ENTITY_TYPES)[keyof typeof ENTITY_TYPES];

interface CreateAuditLogParams {
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  actorId: string;
  metadata?: Record<string, unknown>;
}

export async function createAuditLog({
  action,
  entityType,
  entityId,
  actorId,
  metadata,
}: CreateAuditLogParams): Promise<void> {
  const headersList = await headers();
  const ipAddress = headersList.get("x-forwarded-for") ?? "unknown";
  const userAgent = headersList.get("user-agent") ?? "unknown";

  const auditLogData: AuditLogInsert = {
    id: nanoid(),
    action,
    entityType,
    entityId,
    actorId,
    metadata: metadata ? JSON.stringify(metadata) : undefined,
    ipAddress,
    userAgent,
  };

  await db.insert(auditLog).values(auditLogData);
}
