import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { userSelectSchema } from "@/lib/db/schema";
import type { Session } from "@/lib/db/schema";
import { UnauthorizedError } from "@/lib/query/error";

export const dynamic = "force-dynamic";

/**
 * Guards routes that require authentication and an active organization.
 *
 * @description
 * This function acts as a middleware to protect dashboard routes. It verifies the user's
 * session and checks if they have an active organization. If the checks fail, it redirects
 * the user to appropriate pages based on their authentication status.
 *
 * @throws {UnauthorizedError} When the session is invalid or missing
 *
 * @example
 * ```typescript
 * // Use in a Server Component or Route Handler
 * async function DashboardPage() {
 *   const { user, activeOrganizationId } = await guardDashboardRoute();
 *   // If execution reaches here, the user is authenticated with an active organization
 *   return <div>Dashboard for {user.name}</div>;
 * }
 * ```
 *
 * @returns {Promise<{ user: User, activeOrganizationId: string }>} The authenticated user's data and active organization ID
 */
export async function guardDashboardRoute() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const parsedUser = userSelectSchema.safeParse(session?.user);

    if (!parsedUser.success) {
      throw new UnauthorizedError("Invalid session");
    }

    const activeOrganizationId = (session?.session as Session)
      ?.activeOrganizationId;
    if (!activeOrganizationId) {
      redirect("/organizations");
    }

    return {
      user: parsedUser.data,
      activeOrganizationId,
    };
  } catch (error) {
    console.error("Dashboard guard error:", error);

    if (error instanceof UnauthorizedError) {
      redirect("/sign-in");
    }

    throw error;
  }
}
