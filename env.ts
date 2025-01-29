import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  },
  server: {
    BETTER_AUTH_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    RESEND_API_KEY: z.string(),
    EMAIL_FROM: z.string(),
    TEST_EMAIL: z.string(),
    TURSO_DATABASE_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string(),
  },
  // For Next.js, we need to specify experimental runtimeEnv
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
