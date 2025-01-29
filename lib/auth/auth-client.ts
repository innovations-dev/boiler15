import { createAuthClient } from "better-auth/client";
import { baseURL } from "../utils";
import { toast } from "sonner";
import {
  adminClient,
  magicLinkClient,
  multiSessionClient,
  organizationClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: baseURL.toString(),
  trustedOrigins: [baseURL.toString()],
  fetchOptions: {
    credentials: "include",
    onError: (error) => {
      if (error.error.status === 429) {
        console.log("Too many requests Error.", error.error.message);
        toast.error("Too many requests. Please try again later.");
      }
      console.error("BetterAuth general error:", error.error.message);
      throw new Error(error.error.message);
    },
  },
  plugins: [
    magicLinkClient(),
    multiSessionClient(),
    adminClient(),
    organizationClient(),
  ],
});
