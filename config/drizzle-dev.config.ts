import type { Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
  },
} satisfies Config;
