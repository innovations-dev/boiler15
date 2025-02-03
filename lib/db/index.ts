/**
 * Database configuration and client setup for Turso with Drizzle ORM
 * @module lib/db
 */

import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "@/env";
import * as schema from "./schema";

/**
 * Turso database client instance
 * @private
 * @const {import("@libsql/client").Client}
 */
const turso = createClient({
  url: env.TURSO_DATABASE_URL!,
  authToken: env.TURSO_AUTH_TOKEN,
});

/**
 * Configured Drizzle ORM instance with Turso client
 * @const {import("drizzle-orm/libsql").LibSQLDatabase}
 *
 * @example
 * // Query all users
 * const users = await db.query.users.findMany();
 *
 * @example
 * // Insert a new record
 * const newUser = await db.insert(schema.users).values({
 *   name: "John Doe",
 *   email: "john@example.com"
 * });
 *
 * @example
 * // Use in a Server Component
 * async function UserList() {
 *   const users = await db.query.users.findMany({
 *     with: {
 *       posts: true
 *     }
 *   });
 *   return <div>{users.map(user => <UserCard key={user.id} user={user} />)}</div>
 * }
 *
 * @example
 * // Use in an API route
 * export async function GET() {
 *   const users = await db.query.users.findMany();
 *   return Response.json({ users });
 * }
 */
export const db = drizzle(turso, { schema });
