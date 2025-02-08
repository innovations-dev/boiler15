export interface NavItem {
  title: string;
  href: string;
  items?: NavItem[];
}

export interface NavSection {
  title: string;
  href: string;
  items: NavItem[];
}

export const docsConfig = {
  sidebarNav: [
    {
      title: "Getting Started",
      href: "/docs/getting-started",
      items: [
        {
          title: "Introduction",
          href: "/docs/getting-started/introduction",
        },
        {
          title: "Installation",
          href: "/docs/getting-started/installation",
        },
      ],
    },
    {
      title: "Features",
      href: "/docs/features",
      items: [
        {
          title: "Authentication",
          href: "/docs/features/authentication",
          items: [
            {
              title: "Multi-Tenancy",
              href: "/docs/features/authentication/multi-tenancy",
            },
          ],
        },
        {
          title: "Database",
          href: "/docs/features/database",
        },
        {
          title: "Email",
          href: "/docs/features/email",
        },
        {
          title: "Error Handling",
          href: "/docs/features/error-handling",
        },
        {
          title: "Query Patterns",
          href: "/docs/features/query-patterns",
          items: [
            {
              title: "RBAC",
              href: "/docs/features/query-patterns/rbac",
            },
          ],
        },
        {
          title: "UI Components",
          href: "/docs/features/ui-components",
        },
        {
          title: "Kitchen Sink",
          href: "/docs/features/kitchen-sink",
        },
      ],
    },
  ] satisfies NavSection[],
} as const;
