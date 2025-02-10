/**
 * @fileoverview Organization service for managing organization-related database operations.
 * This module provides a centralized interface for organization management with features like:
 * - Organization CRUD operations
 * - Member management
 * - Preferences handling
 * - Activity logging
 */

import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import { ApiError } from "../api/error";
import { db } from "../db";
import { auditLog, Organization, preferences } from "../db/schema";
import * as schema from "../db/schema";
import { errorLogger } from "../logger/enhanced-logger";
import { ErrorSeverity, ErrorSource } from "../logger/types";
import { API_ERROR_CODES } from "../schemas/api-types";
import { ENTITY_TYPES } from "./audit-log";

/**
 * Service for managing organization-related database operations.
 * Provides a centralized interface for organization management with proper error handling and logging.
 *
 * @namespace OrganizationService
 *
 * @example
 * ```ts
 * // Create and manage organization
 * const org = await organizationService.createOrganization({ name: "Acme Corp" });
 * await organizationService.updateOrganization(org.id, { logo: "new-logo.png" });
 *
 * // Manage members and preferences
 * await organizationService.addMember(org.id, "user_123", "admin");
 * await organizationService.updatePreferences(org.id, { theme: "dark" });
 * ```
 */

export const organizationService = {
  async getOrganizationById(id: string): Promise<Organization | null> {
    try {
      return (
        (await db.query.organization.findFirst({
          where: eq(schema.organization.id, id),
          with: {
            members: true,
          },
        })) ?? null
      );
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "getOrganizationById",
        severity: ErrorSeverity.ERROR,
        details: { id },
      });
      throw new ApiError(
        "Failed to fetch organization",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }
  },

  async getOrganizationStats(organizationId: string): Promise<{
    totalMembers: number;
    activeMembers: number;
    pendingInvitations: number;
  }> {
    try {
      const [stats] = await db
        .select({
          totalMembers: sql<number>`count(distinct ${schema.member.userId})`,
          activeMembers: sql<number>`count(distinct case when ${schema.user.banned} = 0 or ${schema.user.banned} is null then ${schema.member.userId} end)`,
          pendingInvitations: sql<number>`count(distinct ${schema.invitation.id})`,
        })
        .from(schema.member)
        .leftJoin(schema.user, eq(schema.member.userId, schema.user.id))
        .leftJoin(
          schema.invitation,
          eq(schema.member.organizationId, schema.invitation.organizationId)
        )
        .where(eq(schema.member.organizationId, organizationId));

      console.log(stats);
      return {
        totalMembers: +stats.totalMembers || 0,
        activeMembers: +stats.activeMembers || 0,
        pendingInvitations: +stats.pendingInvitations || 0,
      };
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "getOrganizationStats",
        severity: ErrorSeverity.ERROR,
        details: { organizationId },
      });
      throw new ApiError(
        "Failed to fetch organization statistics",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }
  },

  /**
   * Updates organization preferences with audit logging
   *
   * @param {string} organizationId - The ID of the organization
   * @param {Record<string, unknown>} newPreferences - Organization preferences to update
   * @returns {Promise<void>}
   * @throws {ApiError} If update fails
   *
   * @example
   * ```ts
   * await organizationService.updateOrganizationPreferences("org_123", {
   *   theme: "light",
   *   features: { billing: true, analytics: false }
   * });
   * ```
   */
  async updateOrganizationPreferences(
    organizationId: string,
    newPreferences: Record<string, unknown>
  ): Promise<void> {
    try {
      await db.transaction(async (tx) => {
        // Convert preferences object to key-value pairs
        const preferencePairs = Object.entries(newPreferences).map(
          ([key, value]) => ({
            id: nanoid(),
            entityId: organizationId,
            entityType: ENTITY_TYPES.ORGANIZATION,
            key,
            value: JSON.stringify(value),
            updatedAt: new Date(),
          })
        );

        // Upsert each preference
        for (const pref of preferencePairs) {
          await tx
            .insert(preferences)
            .values(pref)
            .onConflictDoUpdate({
              target: [
                preferences.entityId,
                preferences.entityType,
                preferences.key,
              ],
              set: { value: pref.value, updatedAt: new Date() },
            });
        }

        await tx.insert(auditLog).values({
          id: nanoid(),
          action: "PREFERENCES_UPDATE",
          entityType: ENTITY_TYPES.ORGANIZATION,
          entityId: organizationId,
          actorId: organizationId, // System action
          metadata: JSON.stringify(newPreferences),
          createdAt: new Date(),
        });
      });
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "updateOrganizationPreferences",
        severity: ErrorSeverity.ERROR,
        details: { organizationId, preferences: newPreferences },
      });
      throw new ApiError(
        "Failed to update organization preferences",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }
  },

  /**
   * Gets organization preferences with proper error handling
   *
   * @param {string} organizationId - The ID of the organization
   * @returns {Promise<Record<string, unknown>>} Organization preferences
   * @throws {ApiError} If database query fails
   *
   * @example
   * ```ts
   * const prefs = await organizationService.getOrganizationPreferences("org_123");
   * console.log(prefs.theme); // "dark"
   * console.log(prefs.features?.billing); // true
   * ```
   */
  async getOrganizationPreferences(
    organizationId: string
  ): Promise<Record<string, unknown>> {
    try {
      const orgPrefs = await db.query.preferences.findMany({
        where: eq(preferences.entityId, organizationId),
      });

      return orgPrefs.reduce(
        (acc, pref) => ({
          ...acc,
          [pref.key]: JSON.parse(pref.value),
        }),
        {}
      );
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "getOrganizationPreferences",
        severity: ErrorSeverity.ERROR,
        details: { organizationId },
      });
      throw new ApiError(
        "Failed to fetch organization preferences",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }
  },
};
