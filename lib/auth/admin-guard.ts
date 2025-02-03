import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants/roles";
import { userSelectSchema } from "@/lib/db/schema";
import { ForbiddenError, UnauthorizedError } from "@/lib/query/error";

export const dynamic = "force-dynamic";

/**
 * Guards routes that require admin privileges.
 *
 * @description
 * This function acts as a middleware to protect admin-only routes. It verifies the user's
 * session and checks if they have admin privileges. If the checks fail, it redirects
 * the user to appropriate pages based on their authentication status.
 *
 * @throws {UnauthorizedError} When the session is invalid or missing
 * @throws {ForbiddenError} When the user doesn't have admin privileges
 *
 * @example
 * // Use in a Server Component or Route Handler
 * async function AdminPage() {
 *   const admin = await guardAdminRoute();
 *   // If execution reaches here, the user is authenticated as an admin
 *   return <div>Admin Dashboard</div>;
 * }
 *
 * @example
 * // Use in an API route
 * async function POST(req: Request) {
 *   const admin = await guardAdminRoute();
 *   // Proceed with admin-only operations
 * }
 *
 * @returns {Promise<typeof userSelectSchema._type>} The authenticated admin user's data
 */
export async function guardAdminRoute() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const parsedUser = userSelectSchema.safeParse(session?.user);

    if (!parsedUser.success) {
      throw new UnauthorizedError("Invalid session");
    }

    if (parsedUser.data.role !== USER_ROLES.ADMIN) {
      throw new ForbiddenError("Admin access required");
    }

    return parsedUser.data;
  } catch (error) {
    console.error("Admin guard error:", error);
    if (error instanceof ForbiddenError) {
      redirect("/dashboard");
    }
    redirect("/sign-in");
  }
}
