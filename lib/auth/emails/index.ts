"use server";

import { APIError as BetterAuthAPIError } from "better-auth/api";
import { UserWithRole } from "better-auth/plugins";

import { getResetPasswordEmail } from "@/emails/reset-password";
import { getVerificationEmail } from "@/emails/verification-email";
import {
  EmailError,
  EmailRateLimitError,
  sendEmailWithRetry,
} from "@/lib/email/services/send-email";

export async function sendResetPassword({
  user,
  url,
}: {
  user: UserWithRole;
  url: string;
}) {
  try {
    const expiryTime = new Date(Date.now() + 1000 * 60 * 30).toISOString(); // 30 minutes
    const result = await sendEmailWithRetry({
      to: user.email,
      subject: "Reset your password",
      html: await getResetPasswordEmail(url, expiryTime),
    });

    if (!result.success) {
      throw result.error;
    }

    // Log successful password reset email sent (without sensitive data)
    console.log("Password reset email sent successfully:", {
      to: user.email.split("@")[0] + "@***",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Handle rate limiting specifically
    if (error instanceof EmailRateLimitError) {
      throw new BetterAuthAPIError("TOO_MANY_REQUESTS", {
        message: "Too many password reset attempts. Please try again later.",
      });
    }

    // Log the error with appropriate context
    console.error("Failed to send password reset email:", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    // Throw appropriate auth error
    throw new BetterAuthAPIError("INTERNAL_SERVER_ERROR", {
      message: "Failed to send password reset email. Please try again later.",
    });
  }
}

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

    // Log successful verification email sent (without sensitive data)
    console.log("Verification email sent successfully:", {
      to: user.email.split("@")[0] + "@***",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Handle rate limiting specifically
    if (error instanceof EmailRateLimitError) {
      throw new BetterAuthAPIError("TOO_MANY_REQUESTS", {
        message: "Too many verification attempts. Please try again later.",
      });
    }

    // Log the error with appropriate context
    console.error("Failed to send verification email:", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    // Throw appropriate auth error
    throw new BetterAuthAPIError("INTERNAL_SERVER_ERROR", {
      message: "Failed to send verification email. Please try again later.",
    });
  }
}
