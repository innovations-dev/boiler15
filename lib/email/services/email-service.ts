/**
 * @fileoverview Email service for sending templated emails using Resend and React Email
 * @module lib/email/services/email-service
 */

import { createElement } from "react";
import { render } from "@react-email/render";

import InvitationEmail from "@/emails/invitation";
// Import all email templates
import MagicLinkEmail from "@/emails/magic-link";
import ResetPasswordEmail from "@/emails/reset-password";
import VerificationEmail from "@/emails/verification-email";
import { EmailDeliveryError, EmailRateLimitError, resend } from "..";
import { emailConfig } from "../config";
import { EmailOptions, EmailResult } from "../types";

/**
 * Type definitions for email template props
 */
type TemplateProps = {
  MAGIC_LINK: { url: string };
  VERIFICATION: { url: string };
  INVITATION: {
    url: string;
    organizationName: string;
    invitedByUsername: string;
  };
  RESET_PASSWORD: { url: string; expiryTime: string };
  EMAIL_CHANGE: { url: string };
};

/**
 * Map of email templates to their React components
 */
const templateComponents = {
  MAGIC_LINK: MagicLinkEmail as React.ComponentType<
    TemplateProps["MAGIC_LINK"]
  >,
  VERIFICATION: VerificationEmail as React.ComponentType<
    TemplateProps["VERIFICATION"]
  >,
  INVITATION: InvitationEmail as React.ComponentType<
    TemplateProps["INVITATION"]
  >,
  RESET_PASSWORD: ResetPasswordEmail as React.ComponentType<
    TemplateProps["RESET_PASSWORD"]
  >,
  EMAIL_CHANGE: VerificationEmail as React.ComponentType<
    TemplateProps["EMAIL_CHANGE"]
  >,
} as const;

/**
 * Sends a templated email using Resend
 *
 * @async
 * @param {EmailOptions} options -  
 * to: string;
  subject: string;
  template: EmailTemplate;
  data: Record<string, unknown>;
 * @returns {Promise<EmailResult>} The result of sending the email
 * @throws {EmailRateLimitError} When rate limit is exceeded
 * @throws {EmailDeliveryError} When email delivery fails
 *
 * @example
 * // Send a magic link email
 * await sendEmail({
 *   to: "user@example.com",
 *   template: "MAGIC_LINK",
 *   data: {
 *     url: "https://example.com/magic-link?token=xyz"
 *   }
 * });
 *
 * @example
 * // Send an organization invitation
 * await sendEmail({
 *   to: "invitee@example.com",
 *   template: "INVITATION",
 *   data: {
 *     url: "https://example.com/invite/xyz",
 *     organizationName: "Acme Inc",
 *     invitedByUsername: "john.doe"
 *   }
 * });
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  console.log("Sending email to", options.to);
  try {
    const template = templateComponents[options.template];
    if (!template) {
      throw new Error(`Invalid email template: ${options.template}`);
    }
    console.log("Template:", template);
    const templateConfig = emailConfig.templates[options.template];
    const element = createElement(
      template as React.ComponentType<TemplateProps[typeof options.template]>,
      options.data as TemplateProps[typeof options.template]
    );
    console.log("Created element:");
    const html = await render(element);
    console.log("Created HTML:");
    const result = await resend.emails.send({
      from: emailConfig.from,
      to: options.to,
      subject: templateConfig.subject.replace(
        /{(\w+)}/g,
        (_, key) => options.data[key] as string
      ),
      html,
    });

    // Log success (omit sensitive data)
    console.log("Email sent successfully:", {
      template: options.template,
      to: options.to.split("@")[0] + "@***",
      timestamp: new Date().toISOString(),
    });

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof Error && error.message.includes("rate limit")) {
      throw new EmailRateLimitError("Email rate limit exceeded");
    }

    throw new EmailDeliveryError(
      "Failed to send email",
      error instanceof Error ? error : undefined
    );
  }
}

/*
/ In your auth handlers:
await sendEmail({
  to: user.email,
  template: "MAGIC_LINK",
  data: {
    url: magicLinkUrl,
  },
});

// For organization invites:
await sendEmail({
  to: inviteeEmail,
  template: "INVITATION",
  data: {
    url: inviteUrl,
    organizationName: org.name,
    invitedByUsername: inviter.name,
  },
});
*/
