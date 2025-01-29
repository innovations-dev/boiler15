export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
} as const;

export type UserRole = keyof typeof USER_ROLES;

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrator",
  USER: "Regular User",
  MODERATOR: "Moderator",
};
