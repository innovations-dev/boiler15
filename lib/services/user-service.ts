/**
 * @fileoverview User service for managing user-related database operations.
 * This module provides a centralized interface for user management with features like:
 * - User CRUD operations
 * - Role and permission checks
 * - Organization membership management
 * - Activity logging
 */

import { and, eq, like, or, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import { ApiError } from "@/lib/api/error";
import { db } from "@/lib/db";
import { auditLog, member, preferences, user } from "@/lib/db/schema";
import type { AuditLog, User } from "@/lib/db/schema";
import {
  errorLogger,
  ErrorSeverity,
  ErrorSource,
} from "@/lib/logger/enhanced-logger";
import { API_ERROR_CODES } from "@/lib/schemas/api-types";
import { ENTITY_TYPES } from "./audit-log";

/**
 * Service for managing user-related database operations.
 * Provides a centralized interface for user management with proper error handling and logging.
 *
 * @namespace UserService
 *
 * @example
 * ```ts
 * // Fetch user and check permissions
 * const user = await userService.getUserById("user_123");
 * const isAdmin = await userService.isUserAdmin(user.id);
 *
 * // Update user with activity logging
 * await userService.updateUser("user_123", { name: "New Name" });
 * await userService.logUserActivity("user_123", "PROFILE_UPDATE", { field: "name" });
 * ```
 */
export const userService = {
  /**
   * Retrieves a user by their ID with proper error handling
   *
   * @param {string} id - The unique identifier of the user
   * @returns {Promise<User | null>} The user object if found, null otherwise
   * @throws {ApiError} If database query fails
   *
   * @example
   * ```ts
   * try {
   *   const user = await userService.getUserById("user_123");
   *   if (!user) {
   *     // Handle user not found
   *   }
   * } catch (error) {
   *   // Handle database error
   * }
   * ```
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const result = await db.query.user.findFirst({
        where: eq(user.id, id),
      });
      return result ?? null;
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "getUserById",
        severity: ErrorSeverity.ERROR,
        details: { userId: id },
      });
      throw new ApiError(
        "Failed to fetch user",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }
  },

  /**
   * Retrieves all users belonging to a specific organization with their roles
   *
   * @param {string} organizationId - The ID of the organization
   * @returns {Promise<User[]>} Array of users with their organization roles
   * @throws {ApiError} If database query fails
   *
   * @example
   * ```ts
   * const orgUsers = await userService.getUsersByOrganization("org_123");
   * const admins = orgUsers.filter(user => user.members?.[0]?.role === "admin");
   * ```
   */
  async getUsersByOrganization(organizationId: string): Promise<User[]> {
    try {
      const results = await db.query.user.findMany({
        with: {
          members: {
            where: eq(member.organizationId, organizationId),
          },
        },
      });
      return results;
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "getUsersByOrganization",
        severity: ErrorSeverity.ERROR,
        details: { organizationId },
      });
      throw new ApiError(
        "Failed to fetch organization users",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }
  },

  /**
   * Updates a user's profile information with audit logging
   *
   * @param {string} id - The user's ID
   * @param {Partial<User>} data - The user data to update
   * @returns {Promise<User>} The updated user object
   * @throws {ApiError} If update fails or user not found
   *
   * @example
   * ```ts
   * const updatedUser = await userService.updateUser("user_123", {
   *   name: "New Name",
   *   image: "new-image-url"
   * });
   * ```
   */
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      const [updated] = await db.transaction(async (tx) => {
        const [updatedUser] = await tx
          .update(user)
          .set({
            ...data,
            updatedAt: new Date(),
          })
          .where(eq(user.id, id))
          .returning();

        if (!updatedUser) {
          throw new ApiError("User not found", API_ERROR_CODES.NOT_FOUND, 404);
        }

        await userService.logUserActivity(id, "PROFILE_UPDATE", data);
        return [updatedUser];
      });

      return updated;
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "updateUser",
        severity: ErrorSeverity.ERROR,
        details: { userId: id, updateData: data },
      });
      throw error;
    }
  },

  /**
   * Logs user activity with error handling
   *
   * @param {string} userId - The ID of the user performing the action
   * @param {string} action - The action being performed
   * @param {Record<string, unknown>} details - Additional details about the action
   * @throws {ApiError} If logging fails
   */
  async logUserActivity(
    userId: string,
    action: string,
    details: Record<string, unknown>
  ): Promise<void> {
    try {
      await db.insert(auditLog).values({
        id: nanoid(),
        action,
        entityType: "user",
        entityId: userId,
        actorId: userId,
        metadata: JSON.stringify(details),
        createdAt: new Date(),
      });
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "logUserActivity",
        severity: ErrorSeverity.WARNING,
        details: { userId, action, details },
      });
    }
  },

  /**
   * Checks if a user exists by email
   * @async
   * @param {string} email - The email to check
   * @returns {Promise<boolean>} True if user exists, false otherwise
   *
   * @example
   * ```ts
   * const exists = await userService.userExistsByEmail("user@example.com");
   * if (exists) {
   *   console.log("User already registered");
   * }
   * ```
   */
  async userExistsByEmail(email: string): Promise<boolean> {
    const result = await db.query.user.findFirst({
      where: eq(user.email, email),
      columns: { id: true },
    });
    return !!result;
  },

  /**
   * Gets a user's role in an organization
   *
   * @param {string} userId - The ID of the user
   * @param {string} organizationId - The ID of the organization
   * @returns {Promise<string | null>} The user's role in the organization, or null if not found
   *
   * @example
   * ```ts
   * const role = await userService.getUserOrganizationRole("user_123", "org_123");
   * ```
   */
  async getUserOrganizationRole(
    userId: string,
    organizationId: string
  ): Promise<string | null> {
    const memberRecord = await db.query.member.findFirst({
      where: and(
        eq(member.userId, userId),
        eq(member.organizationId, organizationId)
      ),
      columns: { role: true },
    });
    return memberRecord?.role ?? null;
  },

  /**
   * Checks if a user has admin privileges
   *
   * @param {string} userId - The ID of the user
   * @returns {Promise<boolean>} True if the user is an admin, false otherwise
   *
   * @example
   * ```ts
   * const isAdmin = await userService.isUserAdmin("user_123");
   * ```
   */
  async isUserAdmin(userId: string): Promise<boolean> {
    const userRecord = await db.query.user.findFirst({
      where: eq(user.id, userId),
      columns: { role: true },
    });
    return userRecord?.role === "admin";
  },

  /**
   * Searches users with filtering and pagination
   *
   * @param {Object} options - Search options
   * @param {string} [options.query] - Search query for name or email
   * @param {number} [options.limit=10] - Maximum number of results to return
   * @param {number} [options.offset=0] - Number of results to skip
   * @param {string} [options.organizationId] - Filter by organization membership
   * @returns {Promise<User[]>} Array of matching users
   * @throws {ApiError} If search operation fails
   *
   * @example
   * ```ts
   * // Search users in an organization
   * const users = await userService.searchUsers({
   *   query: "john",
   *   organizationId: "org_123",
   *   limit: 20
   * });
   *
   * // Simple pagination
   * const nextPage = await userService.searchUsers({
   *   offset: 10,
   *   limit: 10
   * });
   * ```
   */
  async searchUsers(options: {
    query?: string;
    limit?: number;
    offset?: number;
    organizationId?: string;
  }): Promise<User[]> {
    try {
      const { query, limit = 10, offset = 0, organizationId } = options;

      if (organizationId) {
        const results = await db
          .select({
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            role: user.role,
            banned: user.banned,
            banReason: user.banReason,
            banExpires: user.banExpires,
          })
          .from(user)
          .leftJoin(member, eq(user.id, member.userId))
          .where(
            and(
              eq(member.organizationId, organizationId),
              query
                ? or(
                    like(user.name, `%${query}%`),
                    like(user.email, `%${query}%`)
                  )
                : undefined
            )
          )
          .limit(limit)
          .offset(offset);

        return results;
      }

      // Regular user search without organization filter
      return await db
        .select()
        .from(user)
        .where(
          query
            ? or(like(user.name, `%${query}%`), like(user.email, `%${query}%`))
            : undefined
        )
        .limit(limit)
        .offset(offset);
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "searchUsers",
        severity: ErrorSeverity.ERROR,
        details: { options },
      });
      throw new ApiError(
        "Failed to search users",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }
  },

  /**
   * Updates user preferences with audit logging
   *
   * @param {string} userId - The ID of the user
   * @param {Record<string, unknown>} newPreferences - User preferences to update
   * @returns {Promise<void>}
   * @throws {ApiError} If update fails
   *
   * @example
   * ```ts
   * await userService.updateUserPreferences("user_123", {
   *   theme: "dark",
   *   notifications: { email: true, push: false }
   * });
   * ```
   */
  async updateUserPreferences(
    userId: string,
    newPreferences: Record<string, unknown>
  ): Promise<void> {
    try {
      await db.transaction(async (tx) => {
        // Convert preferences object to key-value pairs
        const preferencePairs = Object.entries(newPreferences).map(
          ([key, value]) => ({
            id: nanoid(),
            entityId: userId,
            entityType: ENTITY_TYPES.USER,
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

        await this.logUserActivity(
          userId,
          "PREFERENCES_UPDATE",
          newPreferences
        );
      });
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "updateUserPreferences",
        severity: ErrorSeverity.ERROR,
        details: { userId, preferences: newPreferences },
      });
      throw new ApiError(
        "Failed to update preferences",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }
  },

  /**
   * Gets user preferences
   *
   * @param {string} userId - The ID of the user
   * @returns {Promise<Record<string, unknown>>} User preferences
   * @throws {ApiError} If fetching preferences fails
   *
   * @example
   * ```ts
   * const preferences = await userService.getUserPreferences("user_123");
   * ```
   */
  async getUserPreferences(userId: string): Promise<Record<string, unknown>> {
    try {
      const userPrefs = await db.query.preferences.findMany({
        where: and(
          eq(preferences.entityId, userId),
          eq(preferences.entityType, ENTITY_TYPES.USER)
        ),
      });

      return userPrefs.reduce(
        (acc, pref) => ({
          ...acc,
          [pref.key]: JSON.parse(pref.value),
        }),
        {}
      );
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "getUserPreferences",
        severity: ErrorSeverity.ERROR,
        details: { userId },
      });
      throw new ApiError(
        "Failed to fetch preferences",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }
  },

  /**
   * Updates a user's active status with audit logging
   *
   * @param {string} userId - The ID of the user
   * @param {boolean} isActive - New active status
   * @returns {Promise<User>} Updated user object
   * @throws {ApiError} If status update fails
   *
   * @example
   * ```ts
   * // Deactivate a user
   * await userService.updateUserStatus("user_123", false);
   *
   * // Reactivate a user
   * await userService.updateUserStatus("user_123", true);
   * ```
   *
   * @remarks
   * - Inactive users cannot log in
   * - Status changes are logged in audit trail
   * - Does not affect existing sessions
   */
  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    const updated = await this.updateUser(userId, {
      banned: !isActive,
      updatedAt: new Date(),
    });

    await this.logUserActivity(userId, "STATUS_UPDATE", { isActive });
    return updated;
  },

  /**
   * Gets user statistics for dashboard
   * @returns {Promise<UserStats>} User statistics
   * @throws {ApiError} If fetching statistics fails
   *
   * @example
   * ```ts
   * const stats = await userService.getUserStats();
   * ```
   *
   */
  async getUserStats(): Promise<{
    total: number;
    active: number;
    banned: number;
    withOrganizations: number;
  }> {
    try {
      const [stats] = await db
        .select({
          total: sql<number>`count(*)`,
          active: sql<number>`sum(case when ${user.banned} is null or ${user.banned} = 0 then 1 else 0 end)`,
          banned: sql<number>`sum(case when ${user.banned} = 1 then 1 else 0 end)`,
          withOrganizations: sql<number>`count(distinct ${member.userId})`,
        })
        .from(user)
        .leftJoin(member, eq(user.id, member.userId));

      return {
        total: Number(stats.total) || 0,
        active: Number(stats.active) || 0,
        banned: Number(stats.banned) || 0,
        withOrganizations: Number(stats.withOrganizations) || 0,
      };
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "getUserStats",
        severity: ErrorSeverity.ERROR,
      });
      throw new ApiError(
        "Failed to fetch user statistics",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }
  },

  /**
   * Gets recent user activity
   * @param {number} limit - Number of activities to return
   * @returns {Promise<AuditLog[]>} Recent user activities
   *
   * @example
   * ```ts
   * const activities = await userService.getRecentUserActivity();
   * ```
   *
   */
  async getRecentUserActivity(limit = 10): Promise<AuditLog[]> {
    try {
      return await db.query.auditLog.findMany({
        where: eq(auditLog.entityType, ENTITY_TYPES.USER),
        orderBy: (auditLog, { desc }) => [desc(auditLog.createdAt)],
        limit,
        with: {
          actor: true,
        },
      });
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "getRecentUserActivity",
        severity: ErrorSeverity.ERROR,
      });
      throw new ApiError(
        "Failed to fetch recent activity",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }
  },
};
