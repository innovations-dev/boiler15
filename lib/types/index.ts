import { USER_ROLES } from "@/lib/constants/roles";

/**
 * User role type derived from USER_ROLES constant
 */
export type UserRole = keyof typeof USER_ROLES;
