"use server";

import { headers } from "next/headers";

import { createAction } from "@/lib/actions/create-action";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth/auth-client";
import { ForbiddenError, UnauthorizedError } from "@/lib/query/error";
import {
  AUDIT_ACTIONS,
  createAuditLog,
  ENTITY_TYPES,
} from "@/lib/services/audit-log";
import type { BanUserInput, CreateUserInput, SetRoleInput } from "./user.types";

export async function createUserAction(input: CreateUserInput) {
  return createAction({
    handler: async () => {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session?.user?.id) throw new UnauthorizedError("Unauthorized");

      try {
        const result = await authClient.admin.createUser(input);
        const userData = result.data?.user;

        if (!userData) {
          throw new Error("Failed to create user");
        }

        await createAuditLog({
          action: AUDIT_ACTIONS.USER.CREATE,
          entityType: ENTITY_TYPES.USER,
          entityId: userData.id,
          actorId: session.user.id,
          metadata: {
            name: input.name,
            email: input.email,
            role: input.role,
            success: true,
          },
        });

        return result;
      } catch (error) {
        await createAuditLog({
          action: AUDIT_ACTIONS.USER.CREATE,
          entityType: ENTITY_TYPES.USER,
          entityId: "failed_creation",
          actorId: session.user.id,
          metadata: {
            name: input.name,
            email: input.email,
            role: input.role,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          },
        });
        throw error;
      }
    },
    input,
  });
}

export async function banUserAction(input: BanUserInput) {
  return createAction({
    handler: async () => {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session?.user?.id) throw new UnauthorizedError("Unauthorized");

      try {
        const result = await authClient.admin.banUser({ userId: input.userId });

        await createAuditLog({
          action: AUDIT_ACTIONS.USER.BAN,
          entityType: ENTITY_TYPES.USER,
          entityId: input.userId,
          actorId: session.user.id,
          metadata: {
            reason: input.reason,
            success: true,
          },
        });

        return result;
      } catch (error) {
        await createAuditLog({
          action: AUDIT_ACTIONS.USER.BAN,
          entityType: ENTITY_TYPES.USER,
          entityId: input.userId,
          actorId: session.user.id,
          metadata: {
            reason: input.reason,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          },
        });
        throw error;
      }
    },
    input,
  });
}

export async function setUserRoleAction(input: SetRoleInput) {
  return createAction({
    handler: async () => {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session?.user?.id) throw new UnauthorizedError("Unauthorized");

      try {
        const result = await authClient.admin.setRole(input);
        const userData = result.data?.user;

        if (!userData) {
          throw new Error("Failed to update user role");
        }

        await createAuditLog({
          action: AUDIT_ACTIONS.USER.UPDATE,
          entityType: ENTITY_TYPES.USER,
          entityId: input.userId,
          actorId: session.user.id,
          metadata: {
            oldRole: userData.role,
            newRole: input.role,
            success: true,
          },
        });

        return result;
      } catch (error) {
        await createAuditLog({
          action: AUDIT_ACTIONS.USER.UPDATE,
          entityType: ENTITY_TYPES.USER,
          entityId: input.userId,
          actorId: session.user.id,
          metadata: {
            newRole: input.role,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          },
        });
        throw error;
      }
    },
    input,
  });
}
