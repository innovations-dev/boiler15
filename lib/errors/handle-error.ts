import { ApiError } from "@/lib/query/error";
import { createApiResponse } from "@/lib/schemas/api";
import type { ApiResponse } from "@/lib/schemas/api";

export function handleError(error: unknown): ApiResponse<null> {
  console.error("Error:", error);

  if (error instanceof ApiError) {
    return createApiResponse(null, {
      message: error.message,
      code: error.name,
      status: error.statusCode,
    });
  }

  if (error instanceof Error) {
    return createApiResponse(null, {
      message: error.message,
      code: error.name,
      status: 500,
    });
  }

  return createApiResponse(null, {
    message: "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
    status: 500,
  });
}
