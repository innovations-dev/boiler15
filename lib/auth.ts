/**
 * @fileoverview Authentication configuration using Better-Auth with various plugins and adapters.
 * This file sets up the main authentication system for the application with features like:
 * - Email verification
 * - Magic link authentication
 * - Multi-session support
 * - Organization management
 * - Admin capabilities
 * - Account linking
 */

import { betterAuth, BetterAuthOptions, User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError as BetterAuthAPIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  customSession,
  magicLink,
  multiSession,
  openAPI,
  organization,
} from "better-auth/plugins";

import { env } from "@/env";
import * as schema from "@/lib/db/schema";
import { databaseHooks } from "./auth/config/hooks";
import {
  adminConfig,
  getActiveOrganization,
  magicLinkConfig,
  organizationConfig,
} from "./auth/config/plugins";
import { githubConfig, providers } from "./auth/config/providers";
import { db } from "./db";
import { serverOnError } from "./errors/server-error";
import { baseURL } from "./utils";

/**
 * Main authentication instance configured with Better-Auth.
 *
 * @example
 * // Using auth in an API route
 * import { auth } from '@/lib/auth';
 *
 * export async function GET(request: Request) {
 *   const session = await auth.validateSession(request);
 *   if (!session) return new Response('Unauthorized', { status: 401 });
 *   return new Response('Authenticated!');
 * }
 *
 * @example
 * // Using auth in a Server Component
 * import { auth } from '@/lib/auth';
 *
 * export default async function ProtectedPage() {
 *   const session = await auth.validateSession();
 *   if (!session) redirect('/login');
 *   return <div>Welcome {session.user.email}!</div>;
 * }
 *
 * @remarks
 * Configuration includes:
 * - Drizzle adapter for database operations
 * - Email verification system
 * - Magic link authentication
 * - Multi-session support
 * - Organization management with invitations
 * - Admin capabilities including user banning and impersonation
 * - Account deletion with safety checks
 * - Account linking with trusted providers
 *
 * @throws {BetterAuthAPIError}
 * - "TOO_MANY_REQUESTS" when email rate limits are exceeded
 * - "INTERNAL_SERVER_ERROR" when email sending fails
 * - "BAD_REQUEST" for invalid operations (e.g., deleting admin accounts)
 */

const enabledProviders = ["password", "github"];

export const auth = betterAuth({
  baseURL: baseURL.toString(),
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  trustedOrigins: [baseURL.toString()],
  fetchOptions: {
    credentials: "include",
    onError: serverOnError,
  },
  emailAndPassword: {
    ...(enabledProviders.includes("password")
      ? { ...providers.emailAndPassword }
      : {}),
  },
  emailVerification: {
    ...(enabledProviders.includes("password")
      ? { ...providers.emailVerification }
      : {}),
  },
  socialProviders: enabledProviders.includes("github")
    ? {
        github: githubConfig,
      }
    : {},
  databaseHooks,
  plugins: [
    admin(adminConfig),
    organization(organizationConfig),
    magicLink(magicLinkConfig),
    openAPI(),
    multiSession(),
    customSession(async ({ user, session }) => {
      try {
        const activeOrganization = await getActiveOrganization({
          userId: user.id,
        });

        return {
          session: { ...session, activeOrganizationId: activeOrganization?.id },
          user,
        };
      } catch (error) {
        console.error("customSession error:", error);
        return {
          session,
          user,
        };
      }
    }),
    nextCookies(),
  ],
  user: {
    deleteUser: {
      enabled: true,
      deleteAccount: true,
      deleteAccountAfter: 60 * 60 * 24 * 7, // 7 days
      beforeDelete: async (user: User) => {
        if (user.email.includes("admin")) {
          throw new BetterAuthAPIError("BAD_REQUEST", {
            cause: "Admin accounts can't be deleted",
          });
        }
        // TODO: Delete user from all organizations
        // await db.delete(schema.member).where(eq(schema.member.userId, user.id));
        // TODO: Delete user from all member
        // await db.delete(schema.member).where(eq(schema.member.userId, user.id));
        // TODO: Delete user from all invitations
        // await db.delete(schema.invitation).where(eq(schema.invitation.userId, user.id));
        // TODO: Delete user from all sessions
        // await db.delete(schema.session).where(eq(schema.session.userId, user.id));
        // TODO: Delete user from all accounts
        // await db.delete(schema.account).where(eq(schema.account.userId, user.id));
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github"],
    },
  },
} as BetterAuthOptions);
