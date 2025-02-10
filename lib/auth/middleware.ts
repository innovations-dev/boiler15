import { type NextRequest } from "next/server";

import { authService } from "../services/auth-service";

/**
 * Middleware to check permissions for both system and organization-level access
 *
 * @param request - The incoming request
 * @param permission - Required permission
 * @param organizationId - Optional organization ID for org-specific checks
 * @returns The validated session
 * @throws ApiError if unauthorized or insufficient permissions
 *
 * @example
 * ```ts
 * // API route handler
 * export async function POST(request: NextRequest) {
 *   const session = await withPermission(
 *     request,
 *     PERMISSIONS.ORGANIZATION.MANAGE_MEMBERS,
 *     organizationId
 *   );
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
