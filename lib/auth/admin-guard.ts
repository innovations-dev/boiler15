import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError as BetterAuthAPIError } from "better-auth/api";

import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants/roles";
import { userSelectSchema } from "@/lib/db/schema";
import { ForbiddenError, UnauthorizedError } from "@/lib/query/error";
import {
  AUDIT_ACTIONS,
  createAuditLog,
  ENTITY_TYPES,
} from "@/lib/services/audit-log";

export const dynamic = "force-dynamic";

/**
 * Guards routes that require admin privileges.
 *
 * @description
 * This function acts as a middleware to protect admin-only routes. It verifies the user's
 * session and checks if they have admin privileges. If the checks fail, it redirects
 * the user to appropriate pages based on their authentication status.
 *
 * Rate limiting is handled by Better-Auth automatically.
 * All access attempts are logged for audit purposes.
 *
 * @throws {UnauthorizedError} When the session is invalid or missing
 * @throws {ForbiddenError} When the user doesn't have admin privileges
 * @throws {BetterAuthAPIError} With code "TOO_MANY_REQUESTS" when rate limit is exceeded
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
  const headersList = await headers();

  try {
    const session = await auth.api.getSession({ headers: headersList });
    const parsedUser = userSelectSchema.safeParse(session?.user);

    if (!parsedUser.success) {
      throw new UnauthorizedError("Invalid session");
    }

    if (parsedUser.data.role !== USER_ROLES.ADMIN) {
      // Log failed admin access attempt
      await createAuditLog({
        action: AUDIT_ACTIONS.ADMIN.LOGIN,
        entityType: ENTITY_TYPES.ADMIN,
        entityId: parsedUser.data.id,
        actorId: parsedUser.data.id,
        metadata: {
          success: false,
          reason: "insufficient_permissions",
          requestedRole: USER_ROLES.ADMIN,
          actualRole: parsedUser.data.role,
        },
      });

      throw new ForbiddenError("Admin access required");
    }

    // Log successful admin access
    await createAuditLog({
      action: AUDIT_ACTIONS.ADMIN.LOGIN,
      entityType: ENTITY_TYPES.ADMIN,
      entityId: parsedUser.data.id,
      actorId: parsedUser.data.id,
      metadata: {
        success: true,
      },
    });

    return parsedUser.data;
  } catch (error) {
    console.error("Admin guard error:", error);

    if (
      error instanceof BetterAuthAPIError &&
      (error as any).code === "TOO_MANY_REQUESTS"
    ) {
      throw error; // Let Better-Auth handle the rate limiting error
    }

    if (error instanceof ForbiddenError) {
      redirect("/dashboard");
    }

    redirect("/sign-in");
  }
}
