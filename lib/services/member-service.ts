import { and, eq } from "drizzle-orm";

import { ApiError } from "../api/error";
import { db } from "../db";
import { member } from "../db/schema";
import { errorLogger } from "../logger/enhanced-logger";
import { ErrorSeverity, ErrorSource } from "../logger/types";
import { API_ERROR_CODES } from "../schemas/api-types";

export const memberService = {
  /**
   * Gets member role for a specific organization
   *
   * @param organizationId - The organization ID
   * @param userId - The user ID
   * @returns The member's role or null if not found
   * @throws {ApiError} If database query fails
   */
  async getMemberRole(
    organizationId: string,
    userId: string
  ): Promise<{ role: string } | null> {
    try {
      const result = await db.query.member.findFirst({
        where: and(
          eq(member.organizationId, organizationId),
          eq(member.userId, userId)
        ),
        columns: {
          role: true,
        },
      });

      return result ?? null;
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "getMemberRole",
        severity: ErrorSeverity.ERROR,
        details: { organizationId, userId },
      });
      throw new ApiError(
        "Failed to get member role",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }
  },
};
