import { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "./keys";

export function invalidateAdminQueries(queryClient: QueryClient) {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.admin.all,
  });
}
