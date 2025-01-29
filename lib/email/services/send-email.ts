import { Resend } from "resend";

import { env } from "@/env";

export const VERIFY_API_PATH = "/api/auth/verify-email";
export const resend = new Resend(env.RESEND_API_KEY);

export const from = env.EMAIL_FROM;
// const to = env.TEST_EMAIL;

const EMAIL_RETRY_COUNT = 3;
const EMAIL_RETRY_DELAY = 1000; // 1 second

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email.
 * @param emailData - The email data to send. Use for transactional and non-time sensitive emails
 * @returns The result of the email send operation.
 */
export async function sendEmail({ to, subject, html }: EmailData) {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    // Log the full error details in development
    if (process.env.NODE_ENV === "development") {
      console.error("Full error details:", JSON.stringify(error, null, 2));
    }
    return { success: false, error };
  }
}

/**
 * Send an email with retry logic. = use for auth flows and time sensitive emails
 * @param emailData - The email data to send. { to, subject, html }
 * @returns The result of the email send operation.
 * @throws An error if all retries fail.
 */
export async function sendEmailWithRetry(emailData: EmailData) {
  for (let i = 0; i < EMAIL_RETRY_COUNT; i++) {
    try {
      const result = await sendEmail(emailData);
      if (!result.error) return result;
    } catch (error) {
      if (i === EMAIL_RETRY_COUNT - 1) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, EMAIL_RETRY_DELAY * (i + 1))
      );
    }
  }
}
