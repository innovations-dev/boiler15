import { APIError as BetterAuthAPIError } from "better-auth/api";
import { OrganizationOptions } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { member, organization } from "@/lib/db/schema";
import { EmailRateLimitError } from "@/lib/email";
import { sendEmail } from "@/lib/email/services/email-service";
import { baseURL } from "@/lib/utils";

export const adminConfig = {
  defaultBanReason: "Violated terms of service",
  defaultBanExpiresIn: 60 * 60 * 24 * 30, // 30 days
  impersonationSessionDuration: 60 * 60, // 1 hour
};

export const organizationConfig: OrganizationOptions = {
  async sendInvitationEmail(data) {
    if (!data?.id || !data?.organization?.name || !data?.inviter?.userId) {
      throw new BetterAuthAPIError("BAD_REQUEST", {
        cause: "Invalid invitation data",
      });
    }

    try {
      const result = await sendEmail({
        to: data.email,
        template: "INVITATION",
        subject: `Invitation to join organization ${data.organization.name}`,
        data: {
          url: `${baseURL.toString()}/accept-invite/${data.id}`,
          organizationName: data.organization.name,
          invitedByUsername: data.inviter.userId,
        },
      });

      if (!result.success) {
        throw result.error;
      }

      // Log successful invitation email sent (without sensitive data)
      console.log("Organization invitation email sent successfully:", {
        to: data.email.split("@")[0] + "@***",
        organization: data.organization.name,
        invitedBy: data.inviter.userId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Handle rate limiting specifically
      if (error instanceof EmailRateLimitError) {
        throw new BetterAuthAPIError("TOO_MANY_REQUESTS", {
          cause: "Too many invitation attempts. Please try again later.",
        });
      }

      // Log the error with appropriate context
      console.error("Failed to send organization invitation email:", {
        error: error instanceof Error ? error.message : "Unknown error",
        organization: data.organization.name,
        timestamp: new Date().toISOString(),
      });

      // Throw appropriate auth error
      throw new BetterAuthAPIError("INTERNAL_SERVER_ERROR", {
        cause: "Failed to send invitation email. Please try again later.",
      });
    }
  },
};

export const magicLinkConfig = {
  sendMagicLink: async ({ email, url }: { email: string; url: string }) => {
    try {
      const result = await sendEmail({
        to: email,
        subject: "Login to your account",
        template: "MAGIC_LINK",
        data: { url },
      });

      if (!result.success) {
        throw result.error;
      }
    } catch (error) {
      if (error instanceof EmailRateLimitError) {
        throw new BetterAuthAPIError("TOO_MANY_REQUESTS", {
          cause: "Too many login attempts. Please try again later.",
        });
      }
      console.error("Failed to send login email:", {
        error: error instanceof Error ? JSON.stringify(error) : "Unknown error",
        email,
        url,
        timestamp: new Date().toISOString(),
      });
      throw new BetterAuthAPIError("INTERNAL_SERVER_ERROR", {
        cause: "Failed to send login email. Please try again later.",
      });
    }
  },
};

export const getActiveOrganization = async ({ userId }: { userId: string }) => {
  try {
    // Get active organization from userId using the member table
    const existingMemberships = await db.query.member.findFirst({
      where: eq(member.userId, userId),
    });

    if (!existingMemberships) {
      console.log(
        "getActiveOrganization: No active organization found for user:",
        userId
      );
      return null;
    }

    const activeOrganization = await db.query.organization.findFirst({
      where: eq(organization.id, existingMemberships.organizationId),
    });

    if (!activeOrganization) {
      console.log(
        "getActiveOrganization: No active organization found for user:",
        userId
      );
      return null;
    }

    return activeOrganization;
  } catch (error) {
    console.error("Failed to get active organization:", error);
    return null;
  }
};
