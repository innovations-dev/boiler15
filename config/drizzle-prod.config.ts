/**
 * @fileoverview Production configuration for Drizzle ORM with Turso database
 * @description This configuration file is used by drizzle-kit for database schema management
 * and migrations in production environment with Turso database.
 *
 * @usage
 * To use this configuration:
 * 1. Run migrations: pnpm drizzle-kit push:prod
 * 2. Generate migrations: pnpm drizzle-kit generate:prod
 *
 * @requires drizzle-kit
 * @requires @/env - Environment variables configuration
 *
 * @example
 * // Generate migration files
 * pnpm drizzle-kit generate:prod
 *
 * // Push migrations to production database
 * pnpm drizzle-kit push:prod
 *
 * @useCases
 * - Database schema version control
 * - Automated migration generation
 * - Production database synchronization
 * - CI/CD pipeline database management
 */

import type { Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
