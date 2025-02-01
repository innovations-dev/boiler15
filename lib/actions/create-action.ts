import { z } from "zod";

import { handleError } from "@/lib/errors/handle-error";
import { createApiResponse } from "@/lib/schemas/api";
import type { ApiResponse } from "@/lib/schemas/api";

export async function createAction<Input, Output>({
  schema,
  handler,
  input,
}: {
  schema?: z.ZodType<Input>;
  handler: (validatedInput: Input) => Promise<Output>;
  input: Input;
}): Promise<ApiResponse<Output | null>> {
  try {
    // Validate input if schema provided
    const validatedInput = schema ? schema.parse(input) : input;

    // Execute handler with validated input
    const result = await handler(validatedInput);

    // Return successful response
    return createApiResponse(result);
  } catch (error) {
    return handleError(error);
  }
}
