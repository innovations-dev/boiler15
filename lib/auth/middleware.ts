import { type NextRequest } from "next/server";

import { authService } from "../services/auth-service";

/**
 * Middleware to check permissions for both system and organization-level access.
 * This is a higher-level wrapper around authService.validateRequest that provides
 * a simpler interface for route handlers.
 *
 * @param request - The incoming request
 * @param permission - Required permission string (e.g., "organization:edit")
 * @param organizationId - Optional organization ID for org-specific checks
 * @returns The validated session data
 * @throws ApiError if unauthorized or insufficient permissions
 *
 * @example
 * ```ts
 * // API route handler with organization-specific permission
 * export async function POST(
 *   request: NextRequest,
 *   { params: { organizationId } }: { params: { organizationId: string } }
 * ) {
 *   await withPermission(
 *     request,
 *     PERMISSIONS.ORGANIZATION.MANAGE_MEMBERS,
 *     organizationId
 *   );
 *   // ... handle request
 * }
 *
 * // System-level permission check
 * export async function GET(request: NextRequest) {
 *   await withPermission(request, PERMISSIONS.ADMIN.VIEW_AUDIT_LOGS);
 *   // ... handle request
 * }
 * ```
 */
export async function withPermission(
  request: NextRequest,
  permission: string,
  organizationId?: string
) {
  return authService.validateRequest(request, permission, organizationId);
}

/**
 * Middleware to check if the user is an admin
 * 
 * @param request - The incoming request
 * @returns The validated session
 * 
 * @Usage
 * ```ts
 * export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Ensure user has permission to edit organization
  const session = await withPermission(
    request,
    PERMISSIONS.ORGANIZATION.EDIT,
    params.id
  );

  // If we get here, user is authorized
  // Continue with organization update logic...
}
 * ```
 */
