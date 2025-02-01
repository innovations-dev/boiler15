import { z } from "zod";

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  status: z.number(),
});

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const handleApiError = (error: unknown): Response => {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    return Response.json(
      { code: error.code, message: error.message },
      { status: error.status }
    );
  }

  if (error instanceof z.ZodError) {
    return Response.json(
      {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        errors: error.errors,
      },
      { status: 400 }
    );
  }

  return Response.json(
    { code: "INTERNAL_ERROR", message: "Internal server error" },
    { status: 500 }
  );
};
