/**
 * @DEPRECATED: NOT USED ANYMORE
 *
 * Email service module for authentication-related emails
 * @module lib/auth/emails
 */

"use server";

import { APIError as BetterAuthAPIError } from "better-auth/api";
import { UserWithRole } from "better-auth/plugins";

import { getVerificationEmail } from "@/emails/verification-email";
import { EmailRateLimitError } from "@/lib/email";
import { sendEmail } from "@/lib/email/services/email-service";
import { sendEmailWithRetry } from "@/lib/email/services/send-email";

/**
 * Sends a verification email to a user
 *
 * @param {Object} params - The parameters for sending verification email
 * @param {UserWithRole} params.user - The user object containing email and role
 * @param {string} params.url - The verification URL
 *
 * @throws {BetterAuthAPIError} When rate limit is exceeded or email fails to send
 *
 * @example
 * ```ts
 * await sendVerificationEmail({
 *   user: newUser,
 *   url: "https://example.com/verify?token=abc"
 * });
 * ```
 */
export async function sendVerificationEmail({
  user,
  url,
}: {
  user: UserWithRole;
  url: string;
}) {
  try {
    const result = await sendEmailWithRetry({
      to: user.email,
      subject: "Verify your email address",
      html: await getVerificationEmail(url),
    });

    if (!result.success) {
      throw result.error;
    }

    console.log("Verification email sent successfully:", {
      to: user.email.split("@")[0] + "@***",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof EmailRateLimitError) {
      throw new BetterAuthAPIError("TOO_MANY_REQUESTS", {
        message: "Too many verification attempts. Please try again later.",
      });
    }

    console.error("Failed to send verification email:", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    throw new BetterAuthAPIError("INTERNAL_SERVER_ERROR", {
      message: "Failed to send verification email. Please try again later.",
    });
  }
}
