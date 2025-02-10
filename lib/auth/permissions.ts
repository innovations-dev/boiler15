import { ApiError } from "../api/error";
import { API_ERROR_CODES } from "../schemas/api-types";

export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
  GUEST: "guest",
} as const;

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

export function hasPermission(role: string, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function requirePermission(role: string, permission: string): void {
  if (!hasPermission(role, permission)) {
    throw new ApiError(
      "Insufficient permissions",
      API_ERROR_CODES.FORBIDDEN,
      403
    );
  }
}
