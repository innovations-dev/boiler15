import { Resend } from "resend";
import { z } from "zod";

import { env } from "@/env";

export const VERIFY_API_PATH = "/api/auth/verify-email";
export const resend = new Resend(env.RESEND_API_KEY);

export const from = env.EMAIL_FROM;
// const to = env.TEST_EMAIL;

const EMAIL_RETRY_COUNT = 3;
const EMAIL_RETRY_DELAY = 1000; // 1 second

// Email error types
export class EmailError extends Error {
  constructor(
    message: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = "EmailError";
  }
}

export class EmailRateLimitError extends EmailError {
  constructor(message: string) {
    super(message);
    this.name = "EmailRateLimitError";
  }
}

export class EmailDeliveryError extends EmailError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "EmailDeliveryError";
  }
}

// Zod schema for email data validation
const emailDataSchema = z.object({
  to: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  html: z.string().min(1, "HTML content is required"),
});

export type EmailData = z.infer<typeof emailDataSchema>;

interface EmailResult {
  success: boolean;
  data?: unknown;
  error?: EmailError;
}

/**
 * Send an email.
 * @param emailData - The email data to send. Use for transactional and non-time sensitive emails
 * @returns The result of the email send operation.
 */
export async function sendEmail(emailData: EmailData): Promise<EmailResult> {
  try {
    // Validate email data
    const validatedData = emailDataSchema.parse(emailData);

    const data = await resend.emails.send({
      from,
      ...validatedData,
    });

    // Log success with relevant details but omit sensitive information
    console.log("Email sent successfully:", {
      to: validatedData.to.split("@")[0] + "@***",
      subject: validatedData.subject,
      ...(data && typeof data === "object" && "id" in data
        ? { messageId: data.id }
        : {}),
    });

    return { success: true, data };
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.message.includes("rate limit")) {
      const rateLimitError = new EmailRateLimitError(
        "Email rate limit exceeded"
      );
      console.error("Rate limit error:", rateLimitError);
      return { success: false, error: rateLimitError };
    }

    // Handle other errors
    const emailError = new EmailDeliveryError(
      "Failed to send email",
      error instanceof Error ? error : undefined
    );

    console.error("Email delivery error:", {
      error: emailError.message,
      cause: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    // Log full error details in development
    if (process.env.NODE_ENV === "development") {
      console.error("Full error details:", JSON.stringify(error, null, 2));
    }

    return { success: false, error: emailError };
  }
}

/**
 * Send an email with retry logic. Use for auth flows and time sensitive emails
 * @param emailData - The email data to send
 * @returns The result of the email send operation
 * @throws EmailError if all retries fail
 */
export async function sendEmailWithRetry(
  emailData: EmailData
): Promise<EmailResult> {
  let lastError: EmailError | undefined;

  for (let i = 0; i < EMAIL_RETRY_COUNT; i++) {
    try {
      const result = await sendEmail(emailData);
      if (result.success) return result;

      lastError = result.error;

      // Don't retry on rate limit errors
      if (lastError instanceof EmailRateLimitError) {
        throw lastError;
      }

      // Log retry attempt
      console.log(
        `Retry attempt ${i + 1}/${EMAIL_RETRY_COUNT} for email to ${emailData.to.split("@")[0]}@***`
      );

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, EMAIL_RETRY_DELAY * Math.pow(2, i))
      );
    } catch (error) {
      lastError =
        error instanceof EmailError
          ? error
          : new EmailDeliveryError("Failed to send email", error);

      if (error instanceof EmailRateLimitError) {
        throw error;
      }
    }
  }

  // If we've exhausted all retries, throw the last error
  throw (
    lastError ??
    new EmailDeliveryError("Failed to send email after all retries")
  );
}
