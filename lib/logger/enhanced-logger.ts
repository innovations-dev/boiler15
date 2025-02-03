/**
 * @fileoverview Enhanced error logging system with throttling, metadata extraction, and multi-destination reporting capabilities.
 * @module lib/logger/enhanced-logger
 */

import { APIError as BetterAuthAPIError } from "better-auth/api";
import { nanoid } from "nanoid";

import { env } from "@/env";
import { ApiError } from "../api/error";
import { HttpError } from "../query/error";
import {
  ErrorLogEntry,
  ErrorMetadata,
  errorMetadataSchema,
  ErrorSeverity,
  ErrorSource,
} from "./types";

/**
 * Singleton class handling error logging with throttling and metadata enrichment.
 * @class
 * @private
 */
class ErrorLogger {
  private static instance: ErrorLogger;
  private errorCount: Map<string, number> = new Map();
  private readonly maxErrorsPerMinute = 60;

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * Logs an error with source information and additional metadata.
   * @param {unknown} error - The error to log
   * @param {ErrorSource} [source=ErrorSource.UNKNOWN] - Source of the error
   * @param {Partial<ErrorMetadata>} [additionalMetadata={}] - Additional context or metadata
   * @returns {Promise<void>}
   */
  async log(
    error: unknown,
    source: ErrorSource = ErrorSource.UNKNOWN,
    additionalMetadata: Partial<ErrorMetadata> = {}
  ): Promise<void> {
    try {
      const errorEntry = await this.createErrorEntry(
        error,
        source,
        additionalMetadata
      );

      if (this.shouldThrottle(errorEntry.metadata.code)) {
        console.warn(
          `Error logging throttled for code: ${errorEntry.metadata.code}`
        );
        return;
      }

      await this.persistError(errorEntry);
      this.incrementErrorCount(errorEntry.metadata.code);
    } catch (loggingError) {
      // Fallback error logging if something goes wrong with our error logger
      console.error("Error logger failed:", loggingError);
      console.error("Original error:", error);
    }
  }

  private async createErrorEntry(
    error: unknown,
    source: ErrorSource,
    additionalMetadata: Partial<ErrorMetadata>
  ): Promise<ErrorLogEntry> {
    const metadata = await this.extractErrorMetadata(
      error,
      source,
      additionalMetadata
    );
    const validatedMetadata = errorMetadataSchema.parse(metadata);

    return {
      id: nanoid(),
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      metadata: validatedMetadata,
    };
  }

  private async extractErrorMetadata(
    error: unknown,
    source: ErrorSource,
    additionalMetadata: Partial<ErrorMetadata>
  ): Promise<ErrorMetadata> {
    const baseMetadata: Partial<ErrorMetadata> = {
      source,
      severity: ErrorSeverity.ERROR,
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      code: "UNKNOWN_ERROR",
      context: additionalMetadata.context,
    };

    // Extract error-specific metadata
    if (error instanceof ApiError) {
      baseMetadata.code = error.code;
      baseMetadata.severity =
        error.status >= 500 ? ErrorSeverity.ERROR : ErrorSeverity.WARNING;
    } else if (error instanceof HttpError) {
      baseMetadata.code = error.code;
      baseMetadata.severity =
        error.statusCode >= 500 ? ErrorSeverity.ERROR : ErrorSeverity.WARNING;
    } else if (error instanceof BetterAuthAPIError) {
      baseMetadata.code = "UNAUTHORIZED";
      baseMetadata.severity = ErrorSeverity.WARNING;
    }

    // Add browser information if available
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent;
      const browserInfo = this.getBrowserInfo(userAgent);
      if (browserInfo) {
        baseMetadata.browser = browserInfo;
      }

      // Add performance metrics if available
      const performance = this.getPerformanceMetrics();
      if (performance) {
        baseMetadata.performance = performance;
      }
    }

    return {
      ...baseMetadata,
      ...additionalMetadata,
    } as ErrorMetadata;
  }

  private getBrowserInfo(
    userAgent: string
  ): { name: string; version: string } | undefined {
    try {
      const ua = userAgent.toLowerCase();
      let browser;
      let version;

      if (ua.includes("chrome")) {
        browser = "Chrome";
        version = ua.match(/chrome\/(\d+)/)?.[1] ?? "";
      } else if (ua.includes("firefox")) {
        browser = "Firefox";
        version = ua.match(/firefox\/(\d+)/)?.[1] ?? "";
      } else if (ua.includes("safari") && !ua.includes("chrome")) {
        browser = "Safari";
        version = ua.match(/version\/(\d+)/)?.[1] ?? "";
      } else {
        return undefined;
      }

      return { name: browser, version };
    } catch {
      return undefined;
    }
  }

  private getPerformanceMetrics():
    | { timing: Record<string, number> }
    | undefined {
    if (typeof window === "undefined" || !window.performance) return undefined;

    try {
      const timing = window.performance.timing;
      return {
        timing: {
          loadTime: timing.loadEventEnd - timing.navigationStart,
          domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
          firstByte: timing.responseStart - timing.navigationStart,
          ttfb: timing.responseStart - timing.requestStart,
        },
      };
    } catch {
      return undefined;
    }
  }

  private shouldThrottle(errorCode: string): boolean {
    const count = this.errorCount.get(errorCode) || 0;
    return count >= this.maxErrorsPerMinute;
  }

  private incrementErrorCount(errorCode: string): void {
    const count = this.errorCount.get(errorCode) || 0;
    this.errorCount.set(errorCode, count + 1);

    // Reset count after 1 minute
    setTimeout(() => {
      this.errorCount.delete(errorCode);
    }, 60000);
  }

  private async persistError(entry: ErrorLogEntry): Promise<void> {
    if (env.NODE_ENV === "development") {
      console.error(`[${entry.metadata.severity}] ${entry.metadata.source}:`, {
        message: entry.message,
        metadata: entry.metadata,
        stack: entry.stack,
      });
      return;
    }

    // TODO: Implement production error reporting
    // Example implementation with error reporting service:
    try {
      if (process.env.SENTRY_DSN) {
        // await this.sendToSentry(entry);
      }

      if (process.env.AXIOM_TOKEN) {
        // await this.sendToAxiom(entry);
      }

      // Store in database for analysis
      // await this.storeError(entry);
    } catch (reportingError) {
      console.error("Failed to report error:", reportingError);
      console.error("Original error entry:", entry);
    }
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance();

/**
 * Simplified error logging function for application-wide use.
 *
 * @param {unknown} error - The error to log
 * @param {ErrorSource} [source=ErrorSource.UNKNOWN] - Source of the error
 * @param {Partial<ErrorMetadata>} [metadata={}] - Additional metadata
 * @returns {Promise<void>}
 *
 * @example
 * // Basic error logging
 * try {
 *   await someOperation();
 * } catch (error) {
 *   await logError(error);
 * }
 *
 * @example
 * // Logging with source and metadata
 * await logError(
 *   new Error("Payment failed"),
 *   ErrorSource.PAYMENT,
 *   {
 *     context: { orderId: "123", amount: 50 },
 *     severity: ErrorSeverity.ERROR
 *   }
 * );
 *
 * @example
 * // Logging API errors
 * try {
 *   await apiCall();
 * } catch (error) {
 *   await logError(error, ErrorSource.API, {
 *     context: { endpoint: "/api/users", method: "GET" }
 *   });
 * }
 */
export async function logError(
  error: unknown,
  source: ErrorSource = ErrorSource.UNKNOWN,
  metadata: Partial<ErrorMetadata> = {}
): Promise<void> {
  return errorLogger.log(error, source, metadata);
}

/**
 * Error source enumeration indicating where the error originated.
 * @enum {string}
 */
export { ErrorSource };

/**
 * Error severity levels for categorizing errors.
 * @enum {string}
 */
export { ErrorSeverity };

/**
 * Metadata interface for error logging.
 * @typedef {Object} ErrorMetadata
 */
export type { ErrorMetadata };

/**
 * Complete error log entry structure.
 * @typedef {Object} ErrorLogEntry
 */
export type { ErrorLogEntry };

/**
 * @typedef {Object} Usage
 * @property {string} description - Enhanced error logging system for Next.js applications
 * @property {Object} features
 * @property {string} features.throttling - Prevents log flooding (max 60 errors/minute per error code)
 * @property {string} features.browserInfo - Automatically captures browser information when available
 * @property {string} features.performance - Includes performance metrics in client-side errors
 * @property {string} features.environmentAware - Different behavior for development/production
 *
 * @example
 * // Basic Setup in _app.tsx or similar:
 * import { logError, ErrorSource } from '@/lib/logger/enhanced-logger';
 *
 * // Global error boundary
 * class ErrorBoundary extends React.Component {
 *   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
 *     logError(error, ErrorSource.REACT, {
 *       context: { componentStack: errorInfo.componentStack }
 *     });
 *   }
 * }
 *
 * @example
 * // API Route Error Handling:
 * export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 *   try {
 *     // ... handler logic
 *   } catch (error) {
 *     await logError(error, ErrorSource.API, {
 *       context: {
 *         path: req.url,
 *         method: req.method,
 *         query: req.query
 *       }
 *     });
 *     res.status(500).json({ error: 'Internal Server Error' });
 *   }
 * }
 *
 * @example
 * // Client-side Error Handling:
 * try {
 *   await mutateData();
 * } catch (error) {
 *   await logError(error, ErrorSource.MUTATION, {
 *     context: { action: 'updateUser', userId: '123' },
 *     severity: ErrorSeverity.WARNING
 *   });
 * }
 */
