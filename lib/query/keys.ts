export const queryKeys = {
  organizations: {
    all: ["organizations"] as const,
    list: () => [...queryKeys.organizations.all, "list"] as const,
    listApi: () => [...queryKeys.organizations.all, "list", "api"] as const,
    byId: (id: string) => [...queryKeys.organizations.all, id] as const,
    members: (id: string) =>
      [...queryKeys.organizations.all, id, "members"] as const,
  },
  users: {
    all: ["users"] as const,
    byId: (id: string) => ["users", id] as const,
    byRole: (role: string) => ["users", "role", role] as const,
  },
  sessions: {
    all: ["sessions"] as const,
    current: ["sessions", "current"] as const,
  },
  team: {
    all: ["team"] as const,
    members: (orgId: string) => ["team", orgId, "members"] as const,
  },
  admin: {
    all: ["admin"] as const,
    stats: () => ["admin", "stats"] as const,
  },
} as const;
