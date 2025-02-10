import type { NextRequest } from "next/server";

import { ApiError } from "../api/error";
import { auth } from "../auth";
import { hasPermission } from "../auth/permissions";
import { API_ERROR_CODES } from "../schemas/api-types";
import { memberService } from "./member-service";

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
};
