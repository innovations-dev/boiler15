import { NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

import { Member, User } from "@/lib/db/schema";
import type { AuthSession } from "@/lib/schemas/auth";

type ActiveMemberResponse = {
  data: Member & {
    user: User;
    organization: {
      id: string;
      name: string;
    };
  };
};

export async function requireOrganizationAccess(
  request: Request,
  organizationId: string,
  requiredRole?: "owner"
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

    // Check owner role if required
    if (requiredRole === "owner" && activeMember.data.role !== "owner") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return null; // Allow request to proceed
  } catch (error) {
    console.error("Organization access check failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
