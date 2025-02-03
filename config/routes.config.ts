/**
 * @fileoverview Application route configuration defining the navigation structure
 * @module config/routes
 */

/**
 * @typedef {Object} NavigationItem
 * @property {string} name - Display name for the navigation item
 * @property {string} href - URL path for the navigation item
 */

/**
 * @typedef {Object} NavigationRoutes
 * @property {NavigationItem[]} main - Primary navigation routes
 * @property {NavigationItem[]} product - Product-related navigation routes
 * @property {NavigationItem[]} auth - Authentication-related navigation routes
 * @property {NavigationItem[]} legal - Legal documentation routes
 */

/**
 * Central configuration object for application navigation routes.
 * Organizes routes into logical groups for different sections of the application.
 *
 * @example
 * // Import and use in a navigation component
 * import { navigationRoutes } from '@/config/routes.config';
 *
 * function MainNav() {
 *   return (
 *     <nav>
 *       {navigationRoutes.main.map((item) => (
 *         <Link key={item.href} href={item.href}>
 *           {item.name}
 *         </Link>
 *       ))}
 *     </nav>
 *   );
 * }
 *
 * @example
 * // Use for route validation or generation
 * import { navigationRoutes } from '@/config/routes.config';
 *
 * function isValidRoute(path: string) {
 *   return Object.values(navigationRoutes)
 *     .flat()
 *     .some(route => route.href === path);
 * }
 *
 * @type {NavigationRoutes}
 */
export const navigationRoutes = {
  main: [{ name: "About", href: "/about" }],
  product: [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Docs", href: "/docs" },
  ],
  auth: [
    { name: "Sign in", href: "/sign-in" },
    { name: "Get Started", href: "/register" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/policies/privacy" },
    { name: "Terms of Service", href: "/policies/terms" },
  ],
};
