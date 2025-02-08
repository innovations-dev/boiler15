import { NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

import { Member, Session, User } from "@/lib/db/schema";

type AuthSession = {
  session: Session & {
    user: User;
  };
};

type ActiveMemberResponse = {
  data: Member & {
    user: User;
    organization: {
      id: string;
      name: string;
    };
  };
};

/**
 * Middleware to check organization access based on role
 * @param request - The incoming request
 * @param organizationId - The organization ID to check access for
 * @param requiredRole - The required role level (owner > admin > member)
 */
export async function requireOrganizationAccess(
  request: Request,
  organizationId: string,
  requiredRole?: "owner" | "admin" | "member"
) {
  try {
    const { data: authData } = await betterFetch<AuthSession>(
      "/api/auth/get-session",
      {
        baseURL: new URL(request.url).origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    // Check if session exists and has user data
    if (!authData?.session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Admin override
    if (authData.session.user.role === "admin") {
      return null; // Allow request to proceed
    }

    // Get active member
    const { data: activeMember } = await betterFetch<ActiveMemberResponse>(
      `/api/organizations/${organizationId}/members/active`,
      {
        baseURL: new URL(request.url).origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    // Check basic organization access
    if (
      !activeMember?.data ||
      activeMember.data.organizationId !== organizationId
    ) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // If no specific role is required, basic membership is enough
    if (!requiredRole) {
      return null;
    }

    const memberRole = activeMember.data.role;

    // Role hierarchy check
    const hasRequiredAccess =
      memberRole === "owner" || // Owner has all access
      (memberRole === "admin" && requiredRole !== "owner") || // Admin has access to admin and member roles
      (memberRole === "member" && requiredRole === "member"); // Member only has member access

    if (!hasRequiredAccess) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return null; // Allow request to proceed
  } catch (error) {
    console.error("Organization access check failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
