export const queryKeys = {
  organizations: {
    all: ["organizations"] as const,
    list: () => ["organizations", "list"] as const,
    byId: (id: string) => ["organizations", id] as const,
    members: (id: string) => ["organizations", id, "members"] as const,
  },
  users: {
    all: ["users"] as const,
    byId: (id: string) => ["users", id] as const,
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
