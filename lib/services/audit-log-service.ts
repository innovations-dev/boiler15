/**
 * @fileoverview Audit log service for managing activity tracking and compliance.
 * This module provides a centralized interface for audit logging with features like:
 * - Activity tracking
 * - Compliance reporting
 * - Event filtering
 * - Audit trail management
 */

import { and, eq } from "drizzle-orm";

import { ApiError } from "@/lib/api/error";
import { db } from "@/lib/db";
import { auditLog } from "@/lib/db/schema";
import type { AuditLog } from "@/lib/db/schema";
import {
  errorLogger,
  ErrorSeverity,
  ErrorSource,
} from "@/lib/logger/enhanced-logger";
import { API_ERROR_CODES } from "@/lib/schemas/api-types";

/**
 * Service for managing audit logging operations.
 * Provides a centralized interface for activity tracking with proper error handling and compliance.
 *
 * @namespace AuditLogService
 *
 * @example
 * ```ts
 * // Track activities
 * await auditLogService.logActivity({
 *   action: AUDIT_ACTIONS.USER.UPDATE,
 *   entityType: ENTITY_TYPES.USER,
 *   entityId: "user_123",
 *   actorId: "admin_456",
 *   metadata: { changes: { role: "admin" } }
 * });
 *
 * // Retrieve audit trail
 * const activities = await auditLogService.getActivityLog({
 *   entityType: ENTITY_TYPES.ORGANIZATION,
 *   entityId: "org_789"
 * });
 * ```
 */

export const auditLogService = {
  async getRecentActivity(options: {
    entityType?: string;
    entityId?: string;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    try {
      return await db.query.auditLog.findMany({
        where: and(
          options.entityType
            ? eq(auditLog.entityType, options.entityType)
            : undefined,
          options.entityId ? eq(auditLog.entityId, options.entityId) : undefined
        ),
        orderBy: (auditLog, { desc }) => [desc(auditLog.createdAt)],
        limit: options.limit ?? 10,
        offset: options.offset ?? 0,
        with: {
          actor: true,
        },
      });
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "getRecentActivity",
        severity: ErrorSeverity.ERROR,
        details: options,
      });
      throw new ApiError(
        "Failed to fetch activity",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }
  },
};
