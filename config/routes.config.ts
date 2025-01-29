export const navigationRoutes = {
  main: [
    { name: "About", href: "/about" },
    { name: "Admin", href: "/admin" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Docs", href: "/docs" },
  ],
  product: [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Documentation", href: "/docs" },
  ],
  auth: {
    signIn: { name: "Sign in", href: "/login" },
    signUp: { name: "Get Started", href: "/register" },
  },
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
} as const;
