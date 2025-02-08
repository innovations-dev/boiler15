import { ORGANIZATION_ROLES, USER_ROLES } from "@/lib/constants/roles";

/**
 * User role type derived from USER_ROLES constant
 */
export type UserRole = keyof typeof USER_ROLES;

/**
 * Organization role type derived from ORGANIZATION_ROLES constant
 */
export type OrganizationRole = keyof typeof ORGANIZATION_ROLES;
