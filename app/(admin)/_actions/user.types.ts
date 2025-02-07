import { z } from "zod";

import { userInsertSchema } from "@/lib/db/schema";

export const createUserSchema = userInsertSchema
  .pick({
    name: true,
    email: true,
  })
  .extend({
    password: z.string().min(8),
    role: z.string(),
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;

export interface BanUserInput {
  userId: string;
  reason?: string;
}

export interface SetRoleInput {
  userId: string;
  role: string;
}
