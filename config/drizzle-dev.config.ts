/**
 * @fileoverview Development configuration for Drizzle ORM with Turso database
 * @description This configuration file is used by drizzle-kit to manage database migrations
 * and schema changes during development.
 *
 * @usage
 * Run migrations:
 * ```bash
 * pnpm drizzle-kit push:sqlite
 * ```
 *
 * Generate migrations:
 * ```bash
 * pnpm drizzle-kit generate:sqlite
 * ```
 *
 * @example
 * // Using with Turso CLI for local development
 * turso dev --db-file local.db
 *
 * @useCases
 * - Local development with SQLite database
 * - Generating and managing database migrations
 * - Schema version control
 * - Type-safe database operations
 */

import type { Config } from "drizzle-kit";

import { env } from "@/env";

/**
 * @type {Config}
 * @property {string} schema - Path to your database schema file
 * @property {string} out - Directory where migration files will be generated
 * @property {string} dialect - Database dialect (sqlite for Turso)
 * @property {Object} dbCredentials - Database connection credentials
 * @property {string} dbCredentials.url - Turso database URL from environment variables
 */
export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
  },
} satisfies Config;
