"use server";

import { createAction } from "@/lib/actions/create-action";
import { organizationService } from "@/lib/services/organization-service";

export async function getOrganizationStats(organizationId: string) {
  return createAction({
    handler: async () => {
      const response =
        await organizationService.getOrganizationStats(organizationId);
      console.log("🚀 ~ response:", response);
      return response;
    },
    input: organizationId,
    context: "getOrganizationStats",
  });
}
