"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

import { errorLogger, ErrorSource } from "@/lib/logger/enhanced-logger";
import { cacheConfig } from "@/lib/query/cache-config";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        ...cacheConfig.queries.default,
        meta: {
          onError: (error: unknown) => {
            errorLogger.log(error, ErrorSource.QUERY, {
              context: "QueryClient:query",
            });
          },
        },
      },
      mutations: {
        retry: 1,
        onError: (error) => {
          errorLogger.log(error, ErrorSource.MUTATION, {
            context: "QueryClient:mutation",
          });
          const message =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          toast.error(message);
        },
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
