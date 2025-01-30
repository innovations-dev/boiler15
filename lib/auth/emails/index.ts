"use server";

import { UserWithRole } from "better-auth/plugins";

import { getResetPasswordEmail } from "@/emails/reset-password";
import { sendEmailWithRetry } from "@/lib/email/services/send-email";

export async function sendResetPassword({
  user,
  url,
}: {
  user: UserWithRole;
  url: string;
}) {
  try {
    const expiryTime = new Date(Date.now() + 1000 * 60 * 30).toISOString(); // 30 minutes
    await sendEmailWithRetry({
      to: user.email,
      subject: "Reset your password",
      html: await getResetPasswordEmail(url, expiryTime),
    });
    return;
  } catch (error) {
    console.error("Failed to send reset password email", error);
    return;
  }
}
