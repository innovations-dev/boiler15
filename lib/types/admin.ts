/**
 * @fileoverview Admin-related types and schemas for managing administrative functionality
 * @module lib/types/admin
 */

import { z } from "zod";

import { userSelectSchema } from "../db/schema";
import { ApiResponse } from "../schemas/api-types";

/**
 * Represents core administrative statistics
 * @interface AdminStats
 * @property {number} totalUsers - Total number of registered users
 * @property {number} totalOrganizations - Total number of organizations
 * @property {number} activeSessions - Current number of active user sessions
 *
 * @example
 * const stats: AdminStats = {
 *   totalUsers: 150,
 *   totalOrganizations: 25,
 *   activeSessions: 42
 * };
 */
export interface AdminStats {
  totalUsers: number;
  totalOrganizations: number;
  activeSessions: number;
}

/**
 * Zod schema for validating admin statistics
 * @see AdminStats
 */
export const adminStatsSchema = z.object({
  totalUsers: z.number(),
  totalOrganizations: z.number(),
  activeSessions: z.number(),
});

/**
 * API response type for admin statistics
 * @typedef {ApiResponse<AdminStats | null>} AdminStatsResponse
 */
export type AdminStatsResponse = ApiResponse<AdminStats | null>;

/**
 * Represents administrative permissions and user management data
 * @interface AdminPermissionsData
 * @property {Array} users - Array of user objects with extended admin-specific properties
 *
 * @example
 * const permissionsData: AdminPermissionsData = {
 *   users: [{
 *     id: '123',
 *     email: 'user@example.com',
 *     role: 'admin',
 *     banned: false,
 *     banReason: null,
 *     banExpires: null
 *   }]
 * };
 */
export interface AdminPermissionsData {
  users: Array<
    z.infer<typeof userSelectSchema> & {
      image?: string | null | undefined;
      role?: string | null | undefined;
      banned?: boolean | null;
      banReason: string | null;
      banExpires: Date | null;
    }
  >;
}

/**
 * Zod schema for validating admin permissions data
 * @see AdminPermissionsData
 */
export const adminPermissionsDataSchema = z.object({
  users: z.array(
    userSelectSchema.extend({
      image: z.string().nullish().optional(),
      role: z.string().nullable().optional(),
      banned: z.boolean().nullable().optional(),
      banReason: z.string().nullable(),
      banExpires: z.date().nullable(),
    })
  ),
});

/**
 * Schema for admin permissions validation
 * @see AdminPermissionsData
 */
export const adminPermissionsSchema = adminPermissionsDataSchema;

/**
 * Type definition for admin permissions based on the schema
 * @typedef {z.infer<typeof adminPermissionsSchema>} AdminPermissions
 */
export type AdminPermissions = z.infer<typeof adminPermissionsSchema>;

/**
 * API response type for admin permissions data
 * @typedef {ApiResponse<AdminPermissionsData>} AdminPermissionsResponse
 */
export type AdminPermissionsResponse = ApiResponse<AdminPermissionsData>;

/*
@Example:
async function getAdminStats(): Promise<AdminStatsResponse> {
  const response = await fetch('/api/admin/stats');
  const data = await response.json();
  return adminStatsSchema.parse(data);
}
*/
/*
@Example:
async function getUserPermissions(): Promise<AdminPermissionsResponse> {
  const response = await fetch('/api/admin/permissions');
  const data = await response.json();
  return adminPermissionsDataSchema.parse(data);
}
*/
/*
@Example:
function validateAdminStats(data: unknown): AdminStats {
  return adminStatsSchema.parse(data);
}
*/
