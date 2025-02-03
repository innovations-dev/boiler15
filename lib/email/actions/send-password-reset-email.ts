"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/email/services/email-service";

export async function sendPasswordResetEmailAction() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/reset-password`;
    const expiryTime = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes

    await sendEmail({
      to: session.user.email,
      subject: "Reset your password",
      template: "RESET_PASSWORD",
      data: {
        url: resetUrl,
        expiryTime,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send reset email:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to send reset email",
    };
  }
}
