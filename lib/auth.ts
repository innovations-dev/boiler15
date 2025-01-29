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

import { getMagicLinkEmail } from "@/emails/magic-link";
import { env } from "@/env";
import * as schema from "@/lib/db/schema";
import { db } from "./db";
import { sendEmailWithRetry } from "./email/services/send-email";
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
      sendInvitationEmail: async (data) => {
        const inviteLink = new URL(
          `${baseURL.toString()}/accept-invite/${data?.id}`
        ).toString();
        // TODO: handle sendInvitationEmail w/ logging
        // TODO: add active organization to session - see boiler databaseHooks
        console.log("Invitation sent:", inviteLink);
      },
    }),
    magicLink({
      async sendMagicLink({ email, url }) {
        console.log("Sending magic link to", email, url);
        sendEmailWithRetry({
          to: email,
          subject: "Login to your account.",
          html: await getMagicLinkEmail(url),
        });
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
