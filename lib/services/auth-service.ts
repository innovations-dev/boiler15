import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

import { ApiError } from "../api/error";
import { auth } from "../auth";
import { hasPermission } from "../auth/permissions";
import type { Member, User } from "../db/schema";
import { API_ERROR_CODES } from "../schemas/api-types";
import type { AuthSession } from "../schemas/auth";
import { memberService } from "./member-service";

type ActiveMemberResponse = {
  data: Member & {
    user: User;
    organization: {
      id: string;
      name: string;
    };
  };
};

export const authService = {
  /**
   * Validates user session and permissions
   */
  async validateRequest(
    request: NextRequest,
    permission?: string,
    organizationId?: string
  ) {
    const response = await auth.handler(request);
    if (!response.ok) {
      throw new ApiError("Unauthorized", API_ERROR_CODES.UNAUTHORIZED, 401);
    }

    const data = await response.json();

    // System admin override
    if (data.user?.role === "admin") {
      return data;
    }

    // Check org-specific permissions
    if (organizationId && permission) {
      const member = await memberService.getMemberRole(
        organizationId,
        data.user.id
      );

      if (!member || !hasPermission(member.role, permission)) {
        throw new ApiError(
          "Insufficient permissions",
          API_ERROR_CODES.FORBIDDEN,
          403
        );
      }
    }

    return data;
  },

  async requireOrganizationAccess(
    request: Request,
    organizationId: string,
    requiredRole?: "owner"
  ): Promise<NextResponse | null> {
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

      if (!authData?.session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      if (authData.session.user.role === "admin") {
        return null;
      }

      const { data: activeMember } = await betterFetch<ActiveMemberResponse>(
        `/api/organizations/${organizationId}/members/active`,
        {
          baseURL: new URL(request.url).origin,
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );

      if (
        !activeMember?.data ||
        activeMember.data.organizationId !== organizationId
      ) {
        return new NextResponse("Unauthorized", { status: 403 });
      }

      if (requiredRole === "owner" && activeMember.data.role !== "owner") {
        return new NextResponse("Unauthorized", { status: 403 });
      }

      return null;
    } catch (error) {
      console.error("Organization access check failed:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  },
};
