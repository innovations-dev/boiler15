/**
 * @fileoverview Member service for managing organization membership operations.
 * This module provides a centralized interface for member management with features like:
 * - Member CRUD operations
 * - Role management
 * - Invitation handling
 * - Activity logging
 */

import { eq } from "drizzle-orm";

import { ApiError } from "../api/error";
import { db } from "../db";
import { Member } from "../db/schema";
import * as schema from "../db/schema";
import { errorLogger } from "../logger/enhanced-logger";
import { ErrorSeverity, ErrorSource } from "../logger/types";
import { API_ERROR_CODES } from "../schemas/api-types";

/**
 * Service for managing organization membership operations.
 * Provides a centralized interface for member management with proper error handling and logging.
 *
 * @namespace MemberService
 *
 * @example
 * ```ts
 * // Manage members
 * await memberService.addMember("org_123", "user_456", "member");
 * await memberService.updateMemberRole("org_123", "user_456", "admin");
 *
 * // Handle invitations
 * const invitation = await memberService.createInvitation("org_123", "user@example.com");
 * await memberService.acceptInvitation(invitation.id);
 * ```
 */

export const memberService = {
  async getMembersByOrganization(organizationId: string): Promise<Member[]> {
    try {
      return await db.query.member.findMany({
        where: eq(schema.member.organizationId, organizationId),
        with: {
          user: true,
        },
      });
    } catch (error) {
      errorLogger.log(error, ErrorSource.DATABASE, {
        context: "getMembersByOrganization",
        severity: ErrorSeverity.ERROR,
        details: { organizationId },
      });
      throw new ApiError(
        "Failed to fetch members",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }
  },
};
