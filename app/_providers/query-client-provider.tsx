"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/error";
import {
  errorLogger,
  ErrorSeverity,
  ErrorSource,
} from "@/lib/logger/enhanced-logger";
import { cacheConfig } from "@/lib/query/cache-config";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        ...cacheConfig.queries.default,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400) return false;
          return failureCount < 3;
        },
        meta: {
          onError: (error: unknown) => {
            errorLogger.log(error, ErrorSource.QUERY, {
              context: "QueryClient:query",
              severity:
                error instanceof ApiError && error.status >= 500
                  ? ErrorSeverity.ERROR
                  : ErrorSeverity.WARNING,
            });
          },
        },
      },
      mutations: {
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400) return false;
          return failureCount < 2;
        },
        onError: (error) => {
          errorLogger.log(error, ErrorSource.MUTATION, {
            context: "QueryClient:mutation",
            severity:
              error instanceof ApiError && error.status >= 500
                ? ErrorSeverity.ERROR
                : ErrorSeverity.WARNING,
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
