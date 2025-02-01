import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { isQueryError } from "@/lib/query/types";
import { createApiResponseSchema, IApiResponse } from "@/lib/schemas/api";

export function useApiQuery<T extends z.ZodType>(
  key: readonly unknown[],
  queryFn: () => Promise<z.infer<T>>,
  schema: T,
  options?: Omit<
    UseQueryOptions<IApiResponse<z.infer<T>>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<IApiResponse<z.infer<T>>>({
    queryKey: key,
    queryFn: async () => {
      const data = await queryFn();
      return createApiResponseSchema(schema).parse(data);
    },
    meta: {
      onError: (error: unknown) => {
        const message = isQueryError(error)
          ? error.message
          : "An unexpected error occurred";
        toast.error(message);
      },
    },
    ...options,
  });
}
