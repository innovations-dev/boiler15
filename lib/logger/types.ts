/**
 * @fileoverview Defines the type system and schemas for the application's error logging infrastructure.
 * @module lib/logger/types
 */

import { z } from "zod";

import { API_ERROR_CODES } from "../schemas/api-types";

/**
 * @enum {string}
 * @description Identifies the origin/source of an error in the application
 * @example
 * // Using ErrorSource in error logging
 * logger.error("Failed to authenticate", {
 *   source: ErrorSource.AUTH,
 *   severity: ErrorSeverity.ERROR
 * });
 */
export enum ErrorSource {
  ACTION = "action",
  API = "api",
  HTTP = "http",
  AUTH = "auth",
  DATABASE = "database",
  EMAIL = "email",
  VALIDATION = "validation",
  ROUTE = "route",
  FORM = "form",
  UNKNOWN = "unknown",
  QUERY = "query",
  MUTATION = "mutation",
}

/**
 * @enum {string}
 * @description Defines the severity levels for error logging
 * @example
 * logger.log("Cache miss", { severity: ErrorSeverity.DEBUG });
 */
export enum ErrorSeverity {
  FATAL = "fatal",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  DEBUG = "debug",
}

/**
 * @description Zod schema for validating error metadata structure
 * @example
 * const metadata = {
 *   source: ErrorSource.API,
 *   severity: ErrorSeverity.ERROR,
 *   code: "UNAUTHORIZED",
 *   timestamp: new Date().toISOString(),
 *   environment: "production"
 * };
 * const result = errorMetadataSchema.safeParse(metadata);
 */
export const errorMetadataSchema = z.object({
  source: z.nativeEnum(ErrorSource),
  severity: z.nativeEnum(ErrorSeverity),
  code: z.enum(Object.values(API_ERROR_CODES) as [string, ...string[]]),
  userId: z.string().optional(),
  requestId: z.string().optional(),
  path: z.string().optional(),
  context: z.string().optional(),
  timestamp: z.string(),
  details: z.record(z.unknown()).optional(),
  environment: z.enum(["development", "test", "production"]),
  browser: z
    .object({
      name: z.string(),
      version: z.string(),
    })
    .optional(),
  performance: z
    .object({
      timing: z.record(z.number()),
    })
    .optional(),
});

/**
 * @typedef {z.infer<typeof errorMetadataSchema>} ErrorMetadata
 * @description Type definition for error metadata extracted from the Zod schema
 */
export type ErrorMetadata = z.infer<typeof errorMetadataSchema>;

/**
 * @interface ErrorLogEntry
 * @description Represents a complete error log entry in the system
 * @property {string} id - Unique identifier for the error log entry
 * @property {string} message - Human-readable error message
 * @property {string} [stack] - Optional stack trace
 * @property {ErrorMetadata} metadata - Structured metadata about the error
 * @example
 * const errorLog: ErrorLogEntry = {
 *   id: "err_123",
 *   message: "Failed to process payment",
 *   stack: new Error().stack,
 *   metadata: {
 *     source: ErrorSource.API,
 *     severity: ErrorSeverity.ERROR,
 *     code: "PAYMENT_FAILED",
 *     timestamp: new Date().toISOString(),
 *     environment: "production",
 *     userId: "user_123"
 *   }
 * };
 */
export interface ErrorLogEntry {
  id: string;
  message: string;
  stack?: string;
  metadata: ErrorMetadata;
}
