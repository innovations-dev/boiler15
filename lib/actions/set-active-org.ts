"use server";

import { revalidatePath } from "next/cache";
import { betterFetch } from "@better-fetch/fetch";
import { z } from "zod";

import { createAction } from "@/lib/actions/create-action";
import { baseURL } from "@/lib/utils";

const setActiveOrgSchema = z.object({
  organizationId: z.string(),
});

export const setActiveOrganization = async (
  input: z.infer<typeof setActiveOrgSchema>
) => {
  return createAction({
    schema: setActiveOrgSchema,
    handler: async ({ organizationId }) => {
      await betterFetch("/api/auth/session", {
        method: "PATCH",
        baseURL: baseURL.toString(),
        body: JSON.stringify({
          activeOrganizationId: organizationId,
        }),
      });

      revalidatePath("/", "layout");
      return { success: true };
    },
    input,
  });
};
