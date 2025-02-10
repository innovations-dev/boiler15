import { BetterAuthOptions, User } from "better-auth";

import { env } from "@/env";
import { sendEmail } from "@/lib/email/services/email-service";
import { baseURL } from "@/lib/utils";

export const githubConfig = {
  enabled: true,
  clientId: env.GITHUB_CLIENT_ID,
  clientSecret: env.GITHUB_CLIENT_SECRET,
  redirectUri: `${baseURL.toString()}/api/auth/callback/github`,
};

export const providers: BetterAuthOptions = {
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    maxPasswordLength: 100,
    minPasswordLength: 8,
    async sendResetPassword({ user, url }: { user: User; url: string }) {
      try {
        await sendEmail({
          to: user.email,
          template: "RESET_PASSWORD",
          data: { url },
          subject: "Reset your password",
        });
        return;
      } catch (error) {
        console.error("Failed to send reset password email", error);
        return;
      }
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        template: "VERIFICATION",
        data: { url },
        subject: "Verify your email",
      });
    },
  },
  socialProviders: {
    github: githubConfig,
  },
};
