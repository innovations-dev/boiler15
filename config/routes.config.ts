export const navigationRoutes = {
  main: [
    { name: "About", href: "/about" },
    { name: "Admin", href: "/admin" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "DeveloperDocs", href: "/docs" },
  ],
  product: [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "User Documentation", href: "/docs" },
  ],
  auth: [
    { name: "Sign in", href: "/sign-in" },
    { name: "Get Started", href: "/register" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
} as const;
