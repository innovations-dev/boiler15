/**
 * System and organization role definitions
 * @constant
 */
export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
  GUEST: "guest",
} as const;

/**
 * Granular permission definitions for different access levels
 * @constant
 * @example
 * ```ts
 * // Check specific permission
 * if (hasPermission(userRole, PERMISSIONS.ORGANIZATION.MANAGE_MEMBERS)) {
 *   // Allow member management
 * }
 *
 * // Use in API route
 * export async function POST(request: Request) {
 *   await withPermission(request, PERMISSIONS.ADMIN.MANAGE_USERS);
 *   // Handle admin-only operation
 * }
 * ```
 */
export const PERMISSIONS = {
  ORGANIZATION: {
    VIEW: "organization:view",
    EDIT: "organization:edit",
    DELETE: "organization:delete",
    MANAGE_MEMBERS: "organization:manage_members",
    MANAGE_BILLING: "organization:manage_billing",
  },
  MEMBER: {
    VIEW: "member:view",
    EDIT: "member:edit",
    REMOVE: "member:remove",
  },
  ADMIN: {
    VIEW_AUDIT_LOGS: "admin:view_audit_logs",
    MANAGE_USERS: "admin:manage_users",
    SYSTEM_SETTINGS: "admin:system_settings",
  },
} as const;

/**
 * Maps roles to their allowed permissions
 * @private
 */
const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.OWNER]: [
    ...Object.values(PERMISSIONS.ORGANIZATION),
    ...Object.values(PERMISSIONS.MEMBER),
    ...Object.values(PERMISSIONS.ADMIN),
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.ORGANIZATION.VIEW,
    PERMISSIONS.ORGANIZATION.EDIT,
    PERMISSIONS.ORGANIZATION.MANAGE_MEMBERS,
    PERMISSIONS.MEMBER.VIEW,
    PERMISSIONS.MEMBER.EDIT,
    PERMISSIONS.ADMIN.VIEW_AUDIT_LOGS,
  ],
  [ROLES.MEMBER]: [PERMISSIONS.ORGANIZATION.VIEW, PERMISSIONS.MEMBER.VIEW],
  [ROLES.GUEST]: [PERMISSIONS.ORGANIZATION.VIEW],
};

/**
 * Checks if a role has a specific permission
 *
 * @param role - The role to check
 * @param permission - The permission to verify
 * @returns boolean indicating if the role has the permission
 *
 * @example
 * ```ts
 * // Basic permission check
 * if (hasPermission('admin', PERMISSIONS.ORGANIZATION.MANAGE_MEMBERS)) {
 *   // Allow member management
 * }
 *
 * // With user service
 * const userRole = await userService.getUserOrganizationRole(userId, orgId);
 * if (hasPermission(userRole, PERMISSIONS.MEMBER.EDIT)) {
 *   // Allow member edit
 * }
 * ```
 */
export function hasPermission(role: string, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
