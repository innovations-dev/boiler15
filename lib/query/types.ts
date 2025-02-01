import { z } from "zod";

import type { userSelectSchema } from "@/lib/db/schema";

export type QueryError = {
  message: string;
  code?: string;
  status?: number;
};

export type QueryResult<T> = {
  data: T;
  error?: QueryError;
};

export type PaginatedResult<T> = QueryResult<{
  items: T[];
  nextCursor?: string;
  totalCount: number;
}>;

// Type guards for error handling
export function isQueryError(error: unknown): error is QueryError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as QueryError).message === "string"
  );
}
