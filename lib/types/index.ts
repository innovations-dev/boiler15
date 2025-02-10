import { USER_ROLES } from "@/lib/constants/roles";

/**
 * User role type derived from USER_ROLES constant
 * @enum {string}
 * @readonly
 */
export type UserRole = keyof typeof USER_ROLES;

/**
 * Authentication mode type
 * @enum {string}
 * @readonly
 *
 * Used by
 */
export type AuthMode = "magic-link" | "credentials" | "register" | "password";
