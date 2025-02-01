import { z } from "zod";

// Base API Response Schemas
export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  status: z.number().optional(),
});

export const apiMetadataSchema = z.object({
  timestamp: z.number(),
  requestId: z.string().uuid(),
});

// Generic API Response Type matching QueryResult pattern
export interface IApiResponse<T> {
  data: T;
  error?: z.infer<typeof apiErrorSchema>;
  metadata: z.infer<typeof apiMetadataSchema>;
}

// Zod Schema for API Response
export function createApiResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    data: dataSchema,
    error: apiErrorSchema.optional(),
    metadata: apiMetadataSchema,
  }) as z.ZodType<IApiResponse<z.infer<T>>>;
}

// Pagination matching PaginatedResult pattern
export interface PaginatedData<T> {
  items: T[];
  nextCursor?: string;
  totalCount: number;
}

export interface PaginatedApiResponse<T>
  extends IApiResponse<PaginatedData<T>> {}

// Pagination Schema Builder
export function createPaginatedResponseSchema<T extends z.ZodType>(
  dataSchema: T
) {
  return createApiResponseSchema(
    z.object({
      items: z.array(dataSchema),
      totalCount: z.number().int().min(0),
      nextCursor: z.string().optional(),
    })
  ) as z.ZodType<PaginatedApiResponse<z.infer<T>>>;
}

// Helper function to create API response
export function createApiResponse<T>(
  data: T,
  error?: z.infer<typeof apiErrorSchema>
): IApiResponse<T> {
  return {
    data,
    error,
    metadata: {
      timestamp: Date.now(),
      requestId: crypto.randomUUID(),
    },
  };
}

export const paginationParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  cursor: z.string().optional(),
});

// Type exports
export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiMetadata = z.infer<typeof apiMetadataSchema>;
export type PaginationParams = z.infer<typeof paginationParamsSchema>;

export type ApiResponse<T> = IApiResponse<T>;
export type PaginatedResponse<T> = PaginatedApiResponse<T>;

// API Request Schemas
export const createOrganizationRequestSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
});

export const updateOrganizationRequestSchema =
  createOrganizationRequestSchema.partial();
