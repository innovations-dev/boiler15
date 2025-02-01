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

import { getInvitationEmail } from "@/emails/invitation";
import { getMagicLinkEmail } from "@/emails/magic-link";
import { getVerificationEmail } from "@/emails/verification-email";
import { env } from "@/env";
import * as schema from "@/lib/db/schema";
import { db } from "./db";
import {
  EmailRateLimitError,
  sendEmailWithRetry,
} from "./email/services/send-email";
import { baseURL } from "./utils";

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
  emailVerificaiton: {
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: User;
      url: string;
    }) => {
      await sendEmailWithRetry({
        to: user.email,
        subject: "Verify your email",
        html: await getVerificationEmail(url),
      });
    },
    verificationEmailLifetime: 60 * 60 * 24, // 24 hours
  },
  plugins: [
    nextCookies(),
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
          const inviteLink = new URL(
            `${baseURL.toString()}/accept-invite/${data.id}`
          ).toString();

          const result = await sendEmailWithRetry({
            to: data.email,
            subject: `Invitation to join ${data.organization.name}`,
            html: await getInvitationEmail(
              inviteLink,
              data.organization.name,
              data.inviter.userId
            ),
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
        try {
          const result = await sendEmailWithRetry({
            to: email,
            subject: "Login to your account",
            html: await getMagicLinkEmail(url),
          });

          if (!result.success) {
            throw result.error;
          }

          // Log successful magic link email sent (without sensitive data)
          console.log("Magic link email sent successfully:", {
            to: email.split("@")[0] + "@***",
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          // Handle rate limiting specifically
          if (error instanceof EmailRateLimitError) {
            throw new BetterAuthAPIError("TOO_MANY_REQUESTS", {
              message: "Too many login attempts. Please try again later.",
            });
          }

          // Log the error with appropriate context
          console.error("Failed to send magic link email:", {
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
          });

          // Throw appropriate auth error
          throw new BetterAuthAPIError("INTERNAL_SERVER_ERROR", {
            message: "Failed to send login email. Please try again later.",
          });
        }
      },
    }),
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
