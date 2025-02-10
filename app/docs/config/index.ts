export interface NavItem {
  id: string;
  name: string;
  href: string;
  children?: NavItem[];
}

export interface NavSection {
  id: string;
  name: string;
  href?: string;
  children: NavItem[];
}

export const docsConfig = {
  sidebarNav: [
    {
      id: "getting-started",
      name: "Getting Started",
      children: [
        {
          id: "introduction",
          name: "Introduction",
          href: "/docs/getting-started/introduction",
        },
        {
          id: "installation",
          name: "Installation",
          href: "/docs/getting-started/installation",
        },
      ],
    },
    {
      id: "features",
      name: "Features",
      children: [
        {
          id: "authentication",
          name: "Authentication",
          href: "/docs/features/authentication",
          children: [
            {
              id: "rbac",
              name: "RBAC",
              href: "/docs/features/query-patterns/rbac",
            },
            {
              id: "multi-tenancy",
              name: "Multi-Tenancy",
              href: "/docs/features/authentication/multi-tenancy",
            },
          ],
        },
        {
          id: "database",
          name: "Database",
          href: "/docs/features/database",
        },
        {
          id: "email",
          name: "Email",
          href: "/docs/features/email",
        },
        {
          id: "error-handling",
          name: "Error Handling",
          href: "/docs/features/error-handling",
        },
        {
          id: "query-patterns",
          name: "Query Patterns",
          href: "/docs/features/query-patterns",
        },
        {
          id: "ui-components",
          name: "UI Components",
          href: "/docs/features/ui-components",
          children: [
            {
              id: "kitchen-sink",
              name: "Kitchen Sink",
              href: "/docs/features/ui-components/kitchen-sink",
            },
          ],
        },
      ],
    },
  ] satisfies NavSection[],
} as const;
