import { z } from "zod";

import { handleError } from "@/lib/errors/handle-error";
import {
  API_ERROR_CODES,
  createApiResponse,
  type ApiResponse,
} from "@/lib/schemas/api-types";

/**
 * A generic utility function for creating type-safe server actions with input validation and error handling.
 *
 * @template Input - The type of the input data
 * @template Output - The type of the successful response data
 *
 * @param {Object} options - The configuration options
 * @param {z.ZodType<Input>} [options.schema] - Optional Zod schema for input validation
 * @param {(validatedInput: Input) => Promise<Output>} options.handler - Async function to process the validated input
 * @param {Input} options.input - The input data to validate and process
 *
 * @returns {Promise<ApiResponse<Output | null>>} A type-safe API response object
 *
 * @example
 * // Basic usage without validation
 * const createUser = async (input: UserInput) => {
 *   return createAction({
 *     handler: async (data) => {
 *       const user = await db.insert(users).values(data);
 *       return user;
 *     },
 *     input,
 *   });
 * };
 *
 * @example
 * // With input validation
 * const createOrganization = async (input: OrganizationInput) => {
 *   return createAction({
 *     schema: organizationSchema,
 *     handler: async (data) => {
 *       const org = await db.insert(organizations).values(data);
 *       return org;
 *     },
 *     input,
 *   });
 * };
 *
 * @example
 * // Error handling in component
 * const response = await createOrganization(input);
 * if (response.error) {
 *   toast.error(response.error.message);
 *   return;
 * }
 * toast.success("Organization created!");
 */
export async function createAction<Input, Output>({
  schema,
  handler,
  input,
  context = "unknown",
}: {
  schema?: z.ZodType<Input>;
  handler: (validatedInput: Input) => Promise<Output>;
  input: Input;
  context?: string;
}): Promise<ApiResponse<Output | null>> {
  try {
    const validatedInput = schema ? schema.parse(input) : input;
    const result = await handler(validatedInput);

    return createApiResponse(result, {
      message: "Operation completed successfully",
      status: 200,
    });
  } catch (error) {
    const handledError = await handleError(error, context);

    return {
      data: null,
      error: {
        code: handledError.error?.code ?? API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: handledError.error?.message ?? "An unknown error occurred",
        status: handledError.error?.status ?? 500,
      },
      success: false,
    };
  }
}
