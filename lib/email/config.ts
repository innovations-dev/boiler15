import { env } from "@/env";
import { baseURL } from "../utils";

export const emailConfig = {
  from: env.EMAIL_FROM,
  replyTo: env.EMAIL_FROM,
  baseUrl: baseURL,
  templates: {
    MAGIC_LINK: {
      subject: "Login to your account",
      expiresIn: "15 minutes",
    },
    VERIFICATION: {
      subject: "Verify your email address",
      expiresIn: "24 hours",
    },
    INVITATION: {
      subject: "Invitation to join {organizationName}",
      expiresIn: "48 hours",
    },
    RESET_PASSWORD: {
      subject: "Reset your password",
      expiresIn: "30 minutes",
    },
    EMAIL_CHANGE: {
      subject: "Confirm your new email address",
      expiresIn: "1 hour",
    },
  },
  rateLimits: {
    maxPerHour: 10,
    maxPerDay: 50,
  },
};
