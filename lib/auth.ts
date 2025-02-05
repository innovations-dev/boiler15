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

import { betterAuth, User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError as BetterAuthAPIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  magicLink,
  multiSession,
  openAPI,
  organization,
} from "better-auth/plugins";

import { env } from "@/env";
import * as schema from "@/lib/db/schema";
import { db } from "./db";
import { EmailRateLimitError } from "./email";
import { sendEmail } from "./email/services/email-service";
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
    onError: (error: BetterAuthAPIError) => {
      console.error("BetterAuth error:", error);
      throw new Error(error.message);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        template: "VERIFICATION",
        data: { url },
        subject: "Verify your email",
      });
    },
    verificationEmailLifetime: 60 * 60 * 24, // 24 hours
  },
  socialProviders: {
    github: {
      enabled: true,
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    openAPI(),
    multiSession(),
    admin({
      defaultBanReason: "Violated terms of service",
      defaultBanExpiresIn: 60 * 60 * 24 * 30, // 30 days
      impersonationSessionDuration: 60 * 60, // 1 hour
    }),
    organization({
      async sendInvitationEmail(data) {
        if (!data?.id || !data?.organization?.name || !data?.inviter?.userId) {
          throw new BetterAuthAPIError("BAD_REQUEST", {
            message: "Invalid invitation data",
          });
        }

        try {
          const result = await sendEmail({
            to: data.email,
            template: "INVITATION",
            subject: `Invitation to join organization ${data.organization.name}`,
            data: {
              url: `${baseURL.toString()}/accept-invite/${data.id}`,
              organizationName: data.organization.name,
              invitedByUsername: data.inviter.userId,
            },
          });

          if (!result.success) {
            throw result.error;
          }

          // Log successful invitation email sent (without sensitive data)
          console.log("Organization invitation email sent successfully:", {
            to: data.email.split("@")[0] + "@***",
            organization: data.organization.name,
            invitedBy: data.inviter.userId,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          // Handle rate limiting specifically
          if (error instanceof EmailRateLimitError) {
            throw new BetterAuthAPIError("TOO_MANY_REQUESTS", {
              message: "Too many invitation attempts. Please try again later.",
            });
          }

          // Log the error with appropriate context
          console.error("Failed to send organization invitation email:", {
            error: error instanceof Error ? error.message : "Unknown error",
            organization: data.organization.name,
            timestamp: new Date().toISOString(),
          });

          // Throw appropriate auth error
          throw new BetterAuthAPIError("INTERNAL_SERVER_ERROR", {
            message: "Failed to send invitation email. Please try again later.",
          });
        }
      },
    }),
    magicLink({
      async sendMagicLink({ email, url }) {
        console.log("🚀 ~ sendMagicLink ~ { email, url }:", { email, url });
        try {
          const result = await sendEmail({
            to: email,
            subject: "Login to your account",
            template: "MAGIC_LINK",
            data: { url },
          });

          if (!result.success) {
            throw result.error;
          }
        } catch (error) {
          if (error instanceof EmailRateLimitError) {
            throw new BetterAuthAPIError("TOO_MANY_REQUESTS", {
              message: "Too many login attempts. Please try again later.",
            });
          }
          throw new BetterAuthAPIError("INTERNAL_SERVER_ERROR", {
            message: "Failed to send login email. Please try again later.",
          });
        }
      },
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
            message: "Admin accounts can't be deleted",
          });
        }
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github"],
    },
  },
});
